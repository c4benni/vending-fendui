const { Product, User, sequelize } = require('../../models')

const { addTx } = require('../../utils/transactionHistory')
const {
  signedInRole,
  getChange,
  sendServerError
} = require('../../utils/utils')

module.exports = async function (req, res) {
  const callback = async () => {
    // only logged in users with role == 'buyer' can access this route.
    const { data: buyer, error } = await signedInRole({
      req,
      res,
      role: 'buyer',
      invalidRole: 'only a buyer can purchase products'
    })

    if (error) {
      return res.status(error.status).send({ error })
    }

    // all checked;
    // start the transaction;
    try {
      await sequelize.transaction(async function (tx) {
        // deduct from product.amountAvailable;

        const txError = {
          error: 1
        }

        const { id, amount } = req.body

        // valid user;
        // check product exists
        const product = await Product.findByPk(id, {
          transaction: tx
        })

        if (!product) {
          throw new Error(
            `{404} This product doesn't exist might have been deleted.`
          )
          // not found
        }

        // check that product owner isn't deleted;
        if (product.ownerDeleted) {
          throw new Error(
            `{403} The owner of this product has been deleted. Try another product`
          )
          // forbidden
        }

        // get product's total price
        // and check if user has enough money;

        const productPrice = parseFloat(product.cost)

        const parsedAmount = parseFloat(amount)

        const totalCost = productPrice * parsedAmount

        const totalDeposit = parseFloat(buyer.deposit || 0)

        // insufficient coins
        if (totalDeposit < totalCost) {
          throw new Error(
            `{403} you do not have enough coins. Deposit more and try again`
          )
          // forbidden
        }

        // check product stock is enough for purchasing amount;
        const productStock = parseFloat(product.amountAvailable || 0)

        if (productStock < parsedAmount) {
          throw new Error(
            `{403} total product left is ${product.amountAvailable}. Reduce the order quantity and try again`
          )
          // forbidden
        }

        const updateProduct = async () => {
          const updateStock = await product.update({
            amountAvailable: productStock - parsedAmount,
            transaction: tx
          })

          if (updateStock.error) {
            return txError
          }

          const saveUpdate = await product.save({
            fields: ['amountAvailable'],
            transaction: tx
          })

          if (saveUpdate.error) {
            return txError
          }

          return {}
        }

        const { error: updateProductError } = await updateProduct()

        if (updateProductError) {
          throw new Error('Update product error')
        }

        // get seller;
        const seller = await User.findByPk(product.sellerId, {
          transaction: tx
        })

        if (!seller || seller?.error) {
          throw new Error(`{403} Product's owner might have been deleted`)
        }

        // update buyer to deduct deposit;
        const updateBuyer = async () => {
          const deductDeposit = await buyer.update(
            {
              deposit: totalDeposit - totalCost
            },
            {
              transaction: tx
            }
          )

          if (deductDeposit.error) {
            return txError
          }

          const saveDeposit = await buyer.save({
            fields: ['deposit'],
            transaction: tx
          })

          if (saveDeposit.error) {
            return txError
          }

          const saveTx = await addTx({
            userId: buyer.id,
            amount: `¢${productPrice}`,
            quantity: parseFloat(amount),
            type: 'purchase',
            secondParty: seller.id,
            productId: product.id,
            transaction: tx
          })

          if (saveTx.error) {
            return txError
          }

          return {}
        }

        const { error: updateBuyerError } = await updateBuyer()

        if (updateBuyerError) {
          throw new Error('Update buyer error')
        }

        const updateSeller = async () => {
          const addIncome = await seller.update(
            {
              income: parseFloat(seller.income || 0) + totalCost
            },
            {
              transaction: tx
            }
          )

          if (addIncome.error) {
            return txError
          }

          const saveIncome = await seller.save({
            fields: ['income'],
            transaction: tx
          })

          if (saveIncome.error) {
            return txError
          }

          const saveTx = await addTx({
            userId: seller.id,
            amount: `¢${productPrice}`,
            quantity: parseFloat(amount),
            type: 'purchase',
            secondParty: buyer.id,
            productId: product.id,
            transaction: tx
          })

          if (saveTx.error) {
            return txError
          }

          return {}
        }

        const { error: updateSellerError } = await updateSeller()

        if (updateSellerError) {
          throw new Error('Update seller error')
        }

        return {}
      })
    } catch (err) {
      if (err) {
        const matchStatus = err.message.match(/^\{\d+\}/g)

        // defined error
        if (matchStatus) {
          const status = matchStatus[0].replace(/\{|\}/g, '')

          return res.status(status).send({
            error: {
              message: err.message.replace(/^\{\d+\}\s/, '')
            }
          })
        }

        // conflict error
        return res.status(409).send({
          error: {
            message: err.message
          }
        })
      }
    }

    res.status(200).send({
      data: {
        message: 'Purchase successfully made',
        change: getChange(buyer.deposit || 0),
        changeTotal: buyer.deposit
      }
    })
  }

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

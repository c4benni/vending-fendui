const { Product, User, sequelize } = require('../models')

const attempt = require('../utils/attempt')
const { addTx } = require('../utils/transactionHistory')
const { signedInRole, getChange } = require('../utils/utils')

module.exports = {
  async deposit(req, res) {
    const mainCallback = async () => {
      const { data: user, error } = await signedInRole({
        req,
        role: 'buyer',
        invalidRole: 'only a buyer can deposit coins',
        res
      })

      if (error) {
        return res.status(error.status).send({
          error
        })
      }

      // all checked;
      // extract fields from query
      // get buyer's deposit and update deposit[req.query.amount]
      // += req.query.quantity;
      const { amount, quantity } = req.body

      const depositTotal = parseFloat(quantity) * parseFloat(amount)

      await user.update({
        deposit: parseFloat(user.deposit) + depositTotal
      })

      const saveTx = await addTx({
        userId: user.id,
        amount: `¢${amount}`,
        quantity: parseFloat(quantity),
        type: 'deposit'
      })

      if (saveTx.error) {
        return res.status(500).send({ error })
      }

      await user.save({
        fields: ['deposit']
      })

      res.status(200).send({
        data: {
          message: 'deposit successfully made',
          deposit: user.deposit
        }
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  async buy(req, res) {
    const mainCallback = async () => {
      // only logged in users with role == 'buyer' can access this route.
      const { data: user, error } = await signedInRole({
        req,
        res,
        role: 'buyer',
        invalidRole: 'only a buyer can purchase products'
      })

      if (error) {
        return res.status(error.status).send({ error })
      }

      const { id, amount } = req.body

      // valid user;
      // check product exists
      const product = await Product.findOne({
        where: { id }
      })

      if (!product) {
        return res.status(400).send({
          error: {
            message: "this product doesn't exist might have been deleted.",
            status: 404
          }
        })
        // not found
      }

      // check that product owner isn't deleted;
      if (product.ownerDeleted) {
        return res.status(403).send({
          error: {
            message:
              'the owner of this product has been deleted. Try another product',
            status: 403
          }
        })
        // forbidden
      }

      // get product's total price
      // and check if user has enough money;

      const productPrice = parseFloat(product.cost)

      const parsedAmount = parseFloat(amount)

      const totalCost = productPrice * parsedAmount

      const totalDeposit = parseFloat(user.deposit)

      // insufficient coins
      if (totalDeposit < totalCost) {
        return res.status(403).send({
          error: {
            message: `you do not have enough coins. Deposit more and try again`,
            status: 403
          }
        })
        // forbidden
      }

      // check product stock is enough for purchasing amount;
      const productStock = parseFloat(product.amountAvailable || 0)

      if (productStock < parsedAmount) {
        return res.status(403).send({
          error: {
            message: `total product left is ${product.amountAvailable}. Reduce the order quantity and try again`,
            status: 403
          }
        })
        // forbidden
      }

      // all checked;
      // start the transaction;

      const buyTx = await sequelize.transaction(async function (tx) {
        // deduct from product.amountAvailable;

        const txError = {
          error: 1
        }

        const updateProduct = async () => {
          const updateStock = await product.update({
            amountAvailable: productStock - parsedAmount
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

        // update buyer to deduct deposit;
        const updateBuyer = async () => {
          const deductDeposit = await user.update(
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

          const saveDeposit = await user.save({
            fields: ['deposit'],
            transaction: tx
          })

          if (saveDeposit.error) {
            return txError
          }

          return {}
        }

        const { error: updateBuyerError } = await updateBuyer()

        if (updateBuyerError) {
          throw new Error('Update buyer error')
        }

        const updateSeller = async () => {
          const seller = await User.findOne(
            {
              where: {
                id: product.sellerId
              }
            },
            { transaction: tx }
          )

          if (seller) {
            const addIncome = await seller.update({
              income: parseFloat(seller.income) + totalCost,
              transaction: tx
            })

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
          } else {
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

      // conflict error
      if (buyTx.error) {
        return res.status(409).send({
          error: {
            message: buyTx.error.message
          }
        })
      }

      res.status(200).send({
        data: {
          message: 'deposit successfully made',
          purchased: user.purchased,
          change: getChange(user.deposit),
          changeTotal: user.deposit
        }
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  async reset(req, res) {
    const mainCallback = async () => {
      const { data: user, error } = await signedInRole({
        req,
        role: 'buyer',
        invalidRole: 'only a buyer can reset deposit',
        res
      })

      if (error) {
        return res.status(error.status).send({ error })
      }

      await user.update({
        deposit: 0
      })

      await user.save({
        fields: ['deposit']
      })

      res.send({
        data: {
          message: 'reset successful',
          deposit: user.deposit
        }
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  }
}

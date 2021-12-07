const { Product, User } = require('../models')
const attempt = require('../utils/attempt')
const sendError = require('../utils/sendError')
const { app } = require('../config/config')
const { signedInRole, defaultDeposit } = require('../utils/utils')

module.exports = {
  async deposit(req, res) {
    const mainCallback = async () => {
      await attempt({
        express: { res },
        callback: async () => {
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

          if (!app.validCost.includes(parseFloat(amount))) {
            return res.status(400).send({
              message: `${amount} cent coins are not accepted`
            })
            // bad request
          }

          const freshDeposit = {
            ...(user.deposit || {})
          }

          const parsedQuantity = parseFloat(quantity)

          if (!freshDeposit[`${amount}`]) {
            freshDeposit[`${amount}`] = parsedQuantity
          } else {
            freshDeposit[`${amount}`] += parsedQuantity
          }

          await user.update({
            deposit: freshDeposit
          })

          await user.save({
            fields: ['deposit']
          })

          res.status(200).send({
            data: {
              message: 'deposit successfully made',
              deposit: user.deposit
            }
          })
        },
        errorMessage: (err) => ({
          message: err.message,
          status: 403
        })
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  async buy(req, res) {
    const mainCallback = async () => {
      await attempt({
        express: { res },
        callback: async () => {
          // only logged in users with role == 'buyer' can access this route.
          const { data: user, error } = await signedInRole({
            req,
            role: 'buyer',
            invalidRole: 'only a buyer can purchase products',
            res
          })

          if (error) {
            return sendError.withStatus(res, error)
          }

          const { id, amount } = req.body

          const parsedAmount = parseFloat(amount)

          // valid user;
          // check product exists
          const product = await Product.findOne({
            where: { id }
          })

          if (!product) {
            return sendError.withStatus(res, {
              message: "this product doesn't exist might have been deleted.",
              status: 404
              // not found
            })
          }

          // check that product isn't deleted;
          if (product.ownerDeleted) {
            return sendError.withStatus(res, {
              message:
                'the owner of this product has been deleted. Try another product',
              status: 403
              // unauthorized
            })
          }

          // get product's price
          // and check if user has those coins;
          // and user has sufficient of those coins;
          const productPrice = `${product.cost}`

          // user coins that matches product's cost;
          const userProductCoins = user.deposit?.[`${productPrice}`] || 0

          // no coin
          if (!userProductCoins) {
            return sendError.withStatus(res, {
              message:
                'you do not have the available coins to purchase this product. Deposit some coins and try again',
              status: 403
              // unauthorized
            })
          }

          // insufficient coins
          if (userProductCoins < parsedAmount) {
            return sendError.withStatus(res, {
              message: `you do not have enough ${productPrice} cent coins. Deposit more and try again`,
              status: 403
              // unauthorized
            })
          }

          // check product stock is enough for purchasing amount;
          const productStock = parseFloat(product.amountAvailable || 0)

          if (productStock < parsedAmount) {
            return sendError.withStatus(res, {
              message: `total product left is ${product.amountAvailable}. Try again`,
              status: 403
              // unauthorized
            })
          }

          // all checked;
          // push product to user.purchased
          const freshPurchased = [...(user.purchased || [])]

          const reciept = {
            timeStamp: Date.now(),
            id,
            amount
          }

          freshPurchased.push(reciept)

          // deduct from product.amountAvailable;
          await product.update({
            amountAvailable: productStock - parsedAmount
          })

          await product.save({
            fields: ['amountAvailable']
          })

          // update user's purchases and deduct deposit;
          const userDeposit = {
            ...user.deposit
          }

          userDeposit[productPrice] =
            parseFloat(userDeposit[productPrice] || 0) - parsedAmount

          await user.update({
            purchased: freshPurchased,
            deposit: userDeposit
          })

          await user.save({
            fields: ['purchased', 'deposit']
          })

          const spent = {
            total: productPrice * amount,
            coins: productPrice,
            amount
          }

          await user.save({
            fields: ['purchased', 'deposit']
          })

          // update seller's income;
          const seller = await User.findOne({
            where: {
              id: product.sellerId
            }
          })

          if (seller) {
            const sellerIncome = {
              ...(seller.income || {})
            }

            sellerIncome[productPrice] =
              parseFloat(sellerIncome[productPrice] || 0) + parsedAmount

            await seller.update({
              income: sellerIncome
            })

            await seller.save({
              fields: ['income']
            })
          }

          res.status(200).send({
            data: {
              message: 'deposit successfully made',
              spent,
              purchased: user.purchased,
              change: user.deposit
            }
          })
        },
        errorMessage: (err) => ({
          message: err.message,
          status: 403
        })
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  async reset(req, res) {
    const mainCallback = async () => {
      await attempt({
        express: { res },
        callback: async () => {
          const { data: user, error } = await signedInRole({
            req,
            role: 'buyer',
            invalidRole: 'only a buyer can reset deposit',
            res
          })

          if (error) {
            return sendError.withStatus(res, error)
          }

          await user.update({
            deposit: defaultDeposit()
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
        },
        errorMessage: (err) => ({
          message: err.message,
          status: 403
        })
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  }
}

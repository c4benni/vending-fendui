const { sequelize } = require('../../models')

const { addTx } = require('../../utils/transactionHistory')
const { signedInRole, sendServerError } = require('../../utils/utils')

module.exports = async function (req, res) {
  const callback = async () => {
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
    try {
      await sequelize.transaction(async function (tx) {
        const { amount, quantity } = req.body

        const depositTotal = parseFloat(quantity) * parseFloat(amount)

        const updateUser = await user.update(
          {
            deposit: parseFloat(user.deposit || 0) + depositTotal
          },
          {
            transaction: tx
          }
        )

        if (updateUser.error) {
          throw new Error('Update user error')
        }

        const saveTx = await addTx({
          userId: user.id,
          amount: `¢${amount}`,
          quantity: parseFloat(quantity),
          type: 'deposit',
          transaction: tx
        })

        if (saveTx.error) {
          throw new Error('Error saving transaction')
        }

        const saveDeposit = await user.save({
          fields: ['deposit'],
          transaction: tx
        })

        if (saveDeposit.error) {
          throw new Error('Error saving deposit')
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
        message: 'Deposit successfully made',
        deposit: user.deposit
      }
    })
  }

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

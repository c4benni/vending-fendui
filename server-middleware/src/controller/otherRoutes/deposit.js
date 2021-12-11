const attempt = require('../../utils/attempt')
const { addTx } = require('../../utils/transactionHistory')
const { signedInRole } = require('../../utils/utils')

module.exports = async function (req, res) {
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
      deposit: parseFloat(user.deposit || 0) + depositTotal
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
        message: 'Deposit successfully made',
        deposit: user.deposit
      }
    })
  }

  await attempt({
    express: { res },
    callback: mainCallback
  })
}

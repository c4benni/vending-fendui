const { TransactionHistory } = require('../models')

const attempt = require('../utils/attempt')

module.exports = {
  async transactionHistory(req, res) {
    const mainCallback = async () => {
      const { id } = req.cookies

      const { limit, offset } = req.query

      const transactions = await TransactionHistory.findAll({
        where: {
          userId: id
        },
        limit,
        offset,
        attributes: ['timestamp', 'type', 'amount', 'quantity'],
        raw: true,
        order: [['timestamp', 'DESC']]
      })

      if (!transactions.error) {
        res.status(200).send({
          data: transactions,
          length: transactions.length
        })
      } else {
        res.status(404).send({
          error: {
            message: 'No transaction found',
            status: 404
          }
        })
      }
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  }
}
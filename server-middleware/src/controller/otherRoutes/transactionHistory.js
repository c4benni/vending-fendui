const { TransactionHistory } = require('../../models')
const { sendServerError } = require('../../utils/utils')

module.exports = async function (req, res) {
  const callback = async () => {
    const { id } = req.cookies

    const { limit, offset } = req.query

    const transactions = await TransactionHistory.findAll({
      where: {
        userId: id
      },
      limit,
      offset,
      attributes: [
        'id',
        'timestamp',
        'type',
        'amount',
        'quantity',
        'secondParty',
        'productId'
      ],
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

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

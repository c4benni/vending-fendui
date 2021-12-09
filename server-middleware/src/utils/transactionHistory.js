const { TransactionHistory } = require('../models')

module.exports = {
  async addTx({ userId, type, amount, quantity }) {
    // save transaction;
    const saveTx = await TransactionHistory.create({
      userId,
      type,
      amount,
      quantity
    })

    if (saveTx.error) {
      return {
        error: {
          message: 'Oops! An error occured'
        }
      }
    }
    return { data: 1 }
  }
}

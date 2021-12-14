const { TransactionHistory } = require('../models')

module.exports = {
  async addTx({
    userId,
    type,
    amount,
    quantity,
    secondParty = null,
    productId = null,
    transaction
  }) {
    // save transaction;
    const saveTx = await TransactionHistory.create(
      {
        userId,
        type,
        amount,
        quantity,
        secondParty,
        productId
      },
      { transaction }
    )

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

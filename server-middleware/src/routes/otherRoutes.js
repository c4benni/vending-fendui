const controller = require('../controller/otherRoutes')

const {
  deposit: depositMiddleware,
  buy: buyMiddleware,
  reset: resetMiddleware,
  transactionHistory: transactionHistoryPolicy
} = require('../policies/otherRoutes')

module.exports = [
  {
    method: 'get',
    url: '/transaction',
    middleWare: transactionHistoryPolicy,
    callback: controller.transactionHistory
  },

  {
    method: 'post',
    url: '/deposit',
    middleWare: depositMiddleware,
    callback: controller.deposit
  },
  {
    method: 'post',
    url: '/buy',
    middleWare: buyMiddleware,
    callback: controller.buy
  },
  {
    method: 'post',
    url: '/reset',
    middleWare: resetMiddleware,
    callback: controller.reset
  }
]

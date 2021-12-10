const controller = require('../controller/clientRoutes')

const policies = require('../policies/clientRoutes')

module.exports = [
  {
    method: 'get',
    url: '/transaction',
    middleWare: policies.transactionHistory,
    callback: controller.transactionHistory
  }
]

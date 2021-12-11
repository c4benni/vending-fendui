const policies = require('../policies/Product')
const controller = require('../controller/Product')

module.exports = [
  {
    method: 'post',
    url: '/product',
    middleWare: policies.createProduct,
    callback: controller.createProduct
  },
  {
    method: 'get',
    url: '/product',
    middleWare: policies.getProduct,
    callback: controller.getProduct
  },
  {
    method: 'get',
    url: '/product/all',
    middleWare: policies.getAllProducts,
    callback: controller.getAllProducts
  },
  {
    method: 'patch',
    url: '/product',
    middleWare: policies.updateProduct,
    callback: controller.updateProduct
  },
  {
    method: 'delete',
    url: '/product',
    middleWare: policies.deleteProduct,
    callback: controller.deleteProduct
  },
  {
    method: 'delete',
    url: '/product/multiple',
    middleWare: policies.deleteMultipleProducts,
    callback: controller.deleteMultipleProducts
  }
]

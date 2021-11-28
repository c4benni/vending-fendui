const controller = require('../controller/controller')

const ProductPolicies = require('../policies/Product');
const ProductController = require('../controller/Product')

const {
    deposit: depositMiddleware,
    buy: buyMiddleware,
    reset: resetMiddleware
} = require('../policies/policies');

module.exports = [
        {
            method: 'post',
            url: '/product',
            middleWare: ProductPolicies.createProduct,
            callback: ProductController.createProduct
        },
        {
            method: 'get',
            url: '/product',
            middleWare: ProductPolicies.readProduct,
            callback: ProductController.readProduct
        },
        {
            method: 'get',
            url: '/product/all',
            middleWare: ProductPolicies.readAllProducts,
            callback: ProductController.readAllProducts
        },
        {
            method: 'patch',
            url: '/product',
            middleWare: ProductPolicies.patchProduct,
            callback: ProductController.patchProduct
        },
        {
            method: 'delete',
            url: '/product',
            middleWare: ProductPolicies.deleteProduct,
            callback: ProductController.deleteProduct
        },
        {
            method: 'delete',
            url: '/product/multiple',
            middleWare: ProductPolicies.deleteMultipleProducts,
            callback: ProductController.deleteMultipleProducts
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
        },
    ]
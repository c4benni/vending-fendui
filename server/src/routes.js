const UserPolicies = require('./policies/User');
const UserController = require('./controller/User')
const controller = require('./controller/controller')

const ProductPolicies = require('./policies/Product');
const ProductController = require('./controller/Product')

const { base } = require('./config/config');
const jwt = require('./utils/jwt');
const {
    deposit: depositMiddleware,
    buy: buyMiddleware
} = require('./policies/policies');

module.exports = function (app) {

    const User = [
        {
            method: 'post',
            url: '/user/register',
            middleWare: [
                UserPolicies.register
            ],
            callback: UserController.register
        },
        {
            method: 'post',
            url: '/user/login',
            middleWare: [
                UserPolicies.login
            ],
            callback: UserController.login
        },
        {
            method: 'post',
            url: '/user/logout',
            middleWare: [
                UserPolicies.logout
            ],
            callback: UserController.logout
        },
        {
            method: 'post',
            url: '/user/logout/all',
            middleWare: [
                UserPolicies.logout
            ],
            callback: UserController.logoutAll
        },

        {
            method: 'get',
            url: '/user',
            middleWare: [
                UserPolicies.getUser
            ],
            callback: UserController.getUser
        },
        {
            method: 'get',
            url: '/user/all',
            middleWare: [
                UserPolicies.getAllUsers
            ],
            callback: UserController.getAllUsers
        },
        {
            method: 'patch',
            url: '/user',
            middleWare: [
                UserPolicies.updateUser
            ],
            callback: UserController.updateUser
        },
        {
            method: 'delete',
            url: '/user',
            middleWare: [
                UserPolicies.deleteUser
            ],
            callback: UserController.deleteUser
        }
    ];

    const Product = [
        {
            method: 'post',
            url: '/product',
            middleWare: [
                ProductPolicies.createProduct
            ],
            callback: ProductController.createProduct
        },
        {
            method: 'get',
            url: '/product',
            middleWare: [
                ProductPolicies.readProduct
            ],
            callback: ProductController.readProduct
        },
        {
            method: 'get',
            url: '/product/all',
            middleWare: [
                ProductPolicies.readAllProducts
            ],
            callback: ProductController.readAllProducts
        },
        {
            method: 'patch',
            url: '/product',
            middleWare: [
                ProductPolicies.patchProduct
            ],
            callback: ProductController.patchProduct
        },
        {
            method: 'delete',
            url: '/product',
            middleWare: [
                ProductPolicies.deleteProduct
            ],
            callback: ProductController.deleteProduct
        },
        {
            method: 'delete',
            url: '/product/multiple',
            middleWare: [
                ProductPolicies.deleteMultipleProducts
            ],
            callback: ProductController.deleteMultipleProducts
        },
        {
            method: 'post',
            url: '/deposit',
            middleWare: [
                depositMiddleware
            ],
            callback: controller.deposit
        },
        {
            method: 'post',
            url: '/buy',
            middleWare: [
                buyMiddleware
            ],
            callback: controller.deposit
        },
    ];

    const routes = [
        ...User,
        ...Product
    ]

    routes.forEach(route => {
        const method = route.method;
        const url = route.url;
        const middleWare = route.middleWare
        
        const jwtVerification = [];

        const publicUserRoutes = method == 'post'
            && /^\/user\/(?=login|register$)/.test(url)
        
        const publicProductRoutes = method == 'get'
            && /^\/product\/?$|^\/product\/all$/.test(url)

        const noVerification = publicUserRoutes
            || publicProductRoutes;
        
        if (!noVerification) {
            jwtVerification.push(jwt.verify)
        }

        app[method](
            `${base}${url}`,
            ...jwtVerification,
            ...middleWare,
            route.callback
        )
    })
}
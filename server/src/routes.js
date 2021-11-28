const { Router } = require('express')

const router = Router();

const UserPolicies = require('./policies/User');
const UserController = require('./controller/User/User')
const controller = require('./controller/controller')

const ProductPolicies = require('./policies/Product');
const ProductController = require('./controller/Product')

const { base } = require('./config/config');
const jwt = require('./utils/jwt');
const {
    deposit: depositMiddleware,
    buy: buyMiddleware,
    reset: resetMiddleware
} = require('./policies/policies');


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
            callback: controller.buy
        },
        {
            method: 'post',
            url: '/reset',
            middleWare: [
                resetMiddleware
            ],
            callback: controller.reset
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

        const authenticate = !publicUserRoutes
            && !publicProductRoutes;
        
        if (authenticate) {
            jwtVerification.push(jwt.verify)
        }

        router[method](
            `${base}${url}`,
            ...jwtVerification,
            ...middleWare,
            route.callback
        )
    })

module.exports = router;
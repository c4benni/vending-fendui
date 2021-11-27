const UserPolicies = require('./policies/User');
const UserController = require('./controller/User')

const ProductPolicies = require('./policies/Product');
const ProductController = require('./controller/Product')

const { base } = require('./config/config');
const jwt = require('./policies/jwt');

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
                ProductPolicies.addProduct
            ],
            callback: ProductController.addProduct
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

        const noVerification = method == 'post'
            && /^\/user/.test(url);
        
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
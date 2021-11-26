const UserPolicies = require('./policies/User');
const UserController = require('./controller/User')

const { base } = require('./config/config');
const jwt = require('./policies/jwt');

module.exports = function (app) {

    const routes = [
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
            method: 'get',
            url: '/user',
            middleWare: [
                UserPolicies.getUser
            ],
            callback: UserController.getUser
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
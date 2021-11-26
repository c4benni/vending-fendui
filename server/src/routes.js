const UserPolicies = require('./policies/User');
const UserController = require('./controller/User')

const { base } = require('./config/config')

module.exports = function (app) {

    const routes = [
        {
            method: 'post',
            url: '/register',
            middleWare: [
                UserPolicies.register
            ],
            callback: UserController.register
        },
        {
            method: 'post',
            url: '/login',
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

        app[method](
            `${base}${url}`,
            ...middleWare,
            route.callback
        )
    })
}
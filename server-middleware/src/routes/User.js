const UserPolicies = require('../policies/User');
const UserController = require('../controller/User/User')

module.exports = [
        {
            method: 'post',
            url: '/user/register',
            middleWare: UserPolicies.register,
            callback: UserController.register
        },
        {
            method: 'post',
            url: '/user/login',
            middleWare: UserPolicies.login,
            callback: UserController.login
        },
        {
            method: 'post',
            url: '/user/logout',
            middleWare: UserPolicies.logout,
            callback: UserController.logout
        },
        {
            method: 'post',
            url: '/user/logout/all',
            middleWare: UserPolicies.logout,
            callback: UserController.logoutAll
        },

        {
            method: 'get',
            url: '/user',
            middleWare: UserPolicies.getUser,
            callback: UserController.getUser
        },
        {
            method: 'get',
            url: '/user/all',
            middleWare: UserPolicies.getAllUsers,
            callback: UserController.getAllUsers
        },
        {
            method: 'patch',
            url: '/user',
            middleWare: UserPolicies.updateUser,
            callback: UserController.updateUser
        },
        {
            method: 'delete',
            url: '/user',
            middleWare: UserPolicies.deleteUser,
            callback: UserController.deleteUser
        }
    ]
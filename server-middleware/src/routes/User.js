const policies = require('../policies/User')
const controller = require('../controller/User')

module.exports = [
  {
    method: 'post',
    url: '/user/register',
    middleWare: policies.register,
    callback: controller.register
  },
  {
    method: 'post',
    url: '/user/login',
    middleWare: policies.login,
    callback: controller.login
  },
  {
    method: 'post',
    url: '/user/logout',
    middleWare: policies.logout,
    callback: controller.logout
  },
  {
    method: 'post',
    url: '/user/logout/all',
    middleWare: policies.logoutAll,
    callback: controller.logoutAll
  },

  {
    method: 'get',
    url: '/user',
    middleWare: policies.getUser,
    callback: controller.getUser
  },
  {
    method: 'get',
    url: '/user/all',
    middleWare: policies.getAllUsers,
    callback: controller.getAllUsers
  },
  {
    method: 'patch',
    url: '/user',
    middleWare: policies.updateUser,
    callback: controller.updateUser
  },
  {
    method: 'delete',
    url: '/user',
    middleWare: policies.deleteUser,
    callback: controller.deleteUser
  }
]

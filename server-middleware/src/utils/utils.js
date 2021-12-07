const { app } = require('../config/config')

module.exports = {
  // eslint-disable-next-line promise/param-names
  promiser: (value) => new Promise((r) => r(value)),
  clearCookies(res) {
    res?.cookie?.('token', null, { maxAge: 0 })

    res?.cookie?.('id', null, { maxAge: 0 })
  },

  async signedInRole({ req, role, invalidRole }) {
    const { User } = require('../models')

    // only logged in users with role == '${role}' can access this route.
    const { id } = req.cookies

    if (!id) {
      return {
        error: {
          message: 'you need to login first',
          status: 401
          // unauthorized
        }
      }
    }

    const user = await User.findOne({
      where: { id }
    })

    if (!user) {
      return {
        error: {
          message: 'this account may have been deleted',
          status: 404
          // not found
        }
      }
    }

    if (role && user.role != role) {
      return {
        error: {
          message: invalidRole,
          status: 403
          // forbidden
        }
      }
    }

    // // sign user;

    const unwanted = module.exports.unwantedUserFields(user)

    unwanted.forEach((path) => delete user[path])

    return {
      data: user
    }
  },

  defaultDeposit() {
    const deposit = {}

    app.validCost.forEach((cost) => {
      deposit[cost] = 0
    })

    return deposit
  },

  unwantedUserFields: (user) =>
    [
      'password',
      'token',
      'sessions',
      'createdAt',
      'updatedAt',
      user.isSeller ? ['deposit', 'purchased'] : 'income'
    ].flat(),

  bearerToken: (req) =>
    req.headers?.Authorization?.token?.split?.(' ')?.[0] || ''
}

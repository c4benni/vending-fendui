const { app } = require('../config/config')

module.exports = {
  // eslint-disable-next-line promise/param-names
  promiser: (value) => new Promise((r) => r(value)),
  clearCookies(res) {
    res?.cookie?.('token', null, { maxAge: 0 })

    res?.cookie?.('id', null, { maxAge: 0 })
  },

  async signedInRole({ req, role, invalidRole }) {
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

    const { User } = require('../models')

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

  unwantedUserFields: (user) =>
    [
      'password',
      'token',
      'sessions',
      'createdAt',
      'updatedAt',
      user.isSeller ? ['deposit', 'purchased'] : 'income'
    ].flat(),

  // bearerToken: (req) =>
  //   req.headers?.Authorization?.token?.split?.(' ')?.[0] || '',

  getChange: (total) => {
    const change = []

    if (total % 5) {
      return change
    }

    let money = total
    // sort so we can get the highest change first
    const availableCoins = [...app.validCost].sort().reverse()

    //  loop and deduct money till money is 0;
    while (money) {
      availableCoins.forEach((coin, i) => {
        const previousCoin = availableCoins[i - 1]

        const canPush = i == 0 ? true : money < previousCoin

        if (money > coin - 1 && canPush) {
          change.push(coin)
          money -= coin
        }
      })
    }

    return change
  }
}

const path = require('path')
const fs = require('fs')

const { app } = require('../config/config')

module.exports = {
  // eslint-disable-next-line promise/param-names
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

    const user = await User.findByPk(id, {
      attributes: app.userData
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
    const availableCoins = app.validCost.sort((a, b) =>
      b > a ? 1 : b < a ? -1 : 0
    )

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
  },

  getCookie: (cookie) => {
    if (typeof cookie != 'string') {
      return {}
    }

    const cookieEntries = cookie
      .split(';')
      .filter(Boolean)
      .map((x) => x.trim().split('='))

    return Object.fromEntries(cookieEntries)
  },

  // used to auto import JS files from the same directory;
  // this function is not so flexible, as it only deals with
  // exported objects or function
  // used otherwise, will throw an error;
  autoImportFromSameDirectory(dirName, exemptFile = 'index.js') {
    const importedModules = {}

    const dotJS = /\.js$/

    const jsFiles = fs
      .readdirSync(dirName)
      .filter((fileName) => dotJS.test(fileName) && fileName != exemptFile)

    jsFiles.forEach((fileName) => {
      const filePath = path.join(dirName, fileName)

      const module = require(filePath)

      if (typeof module == 'function') {
        const moduleName = fileName.replace(dotJS, '')

        importedModules[moduleName] = module
      } else if (typeof module == 'object') {
        Object.assign(importedModules, module)
      }
    })

    return importedModules
  },

  sendServerError(res, error) {
    res.status(500).send({
      error: {
        message: 'Oops! A server error occured. Please try again later.',
        status: 500,
        trace: error
      }
    })
  }
}

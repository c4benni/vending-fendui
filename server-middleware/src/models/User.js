/* eslint-disable require-await */

const bcrypt = require('bcrypt')
const { app } = require('../config/config')
const { id: generateId } = require('../utils/generate')

const { findSession } = require('../utils/sessions')
const { clearCookies } = require('../utils/utils')

const { TransactionHistory } = require('./index')

async function hashPassword(user) {
  if (!user.changed('password')) {
    return
  }

  const hash = await bcrypt.hash(user.password, app.saltRounds)

  await user.setDataValue('password', hash)

  return user
}

async function afterDestroy(user) {
  await TransactionHistory.destroy({
    where: {
      userId: user.id
    }
  })
}

// define a User model;
module.exports = (sequelize, dataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: dataTypes.STRING(99),
        defaultValue: () => generateId('u-'),
        primaryKey: true,
        unique: true
      },
      username: {
        type: dataTypes.STRING(20),
        unique: true,
        allowNull: false
      },
      password: {
        type: dataTypes.STRING,
        allowNull: false
      },
      deposit: {
        type: dataTypes.BIGINT,
        allowNull: true
      },
      income: {
        type: dataTypes.BIGINT,
        allowNull: true
      },

      role: {
        type: dataTypes.STRING(6),
        allowNull: false,
        validate: {
          is: /^(buyer|seller)$/
        }
      },
      sessions: {
        type: dataTypes.ARRAY(dataTypes.TEXT),
        allowNull: true,
        defaultValue: []
      },

      displayName: {
        type: dataTypes.STRING(99),
        allowNull: true
      },
      image: {
        type: dataTypes.STRING(99),
        allowNull: true
      },
      header: {
        type: dataTypes.STRING(99),
        allowNull: true
      },
      bio: {
        type: dataTypes.TEXT,
        allowNull: true
      }
    },
    {
      hooks: {
        beforeSave: hashPassword,
        afterDestroy
      },
      indexes: [
        {
          unique: true,
          fields: ['id']
        }
      ]
    }
  )

  User.prototype.matchPassword = async function (password) {
    const hash = this.password

    console.log({ hash, password })

    const match = await bcrypt.compare(password, hash)

    return match
  }

  User.prototype.hashPassword = async function (password) {
    const hash = await bcrypt.hash(password, app.saltRounds)

    return hash
  }

  // this function generates a new active session,
  // then returns if (jwt) is found;
  User.prototype.isSignedIn = async function (token) {
    if (!token) {
      return {
        sessions: []
      }
    }

    const { Session } = require('../models')

    const sessions = await Session.findAll({
      where: {
        id: this.id
      }
    })

    return {
      sessions
    }
  }

  // remove session(s) from user - logout;
  User.prototype.logout = async function ({ token, all, req, res }) {
    const notCurrent = req.query.notCurrent === 'true'
    const session = await findSession(token, this.id)

    if (!all) {
      await session.sign(0)
    } else {
      const { Session } = require('../models')

      await Session.destroy({
        where: {
          id: notCurrent ? '0' : this.id
        }
      })
    }

    clearCookies(res)
  }

  Object.defineProperties(User.prototype, {
    isSeller: {
      get() {
        return this.role == 'seller'
      }
    }
  })

  return User
}

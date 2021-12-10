/* eslint-disable require-await */

const bcrypt = require('bcrypt')
const { app } = require('../config/config')
const { id: generateId } = require('../utils/generate')

const { findSession } = require('../utils/sessions')
const { clearCookies } = require('../utils/utils')

const { TransactionHistory, Session } = require('./index')

async function hashPassword(user) {
  if (!user.changed('password')) {
    return
  }

  const hash = await bcrypt.hash(user.password, app.saltRounds)

  await user.setDataValue('password', hash)

  return user
}

async function afterDestroy(user) {
  // remove saved transactions
  await TransactionHistory.destroy({
    where: {
      userId: user.id
    }
  })

  // remove saved sessions;
  await Session.destroy({
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
          fields: ['id', 'username']
        },
        {
          unique: false,
          fields: ['role']
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

  // returns if (session) is found;
  User.prototype.isSignedIn = async function (token) {
    if (!token) {
      return {
        sessions: []
      }
    }

    // const { Session } = require('../models')

    const sessions = await Session.findOne({
      where: {
        id: this.id
      },
      raw: true
    })

    return {
      sessions: sessions || []
    }
  }

  User.prototype.logout = async function ({ token, all, req, res }) {
    // not current is used when trying to log out all sessions;
    const notCurrent = req.query.notCurrent === 'true'

    if (!all) {
      const session = await findSession(token, this.id)

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

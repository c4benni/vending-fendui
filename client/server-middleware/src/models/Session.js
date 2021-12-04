const { app } = require('../config/config')
const { sessionId } = require('../utils/generate')

module.exports = (sequelize, dataTypes) => {
  const Session = sequelize.define(
    'Session',
    {
      id: {
        type: dataTypes.STRING(99),
        allowNull: false
      },
      session: {
        type: dataTypes.STRING(299),
        defaultValue: () => sessionId(),
        allowNull: false,
        primaryKey: true
      },
      timeout: {
        type: dataTypes.BIGINT,
        defaultValue: () => Date.now() + app.sessionMaxTime,
        allowNull: false
      }
    },
    {
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['session']
        }
      ]
    }
  )

  // update session;
  // if timeout expired, return error and delete session.
  // if new timeout == 0, delete session;
  Session.prototype.Sign = async function (timeout = app.sessionMaxTime) {
    const now = Date.now()

    if (this.timeout <= now) {
      await this.destroy()

      return {
        error: {
          message: 'Session expired',
          status: 401
        }
      }
    }

    // delete session if no timeout;
    if (!timeout) {
      await this.destroy()
    } else {
      // set fresh timeout;
      await this.setDataValue('timeout', now + timeout)
    }

    return {
      token: timeout ? this.session : null,
      id: timeout ? this.id : null
    }
  }

  return Session
}

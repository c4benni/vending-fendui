const { Op } = require('sequelize/dist')
const { User, Session, sequelize } = require('../../../models')
const { signUser, signCookies } = require('../../../utils/sessions')
const { unwantedUserFields, sendServerError } = require('../../../utils/utils')

// after a login, push a session
module.exports = async function (req, res) {
  const callback = async () => {
    const { username, password } = req.body

    // find existing user
    const user = await User.findOne({
      where: { username }
    })

    if (user) {
      // begin transaction
      try {
        return await sequelize.transaction(async (tx) => {
          const matchPassword = await user.matchPassword(password)

          if (matchPassword) {
            // delete all sessions from a user that has
            // logoutOtherSessions === true;
            if (user.logoutOtherSessions) {
              const deleteAllSessions = await Session.destroy({
                where: { id: user.id },
                transaction: tx
              })

              if (deleteAllSessions.error) {
                throw new Error(
                  'Cannot sign you in right now. Error terminating other sessions. Please try again.'
                )
              }
            }

            // delete all expired sessions;
            const deleteExpiredSessions = await Session.destroy({
              where: {
                id: user.id,
                [Op.and]: [
                  {
                    timeout: {
                      [Op.lte]: Date.now()
                    }
                  }
                ]
              },
              transaction: tx
            })

            if (deleteExpiredSessions.error) {
              throw new Error(
                'Cannot sign you in right now. Please try again later.'
              )
            }

            let alert

            const sessions = await Session.findOne({
              where: {
                id: user.id,
                [Op.and]: [
                  {
                    timeout: {
                      [Op.gt]: Date.now()
                    }
                  }
                ]
              },
              attributes: ['session'],
              raw: true,
              transaction: tx
            })

            if (sessions) {
              alert =
                'There is already an active session on this account. Do you wish to end all other active sessions?'
            }

            // create a fresh user session;
            const newSession = await Session.create(
              {
                id: user.id
              },
              { transaction: tx }
            )

            if (newSession.error) {
              throw new Error(
                'Cannot sign you in right now. Error creating a new session. Please try again.'
              )
            }

            const data = {
              alert,
              session: newSession.session,
              ...user.toJSON()
            }

            signCookies({ res, token: data.session, userId: data.id })

            const unwantedFields = unwantedUserFields(user)

            unwantedFields.forEach((field) => {
              delete data[field]
            })

            // sign user
            await signUser(data.id, res, req)

            return res.status(200).send({ data })
          }
        })
      } catch (err) {
        if (err) {
          return res.status(500).send({
            error: {
              message: err.message
            }
          })
        }
      }
    }

    return res.status(401).send({
      error: {
        message: `username or password is incorrect`,
        status: 401
      }
    })
    // unauthorized
  }

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

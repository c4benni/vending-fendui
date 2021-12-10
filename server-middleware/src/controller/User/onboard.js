const { User, Session } = require('../../models')
const attempt = require('../../utils/attempt')
const { findSession, signUser, signCookies } = require('../../utils/sessions')
const { clearCookies, unwantedUserFields } = require('../../utils/utils')

const { app } = require('../../config/config')

// logout helper function;
async function logoutLogic({ req, res, all }) {
  const mainCallback = async () => {
    const { id } = req.cookies
    const token = req.cookies?.token

    // find existing user
    const session = await findSession(token, id)

    if (session) {
      if (token) {
        const notCurrent = req.query.notCurrent === 'true'

        if (!all) {
          await session.Sign(0)
        } else {
          await Session.destroy({
            where: {
              id: notCurrent ? '0' : id
            }
          })
        }

        clearCookies(res)

        return res.status(200).send({
          data: {
            message: 'logout successful',
            status: 200
          }
          // okay
        })
      } else {
        return res.status(401).send({
          error: {
            message: `session expired`,
            status: 401
          }
        })
        // unauthorized
      }
    }

    return res.status(401).send({
      error: {
        message: `user not found`,
        status: 401
      }
    })
    // unauthorized
  }

  await attempt({
    express: { res },
    callback: mainCallback
  })
}

module.exports = {
  async register(req, res) {
    const mainCallback = async () => {
      const { username, password, role } = req.body
      // check that user doesnt exist.
      const findUser = await User.findOne({
        where: { username },
        attributes: ['id'],
        raw: true
      })

      if (findUser) {
        return res.status(403).send({
          error: {
            message: 'user exist',
            status: 403
          }
        })
        // forbidden
      }

      const getRole = role.toLowerCase()

      let deposit = null

      let income = null

      if (getRole == 'buyer') {
        deposit = 0
      } else {
        income = 0
      }

      // create a new user;
      const user = await User.create({
        username,
        password,
        role: getRole,
        deposit,
        income,
        image: app.userImages
      })

      // send success if okay;
      res.status(201).send({
        data: {
          message: 'account successfully created. Login',
          id: user.id
        }
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  // after a login, push a session
  async login(req, res) {
    const mainCallback = async () => {
      const { username, password } = req.body

      // find existing user
      const user = await User.findOne({
        where: { username }
      })

      if (user) {
        const matchPassword = await user.matchPassword(password)

        if (matchPassword) {
          let alert

          const sessions = await Session.findOne({
            where: { id: user.id }
          })

          if (sessions) {
            alert =
              'There is already an active session on this account. Do you wish to end all other active sessions?'
          }

          // create a fresh user session;
          const newSession = await Session.create({
            id: user.id
          })

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
      }

      return res.status(401).send({
        error: {
          message: `username or password is incorrect`,
          status: 401
        }
      })
      // unauthorized
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  async logout(req, res) {
    await logoutLogic({
      req,
      res,
      all: false
    })
  },

  async logoutAll(req, res) {
    await logoutLogic({
      req,
      res,
      all: true
    })
  }
}

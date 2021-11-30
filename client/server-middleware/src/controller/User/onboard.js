const { User } = require('../../models')
const attempt = require('../.../utils/attempt')
const sendError = require('../.../utils/sendError')
const sendSuccess = require('../.../utils/sendSuccess')
const { signUser } = require('../.../utils/jwt')
const { clearCookies, defaultDeposit } = require('../.../utils/utils')

// logout helper function;
async function logoutLogic({ req, res, all }) {
  const mainCallback = async () => {
    await attempt({
      express: { res },
      callback: async () => {
        const { id } = req.cookies

        // find existing user
        const user = await User.findOne({
          where: { id },
        })

        if (user) {
          const { jwt } = req.cookies

          if (jwt) {
            const notCurrent = req.query.notCurrent === 'true'

            await user.logout({
              jwt,
              all,
              notCurrent,
            })

            clearCookies(res)

            return sendSuccess.withStatus(res, {
              message: 'logout successful',
              status: 200,
              // okay
            })
          } else {
            return sendError.withStatus(res, {
              message: `session expired`,
              status: 401,
              // unauthorized
            })
          }
        }

        return sendError.withStatus(res, {
          message: `user not found`,
          status: 401,
          // unauthorized
        })
      },
      errorMessage: (err) => ({
        message: err.message,
        status: 409,
        // conflict
      }),
    })
  }

  await attempt({
    express: { res },
    callback: mainCallback,
  })
}

module.exports = {
  async register(req, res) {
    const mainCallback = async () => {
      await attempt({
        express: { res },
        callback: async () => {
          const { username, password, role } = req.body
          // check that user doesnt exist.
          const findUser = await User.findOne({
            where: { username },
          })

          if (findUser) {
            return sendError.withStatus(res, {
              message: 'user exist',
              status: 400,
              // bad request
            })
          }

          const getRole = role.toLowerCase()

          let deposit = null

          let income = null

          if (getRole == 'buyer') {
            deposit = defaultDeposit()
          } else {
            income = defaultDeposit()
          }

          // create a new user;
          const user = await User.create({
            username,
            password,
            role: getRole,
            deposit,
            income,
          })

          // send success if okay;
          sendSuccess.withStatus(res, {
            data: {
              message: 'account successfully created. Login',
              id: user.id,
            },
            status: 201,
            // created
          })
        },
        errorMessage: (err) => ({
          message: err.message,
          status: 409,
          // conflict
        }),
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback,
    })
  },

  // after a login, push a session
  async login(req, res) {
    const mainCallback = async () => {
      await attempt({
        express: { res },
        callback: async () => {
          const { username, password } = req.body

          // find existing user
          const user = await User.findOne({
            where: { username },
          })

          if (user) {
            const matchPassword = await user.matchPassword(password)

            if (matchPassword) {
              let alert

              const { jwt } = req.cookies

              const activeSessions = await user.isSignedIn(jwt)

              if (activeSessions.sessions.length) {
                alert =
                  'there is already an active session on this account. Do you wish to end all other active sessions?'
              }

              const jwtSigned = await signUser(user, res)

              const sessions = activeSessions.sessions || []

              sessions.push(jwtSigned.token)

              delete jwtSigned.token

              // get fresh user to update sessions;
              const freshUser = await User.findOne({
                where: { username },
              })

              await freshUser.update({
                sessions,
              })

              await freshUser.save({
                fields: ['sessions'],
              })

              const data = {
                ...jwtSigned,
                alert,
              }

              return res.status(200).send({ data })
            }
          }

          return sendError.withStatus(res, {
            message: `username or password is incorrect`,
            status: 401,
            // unauthorized
          })
        },
        errorMessage: (err) => ({
          message: err.message,
          status: 409,
          // conflict
        }),
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback,
    })
  },

  async logout(req, res) {
    await logoutLogic({
      req,
      res,
      all: false,
    })
  },

  async logoutAll(req, res) {
    await logoutLogic({
      req,
      res,
      all: true,
    })
  },
}

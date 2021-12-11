const { User, Session } = require('../../../models')
const attempt = require('../../../utils/attempt')
const { signUser, signCookies } = require('../../../utils/sessions')
const { unwantedUserFields } = require('../../../utils/utils')

// after a login, push a session
module.exports = async function (req, res) {
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
          where: { id: user.id },
          attributes: ['session'],
          raw: true
        })

        if (sessions) {
          alert =
            'There is already an active session on this account. Do you wish to end all other active sessions?'
        }

        // create a fresh user session;
        const newSession = await Session.create({
          id: user.id,
          deviceHash: req.machineId
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
}

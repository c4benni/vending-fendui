const { Session } = require('../../../models')
const attempt = require('../../../utils/attempt')
const { findSession } = require('../../../utils/sessions')
const { clearCookies } = require('../../../utils/utils')

// helper function;
async function logoutLogic({ req, res, all }) {
  const mainCallback = async () => {
    const { id } = req.cookies
    const token = req.cookies?.token

    // find existing user
    const session = await findSession(token, id, req.machineId)

    if (session) {
      if (token) {
        const notCurrent = req.body.notCurrent === true

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
        await session.Sign(0)

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
        message: `session expired`,
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

const { Session } = require('../../../models')
const { findSession } = require('../../../utils/sessions')
const { clearCookies, sendServerError } = require('../../../utils/utils')

// helper function;
async function logoutLogic({ req, res, all }) {
  const callback = async () => {
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

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
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

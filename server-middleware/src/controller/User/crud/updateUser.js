const { User, sequelize } = require('../../../models')
const { signUser } = require('../../../utils/sessions')
const { unwantedUserFields, sendServerError } = require('../../../utils/utils')

module.exports = async function (req, res) {
  const callback = async () => {
    const { id } = req.cookies

    if (!id) {
      return res.status(401).send({
        message: 'session expired',
        status: 401
        // unauthorized
      })
    }

    // transaction
    try {
      await sequelize.transaction(async function (tx) {
        const { username, password } = req.body

        const user = await User.findByPk(id, {
          transaction: tx
        })

        if (!user) {
          throw new Error('{404} User not found')
        }

        const updateValues = {}

        // ~to do
        // end all other active sessions~
        if (password) {
          const oldPassword = password.old
          const newPassword = password.new

          // avoid unnecessary update
          if (oldPassword === newPassword) {
            throw new Error(
              '{403} New password must be different from old password'
            )
          }

          // check that old password is valid;
          const matchPassword = await user.matchPassword(oldPassword)

          if (!matchPassword) {
            throw new Error('{401} Old password is incorrect')
          }

          updateValues.password = newPassword
        }

        if (username) {
          // check that user doesnt exist on DB;
          const findUsername = await User.findOne({
            where: { username },
            attributes: ['username'],
            raw: true,
            transaction: tx
          })

          if (findUsername) {
            throw new Error('{403} That username is taken! Try again.')
          }

          updateValues.username = username
        }

        // fields without validation;
        const buildUpdateValues = () => {
          const genericFields = [
            'displayName',
            'image',
            'header',
            'bio',
            'publicProfile',
            'showBalance',
            'showBalanceFromAccountPage',
            'rememberMe',
            'logoutOtherSessions',
            'showBanner'
          ]

          genericFields.forEach((field) => {
            const value = req.body[field]

            if (typeof value != 'undefined') {
              updateValues[field] = value
            }
          })

          return genericFields
        }

        buildUpdateValues()

        const updateUser = await user.update(
          {
            ...updateValues
          },
          { transaction: tx }
        )

        if (updateUser.error) {
          throw new Error('Error updating user')
        }

        const saveUpdate = await user.save({ transaction: tx })

        if (saveUpdate.error) {
          throw new Error('Error saving update')
        }

        const session = await signUser(user.id, res, req)

        const data = {
          ...session
        }

        const unwanted = unwantedUserFields(user)

        unwanted.forEach((field) => delete data[field])

        res.send({
          data
        })

        return 1
      })
    } catch (err) {
      if (err) {
        const matchStatus = err.message.match(/^\{\d+\}/g)

        // defined error
        if (matchStatus) {
          const status = matchStatus[0].replace(/\{|\}/g, '')

          return res.status(status).send({
            error: {
              message: err.message.replace(/^\{\d+\}\s/, '')
            }
          })
        }

        // conflict error
        return res.status(409).send({
          error: {
            message: err.message
          }
        })
      }
    }
  }

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

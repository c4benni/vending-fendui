const { User } = require('../../../models')
const attempt = require('../../../utils/attempt')
const { signUser } = require('../../../utils/sessions')
const { unwantedUserFields } = require('../../../utils/utils')

module.exports = async function (req, res) {
  const mainCallback = async () => {
    const { id } = req.cookies

    if (!id) {
      return res.status(401).send({
        message: 'session expired',
        status: 401
        // unauthorized
      })
    }

    const { username, password } = req.body

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).send({
        message: 'user not found',
        status: 404
        // unauthorized
      })
    }

    const updateValues = {}

    if (password) {
      const oldPassword = password.old
      const newPassword = password.new

      // avoid unnecessary update
      if (oldPassword === newPassword) {
        return res.status(401).send({
          message: 'new password must be different from old password',
          status: 401
          // unauthorized
        })
      }

      // check that old password is valid;
      const matchPassword = await user.matchPassword(oldPassword)

      if (!matchPassword) {
        return res.status(401).send({
          message: 'old password is incorrect',
          status: 401
          // unauthorized
        })
      }

      updateValues.password = newPassword
    }

    if (username) {
      // check that user doesnt exist on DB;
      const findUsername = await User.findOne({
        where: { username },
        attributes: ['username'],
        raw: true
      })

      if (findUsername) {
        return res.status(400).send({
          message: 'that username is taken. Try again.',
          status: 400
        })
      }

      updateValues.username = username
    }

    const buildUpdateValues = () => {
      const genericFields = ['displayName', 'image', 'header', 'bio']

      genericFields.forEach((field) => {
        const value = req.body[field]

        if (typeof value != 'undefined') {
          updateValues[field] = value
        }
      })

      return genericFields
    }

    buildUpdateValues()

    await user.update({
      ...updateValues
    })

    await user.save()

    const session = await signUser(user.id, res, req)

    const data = {
      ...session
    }

    const unwanted = unwantedUserFields(user)

    unwanted.forEach((field) => delete data[field])

    res.send({
      data
    })
  }

  await attempt({
    express: { res },
    callback: mainCallback
  })
}

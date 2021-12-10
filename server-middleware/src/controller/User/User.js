const { User } = require('../../models')
const attempt = require('../../utils/attempt')
const sendError = require('../../utils/sendError')
const sendSuccess = require('../../utils/sendSuccess')
const { signUser, signUserFromCookie } = require('../../utils/sessions')
const { clearCookies, unwantedUserFields } = require('../../utils/utils')
const { Product } = require('../../models')
const onboard = require('./onboard')

module.exports = {
  ...onboard,

  async getUser(req, res) {
    const mainCallback = async () => {
      const { id, self } = req.query

      const findUser = await User.findOne({
        where: { id }
      })

      if (!findUser) {
        return sendError.withStatus(res, {
          message: 'user not found',
          status: 404
          // not found
        })
      } else {
        // check that self query is passed only for signed in users;
        if (self) {
          const { id } = req.cookies

          const isSignedIn = await findUser.isSignedIn({ id })

          if (!isSignedIn) {
            return sendError.withStatus(res, {
              message: 'only signed in users can use the self option',
              status: 401
            })
          }
        }

        const {
          id,
          username,
          role,
          createdAt,
          image,
          header,
          bio,
          displayName
        } = findUser

        const unwantedFields = unwantedUserFields(findUser)

        const data = self
          ? {
              ...findUser.toJSON()
            }
          : {
              id,
              username,
              role,
              createdAt,
              image,
              header,
              bio,
              displayName
            }

        unwantedFields.forEach((field) => {
          delete data[field]
        })

        await signUserFromCookie(req, res)

        res.status(200).send({ data, status: 200 })
      }
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  async getAllUsers(req, res) {
    const mainCallback = async () => {
      const { limit, where = {}, offset } = req.query

      const findUsers = await User.findAll({
        ...where,
        limit,
        offset,
        raw: true
      })

      if (!findUsers.length) {
        return sendError.withStatus(res, {
          message: 'no user found',
          status: 404
          // not found
        })
      } else {
        const data = []

        findUsers.forEach((user) => {
          const { id, username, role, createdAt, image } = user

          data.push({
            id,
            username,
            role,
            createdAt,
            image
          })
        })

        await signUserFromCookie(req, res)

        res.send({
          data,
          length: data.length
        })
      }
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  async updateUser(req, res) {
    const mainCallback = async () => {
      const { id } = req.cookies

      if (!id) {
        return sendError.withStatus(res, {
          message: 'session expired',
          status: 401
          // unauthorized
        })
      }

      const { username, password } = req.body

      const user = await User.findOne({
        where: { id }
      })

      if (!user) {
        return sendError.withStatus(res, {
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
          return sendError.withStatus(res, {
            message: 'new password must be different from old password',
            status: 401
            // unauthorized
          })
        }

        // check that old password is valid;
        const matchPassword = await user.matchPassword(oldPassword)

        if (!matchPassword) {
          return sendError.withStatus(res, {
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
          return sendError.withStatus(res, {
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
  },

  async deleteUser(req, res) {
    const mainCallback = async () => {
      const { id } = req.cookies

      if (!id) {
        return sendError.withStatus(res, {
          message: 'session expired',
          status: 401
          // unauthorized
        })
      }

      const { password } = req.body

      const findUser = await User.findOne({
        where: { id }
      })

      if (!findUser) {
        return sendError.withStatus(res, {
          message: 'user not found',
          status: 404
          // not found
        })
      } else {
        const matchPassword = await findUser.matchPassword(password)

        if (!matchPassword) {
          return sendError.withStatus(res, {
            message: 'incorrect password',
            status: 404
            // not found
          })
        }

        const updateSellerProduct = async () => {
          if (!findUser.isSeller) {
            return
          }

          await Product.update(
            {
              ownerDeleted: true
            },
            {
              where: {
                sellerId: findUser.id
              }
            }
          )
        }

        await updateSellerProduct()

        const remove = await findUser.destroy()

        if (remove.error) {
          throw remove.error
        }

        clearCookies(res)

        return sendSuccess.plain(res, {
          data: {
            message: 'user deleted'
          },
          status: 200
        })
      }
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  }
}

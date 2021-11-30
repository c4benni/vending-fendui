const sendError = require('.../utils/sendError')

const Joi = require('joi')

const attempt = require('.../utils/attempt')

const {
  user: userValidation,
  changePassword: changePasswordValidation,
  links: imageValidation,
  text: textValidation,
} = require('.../utils/validations')(Joi)

module.exports = {
  async register(req, res, next) {
    const mainCallback = () => {
      const body = req.body

      const schema = Joi.object({
        username: userValidation.username.required(),
        password: userValidation.password.required(),
        role: userValidation.role.required(),
      })

      const validate = schema.validate(body)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid register credentials',
          status: 400,
          // bad request
        })
      }

      next()
    }

    await attempt({
      express: { res },
      callback: mainCallback,
    })
  },

  async login(req, res, next) {
    await attempt({
      express: { res },
      callback: () => {
        const schema = Joi.object({
          username: userValidation.username,
          password: userValidation.password,
        })

        const validate = schema.validate(req.body)

        if (validate.error) {
          return sendError.withStatus(res, {
            message:
              validate?.error?.message ||
              'an error occured. Check your login credentials and try again.',
            status: 400,
            // bad request
          })
        }

        next()
      },
    })
  },

  async logout(req, res, next) {
    await attempt({
      express: { res },
      callback: () => {
        const schema = Joi.object({})

        const validate = schema.validate(req.body)

        if (validate.error) {
          return sendError.withStatus(res, {
            message:
              validate?.error?.message ||
              'an error occured. Check your credentials and try again.',
            status: 400,
            // bad request
          })
        }

        next()
      },
    })
  },

  // id must be present in req.params and must be a valid id
  async getUser(req, res, next) {
    const mainCallback = () => {
      const query = req.query

      const schema = Joi.object({
        id: userValidation.id.required(),
        self: Joi.boolean(),
      })

      const validate = schema.validate(query)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid credentials',
          status: 404,
          // not found
        })
      }

      next()
    }

    await attempt({
      express: { res },
      callback: mainCallback,
    })
  },

  // limit should be at least 1 and at most 99; default = 99
  async getAllUsers(req, res, next) {
    const mainCallback = () => {
      const body = req.body

      const schema = Joi.object({
        limit: Joi.number().min(1).max(99),
        offset: Joi.number().min(1),
        where: Joi.object({
          username: userValidation.username,
          id: userValidation.id,
          role: userValidation.role,
        }),
      })

      const validate = schema.validate(body)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid credentials',
          status: 404,
          // not found
        })
      }

      next()
    }

    await attempt({
      express: { res },
      callback: mainCallback,
    })
  },

  async updateUser(req, res, next) {
    const mainCallback = () => {
      const body = req.body

      const schema = Joi.object({
        username: userValidation.username,
        password: changePasswordValidation,
        displayName: userValidation.displayName,
        image: imageValidation,
        header: imageValidation,
        bio: textValidation,
      })

      const validate = schema.validate(body)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid credentials',
          status: 400,
          // bad request
        })
      }

      next()
    }

    await attempt({
      express: { res },
      callback: mainCallback,
    })
  },

  async deleteUser(req, res, next) {
    const mainCallback = () => {
      const body = req.body

      const schema = Joi.object({
        password: userValidation.password.required(),
      })

      const validate = schema.validate(body)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid credentials',
          status: 400,
          // bad request
        })
      }

      next()
    }

    await attempt({
      express: { res },
      callback: mainCallback,
    })
  },
}

const Joi = require('joi')

const sendError = require('../utils/sendError')
const { sendServerError } = require('../utils/utils')

const {
  user: userValidation,
  changePassword: changePasswordValidation,
  links: imageValidation,
  text: textValidation
} = require('../utils/validations')(Joi)

module.exports = {
  register(req, res, next) {
    const callback = () => {
      const body = req.body

      const schema = Joi.object({
        username: userValidation.username.required(),
        password: userValidation.password.required(),
        role: userValidation.role.required()
      })

      const validate = schema.validate(body)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid register credentials',
          status: 400
          // bad request
        })
      }

      req.body.username = req.body.username.toLowerCase()

      next()
    }

    try {
      callback()
    } catch (e) {
      sendServerError(res, e)
    }
  },

  login(req, res, next) {
    const callback = () => {
      const schema = Joi.object({
        username: userValidation.username,
        password: userValidation.password
      })

      const validate = schema.validate(req.body)

      if (validate.error) {
        return sendError.withStatus(res, {
          message:
            validate?.error?.message ||
            'an error occured. Check your login credentials and try again.',
          status: 400
          // bad request
        })
      }

      req.body.username = req.body.username.toLowerCase()

      next()
    }

    try {
      callback()
    } catch (e) {
      sendServerError(res, e)
    }
  },

  logout(req, res, next) {
    const callback = () => {
      const schema = Joi.object({})

      const validate = schema.validate(req.body)

      if (validate.error) {
        return sendError.withStatus(res, {
          message:
            validate?.error?.message ||
            'an error occured. Check your credentials and try again.',
          status: 400
          // bad request
        })
      }

      next()
    }

    try {
      callback()
    } catch (e) {
      sendServerError(res, e)
    }
  },

  logoutAll(req, res, next) {
    const callback = () => {
      const schema = Joi.object({
        notCurrent: Joi.boolean()
      })

      const validate = schema.validate(req.body)

      if (validate.error) {
        return sendError.withStatus(res, {
          message:
            validate?.error?.message ||
            'an error occured. Check your credentials and try again.',
          status: 400
          // bad request
        })
      }

      next()
    }

    try {
      callback()
    } catch (e) {
      sendServerError(res, e)
    }
  },

  // id must be present in req.params and must be a valid id
  getUser(req, res, next) {
    const callback = () => {
      const query = req.query

      const schema = Joi.object({
        id: userValidation.id.required(),
        self: Joi.boolean()
      })

      const validate = schema.validate(query)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid credentials',
          status: 404
          // not found
        })
      }

      next()
    }

    try {
      callback()
    } catch (e) {
      sendServerError(res, e)
    }
  },

  // limit should be at least 1 and at most 99; default = 99
  getAllUsers(req, res, next) {
    const callback = () => {
      const body = req.body

      const schema = Joi.object({
        limit: Joi.number().min(1).max(99),
        offset: Joi.number().min(1),
        where: Joi.object({
          username: userValidation.username,
          id: userValidation.id,
          role: userValidation.role
        })
      })

      const validate = schema.validate(body)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid credentials',
          status: 404
          // not found
        })
      }

      next()
    }

    try {
      callback()
    } catch (e) {
      sendServerError(res, e)
    }
  },

  updateUser(req, res, next) {
    const callback = () => {
      const body = req.body

      const schema = Joi.object({
        username: userValidation.username,
        password: changePasswordValidation,
        displayName: userValidation.displayName,
        image: imageValidation,
        header: imageValidation,
        bio: textValidation,
        publicProfile: Joi.boolean(),
        showBalance: Joi.boolean(),
        showBalanceFromAccountPage: Joi.boolean(),
        rememberMe: Joi.boolean(),
        logoutOtherSessions: Joi.boolean(),
        showBanner: Joi.boolean()
      })

      const validate = schema.validate(body)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid credentials',
          status: 400
          // bad request
        })
      }

      next()
    }

    try {
      callback()
    } catch (e) {
      sendServerError(res, e)
    }
  },

  deleteUser(req, res, next) {
    const callback = () => {
      const body = req.body

      const schema = Joi.object({
        password: userValidation.password.required()
      })

      const validate = schema.validate(body)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid credentials',
          status: 400
          // bad request
        })
      }

      next()
    }

    try {
      callback()
    } catch (e) {
      sendServerError(res, e)
    }
  }
}

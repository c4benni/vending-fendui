const Joi = require('joi')

const sendError = require('../utils/sendError')
const { sendServerError } = require('../utils/utils')

const { product: validateProduct } = require('../utils/validations')(Joi)

module.exports = {
  deposit(req, res, next) {
    const callback = () => {
      const query = req.body

      const schema = Joi.object({
        amount: validateProduct.cost.required(),
        quantity: Joi.number().integer().min(1).max(1000).required()
      })

      const validate = schema.validate(query)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid parameters',
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

  buy(req, res, next) {
    const callback = () => {
      const query = req.body

      const schema = Joi.object({
        id: validateProduct.id.required(),
        amount: Joi.number().integer().min(1).max(1000).required()
      })

      const validate = schema.validate(query)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid parameters',
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

  reset(req, res, next) {
    const callback = () => {
      const query = req.body

      const schema = Joi.object({})

      const validate = schema.validate(query)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid parameters',
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

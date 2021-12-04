const Joi = require('joi')

const sendError = require('../utils/sendError')

const attempt = require('../utils/attempt')

const { product: validateProduct } = require('../utils/validations')(Joi)

module.exports = {
  async deposit(req, res, next) {
    const mainCallback = () => {
      const query = req.body

      const schema = Joi.object({
        amount: validateProduct.cost.required(),
        quantity: Joi.number().integer().min(1).max(1000).required()
      })

      const validate = schema.validate(query)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid credentials',
          status: 400
          // bad request
        })
      }

      next()
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  async buy(req, res, next) {
    const mainCallback = () => {
      const query = req.body

      const schema = Joi.object({
        id: validateProduct.id.required(),
        amount: Joi.number().integer().min(1).max(1000).required()
      })

      const validate = schema.validate(query)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid credentials',
          status: 400
          // bad request
        })
      }

      next()
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  async reset(req, res, next) {
    const mainCallback = () => {
      const query = req.body

      const schema = Joi.object({})

      const validate = schema.validate(query)

      if (validate.error) {
        return sendError.withStatus(res, {
          message: validate.error.message || 'invalid credentials',
          status: 400
          // bad request
        })
      }

      next()
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  }
}

const Joi = require('joi')

const { sendServerError } = require('../utils/utils')

const { product: validateProduct } = require('../utils/validations')(Joi)

module.exports = {
  // only logged in users can access this route;
  transactionHistory(req, res, next) {
    const callback = () => {
      const query = req.query

      const schema = Joi.object({
        limit: Joi.number().required(),
        offset: Joi.number()
      })

      const validate = schema.validate(query)

      if (validate.error) {
        return res.status(400).send({
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

  deposit(req, res, next) {
    const callback = () => {
      const query = req.body

      const schema = Joi.object({
        amount: validateProduct.cost.required(),
        quantity: Joi.number().integer().min(1).max(1000).required()
      })

      const validate = schema.validate(query)

      if (validate.error) {
        return res.status(400).send({
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
        return res.status(400).send({
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
        return res.status(400).send({
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

const Joi = require('joi')

const sendError = require('../utils/sendError')
const { sendServerError } = require('../utils/utils')

const {
  product: productValidation,
  links: linkValidation,
  text: textValidation
} = require('../utils/validations')(Joi)

module.exports = {
  createProduct(req, res, next) {
    const callback = () => {
      const body = req.body

      const schema = Joi.object({
        productName: productValidation.productName.required(),
        amountAvailable: productValidation.amountAvailable.required(),
        cost: productValidation.cost.required(),
        type: productValidation.type.required(),
        images: productValidation.slideShow,
        caption: productValidation.caption,
        description: textValidation
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

  getProduct(req, res, next) {
    const callback = () => {
      const query = req.query

      const schema = Joi.object({
        id: productValidation.id.required()
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

    try {
      callback()
    } catch (e) {
      sendServerError(res, e)
    }
  },

  // limit should be at least 1 and at most 99; default = 99
  getAllProducts(req, res, next) {
    const callback = () => {
      const schema = Joi.object({
        limit: Joi.number().min(1).max(99),
        offset: Joi.number().min(1),
        where: Joi.object({
          productName: productValidation.productName,
          id: productValidation.id,
          type: productValidation.type,
          rating: productValidation.rating,
          cost: productValidation.cost
        })
      })

      const body = req.body

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

  updateProduct(req, res, next) {
    const callback = () => {
      const body = req.body

      // allowed fields;
      const schema = Joi.object({
        id: productValidation.id.required(),
        productName: productValidation.productName,
        amountAvailable: productValidation.amountAvailable,
        cost: productValidation.cost,
        background: linkValidation,
        slideShow: productValidation.slideShow,
        caption: productValidation.caption,
        description: textValidation,
        rating: productValidation.rating,
        type: productValidation.type
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

  deleteProduct(req, res, next) {
    const callback = () => {
      const query = req.query

      const schema = Joi.object({
        id: productValidation.id.required()
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

    try {
      callback()
    } catch (e) {
      sendServerError(res, e)
    }
  },

  deleteMultipleProducts(req, res, next) {
    const callback = () => {
      const body = req.body

      const schema = Joi.object({
        ids: Joi.array().items(productValidation.id).required().min(1)
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

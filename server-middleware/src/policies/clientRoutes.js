const Joi = require('joi')

const attempt = require('../utils/attempt')
const sendError = require('../utils/sendError')

module.exports = {
  // only logged in users can access this route;
  async transactionHistory(req, res, next) {
    const mainCallback = () => {
      const query = req.query

      const schema = Joi.object({
        limit: Joi.number().required(),
        offset: Joi.number()
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

    await attempt({
      express: { res },
      callback: mainCallback
    })
  }
}

const Joi = require('joi')

const attempt = require('../.../utils/attempt')
const sendError = require('../.../utils/sendError')

module.exports = {
  // only logged in users can get any media;
  async getMedia(req, res, next) {
    const mainCallback = () => {
      const query = req.query

      const schema = Joi.object({})

      const validate = schema.validate(query)

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

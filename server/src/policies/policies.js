const sendError = require('../utils/sendError')

const Joi = require('joi')

const attempt = require('../utils/attempt');

const {
    product: validateProduct
}  = require('../utils/validations')(Joi)

module.exports = {
    async deposit (req, res, next) {
    const mainCallback = () => {
        const query = req.query;

        const schema = Joi.object({
            amount: validateProduct.cost.required()
        })

        const validate = schema.validate(query);

        if (validate.error) {
            return sendError.withStatus(res, {
                message: validate.error.message
                    || 'invalid credentials',
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
const sendError = require('../utils/sendError')

const Joi = require('joi')

const attempt = require('../utils/attempt');

const {
    product: productValidation,
    links: linkValidation,
    text: textValidation,

}  = require('../utils/validations')(Joi)

module.exports = {
 
    async addProduct(req, res, next) {
        const mainCallback = () => {
            const body = req.body;

            const schema = Joi.object({
                productName: productValidation.productName.required(),
                amountAvailable: productValidation.amountAvailable.required(),
                cost: productValidation.cost.required(),
                type: productValidation.type.required(),
                background: linkValidation,
                slideShow: productValidation.slideShow,
                caption: productValidation.caption,
                description: textValidation,
                rating: productValidation.rating,
            })

            const validate = schema.validate(body);

            if (validate.error) {
                return sendError.withStatus(res, {
                    message: validate.error.message
                        || 'invalid register credentials',
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
}
const sendError = require('../utils/sendError')

const Joi = require('joi')

const attempt = require('../utils/attempt');

const {
    product: productValidation,
    links: linkValidation,
    text: textValidation,

}  = require('../utils/validations')(Joi)

module.exports = {
 
    async createProduct(req, res, next) {
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
    },

    async readProduct(req, res, next) {
        const mainCallback = () => {
            const query = req.query;

            const schema = Joi.object({
                id: productValidation.id.required()
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
    },

    // limit should be at least 1 and at most 99; default = 99
    async getAllUsers(req, res, next) {
        
        const mainCallback = () => {
            const query = req.query;

            const schema = Joi.object({
                limit: Joi
                    .number()
                    .min(1)
                    .max(99),
                offset: Joi
                    .number()
                    .min(1),
                where: Joi.object({
                    username: userValidation.username,
                    id: userValidation.id,
                    role: userValidation.role
                })
            })

            const validate = schema.validate(query);

            if (validate.error) {
                return sendError.withStatus(res, {
                    message: validate.error.message
                        || 'invalid credentials',
                    status: 404
                    // not found
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
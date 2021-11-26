const sendError = require('../utils/sendError')

const Joi = require('joi')
const { app } = require('../config/config');
const attempt = require('../utils/attempt');

module.exports = {
    async getProduct(req, res, next) {
        await attempt({ res }, () => {
            const body = req.body;

            const noAllAndId = typeof body.all == 'undefined'
                && typeof body.id == 'undefined'
            
            if (noAllAndId) {
                return sendError.withStatus(res, {
                    message: 'missing one of "all" or "id" in request body',
                    status: 403
                })
            }

            const hasAllAndId = typeof body.all == 'boolean'
                && typeof body.id == 'string'
            
            if (hasAllAndId) {
                return sendError.withStatus(res, {
                    message: 'cannot have both "all" and "id" in request body',
                    status: 403
                })
            }

            const schema = Joi.object({
                all: Joi.boolean(),
                id: Joi.string().max(999),
                limit: Joi.number()          
            })
            
            const validate = schema.validate(body)

            if (validate.error) {
                return sendError.withStatus(res, {
                    message: validate?.error?.message || 'missing one of "all" or "id" in request body',
                    status: 403
                })
            }

            next()
        })
    },

    async addProduct(req, res, next) {
        await attempt({ res }, () => {
            const body = req.body;

            const schema = Joi.object({
                cost: Joi.number().valid(...app.validCost),
                productName: Joi.string()
                    .max(999)
                    .pattern(new RegExp('^\\w', 'i')),
                amountAvailable: Joi.number().max(999)
            })

            const validate = schema.validate(body);

            if (validate.error) {
                return sendError.withStatus(res, {
                    message: validate.error.message || 'invalid request body',
                    status: 403
                })
            }

            next();
        })
    }
}
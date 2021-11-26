const sendError = require('../utils/sendError')

const Joi = require('joi')

const attempt = require('../utils/attempt');

const {

    user: userValidation,
    deposit: depositValidation,
    changePassword: changePasswordValidation

}  = require('../utils/validations')(Joi)

module.exports = {
    // async getProduct(req, res, next) {
    //     await attempt({
    //         express: { res },
    //         callback: () => {
    //             const body = req.body;

    //             const noAllAndId = typeof body.all == 'undefined'
    //                 && typeof body.id == 'undefined'
                
    //             if (noAllAndId) {
    //                 return sendError.withStatus(res, {
    //                     message: 'missing one of "all" or "id" in request body',
    //                     status: 403
    //                 })
    //             }

    //             const hasAllAndId = typeof body.all == 'boolean'
    //                 && typeof body.id == 'string'
                
    //             if (hasAllAndId) {
    //                 return sendError.withStatus(res, {
    //                     message: 'cannot have both "all" and "id" in request body',
    //                     status: 403
    //                 })
    //             }

    //             const schema = Joi.object({
    //                 all: Joi.boolean(),
    //                 id: Joi.string().max(999),
    //                 limit: Joi.number()          
    //             })
                
    //             const validate = schema.validate(body)

    //             if (validate.error) {
    //                 return sendError.withStatus(res, {
    //                     message: validate?.error?.message || 'missing one of "all" or "id" in request body',
    //                     status: 403
    //                 })
    //             }

    //             next()
    //         }
    //     })
    // },

    // async postProduct(req, res, next) {
    //     await attempt({
    //         express: { res },
    //         callback: () => {
    //             const body = req.body;

    //             const schema = Joi.object({
    //                 cost: Joi.number().valid(...app.validCost),
    //                 productName: Joi.string()
    //                     .max(999)
    //                     .pattern(new RegExp('^\\w', 'i')),
    //                 amountAvailable: Joi.number().max(999)
    //             })

    //             const validate = schema.validate(body);

    //             if (validate.error) {
    //                 return sendError.withStatus(res, {
    //                     message: validate.error.message || 'invalid request body',
    //                     status: 403
    //                 })
    //             }

    //             next();
    //         }
    //     })
    // },

    // login. Username: String not null 3 - 20 characters, numbers, letters, _, ., password: String 6+ characters upper, lower, and numbers.
    
    async login(req, res, next) {
        await attempt({
            express: { res },
            callback: () => {

                const schema = Joi.object({
                    username: userValidation.username,
                    password: userValidation.password
                })
                
                const validate = schema.validate(req.body)

                if (validate.error) {
                    return sendError.withStatus(res, {
                        message: validate?.error?.message
                            || 'an error occured. Check your login credentials and try again.',
                        status: 400
                        // bad request
                    })
                }

                next()
            }
        })
    },

    // sign up | register.
    // username: String not null 3 - 20 characters, numbers, letters, _, ., password: String 6+ characters upper, lower, and numbers.
    // role must be either buyer or seller;
    async register(req, res, next) {
        const mainCallback = () => {
            const body = req.body;

            const schema = Joi.object({
                username: userValidation.username,
                password: userValidation.password,
                role: userValidation.role,
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

    // id must be present in req.params and must be a valid id
    async getUser(req, res, next) {
        
        const mainCallback = () => {
            const query = req.query;

            const schema = Joi.object({
                id: userValidation.id
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

    // can only update valid username, password, deposit
    async updateUser(req, res, next) {

        const mainCallback = () => {
            const body = req.body;

            const schema = Joi.object({
                id: userValidation.id.required(),
                username: userValidation.username,
                password: changePasswordValidation,
                deposit: depositValidation
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

    async deleteUser (req, res, next) {

        const mainCallback = () => {
            const body = req.body;

            const schema = Joi.object({
                id: userValidation.id.required(),
                password: userValidation.password.required(),
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
    }
}
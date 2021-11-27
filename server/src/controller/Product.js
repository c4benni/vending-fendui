const { Product } = require('../models')
const attempt = require('../utils/attempt')
const sendError = require('../utils/sendError')
const sendSuccess = require("../utils/sendSuccess")
const { sign: jwtSignature } = require('jsonwebtoken')
const config = require('../config/config')
const generate = require('../utils/generate')
const { User } = require('../models')

module.exports = {

    async addProduct(req, res) {
        const mainCallback = async () => {
            await attempt({
                express: { res },
                callback: async () => {
                    // only logged in users with role == 'seller' can access this route.

                    const { id } = await generate.cookies(req.headers.cookie);

                    if (!id) {
                        return sendError.withStatus(res, {
                            message: 'you need to login first',
                            status: 401
                            // unauthorized
                        })
                    }

                    const user = await User.findOne({
                        where: { id }
                    })

                    if (!user) {
                        return sendError.withStatus(res, {
                            message: 'this account may have been deleted',
                            status: 404
                            // not found
                        })
                    }

                    if (user.role != 'seller') {
                        return sendError.withStatus(res, {
                            message: 'only a seller can add a product. Create a seller account?',
                            status: 401
                            // unauthorized
                        })
                    }

                    // create a new product;
                    const product = await Product.create({
                        ...req.body,
                        sellerId: id
                    });

                    // send success if okay;
                    sendSuccess.withStatus(res, {
                        data: {
                            message: 'product successfully added!',
                            product
                        },
                        status: 200
                    });
                
                },
                errorMessage: err => ({
                    message: err.message,
                    status: 403
                })
            })
        }

        await attempt({
            express: { res },
            callback: mainCallback
        })
    },
}
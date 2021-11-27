const { Product, User } = require('../models')
const attempt = require('../utils/attempt')
const sendError = require('../utils/sendError')
const sendSuccess = require("../utils/sendSuccess")
const generate = require('../utils/generate')
const { signUserFromCookie } = require('../utils/jwt')

module.exports = {

    async createProduct(req, res) {
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

                    // check if product name exist;
                    const findProduct = await Product.findOne({
                        where: { productName: req.body.productName }
                    });

                    if (findProduct) {
                        return sendError.withStatus(res, {
                            message: 'product exists. Choose another name.',
                            status: 403
                        })
                    }

                    // create a new product;
                    const product = await Product.create({
                        ...req.body,
                        sellerId: id
                    });

                    // send success if okay;
                    sendSuccess.plain(res, {
                        data: {
                            message: 'product successfully added!',
                            product
                        }
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

    async readProduct(req, res) {
       const mainCallback = async () => {
            await attempt({
                express: { res },
                callback: async () => {
                    // anyone can view this
                    const { id } = req.query;

                    // still renew signed in users.
                    await signUserFromCookie(req, res);

                    const product = await Product.findOne({
                        where: { id }
                    })

                    if (!product) {
                        return sendError.withStatus(res, {
                            message: 'product not found or might have been deleted',
                            status: 404
                            // not found
                        })
                    }

                    // send filtered result;
                    const disAllowedFields = [
                        'id',
                        'updatedAt'
                    ];

                    const productJSON = product.toJSON();

                    const sellerUser = await User.findOne({
                        where: {
                            id: productJSON.sellerId
                        }
                    })

                    const sellerInfo = {}

                    if (sellerUser) {
                        sellerInfo.username = sellerUser.username
                    } else {
                        sellerInfo.error = {
                            message: 'this user has been deleted'
                        }
                    }

                    const data = {
                        ...productJSON,
                        sellerInfo
                    }

                    disAllowedFields.forEach(field => {
                        delete data[field]
                    })

                    return res.send({
                        data
                    })
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

    async readAllProducts(req, res) {
        const mainCallback = async () => {
            const { limit, where = {}, offset } = req.query;

            const findProducts = await Product
                .findAll({
                    ...where,
                    limit,
                    offset
                })

            if (!findProducts.length) {
                return sendError.withStatus(res, {
                    message: 'no product found',
                    status: 404
                    // not found
                })
            } else {
                const data = [];

                findProducts.forEach(product => {
                    const {
                        id, sellerId, productName,
                        cost, amountAvailable, type,
                        background, rating, caption
                    } = product;

                    data.push({
                        id, sellerId, productName,
                        cost, amountAvailable, type,
                        background, rating, caption
                    })
                })

                await signUserFromCookie(req, res)

                res.send({
                        data,
                        length: data.length,
                        status: 200
                    })
            }
        }

        await attempt({
            express: { res },
            callback: mainCallback
        })
    },
}
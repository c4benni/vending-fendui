const { Product } = require('../models')
const attempt = require('../utils/attempt')
const sendSuccess = require("../utils/sendSuccess")

module.exports = {
    async getProduct(req, res) {
        await attempt({ res }, () => {
            res.send('okay')
        })
    },
    async addProduct(req, res) {
        const callback = async () => {
            await attempt({ res },async () => {
                const product =  Product.create({
                    ...req.body,
                    sellerId: 'p-3s',
                });

                sendSuccess.withStatus(res, {
                    data: product,
                    status: 200
                });
                
            }, err => ({
                message: err.message,
                status: 403
            }))
        }

        await attempt({ res }, callback)
    }
}
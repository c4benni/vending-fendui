const { Product } = require('../models');
const sendSuccess = require('../utils/sendSuccess');
const attempt = require('../utils/attempt');
const generate = require('../utils/generate');
const sendError = require('../utils/sendError');
const { signedInRole } = require('../utils/utils');


module.exports = {
    async deposit(req, res) {
        const mainCallback = async () => {
            await attempt({
                express: { res },
                callback: async () => {
                    const { data, error } = await signedInRole({
                        res, role: 'buyer',
                        invalidRole: 'only a buyer can deposit coins'
                    })

                    if (error) {
                        return sendError.withStatus(error)
                    }

                    const user = data.user;
                    
                    // all checked;
                    // extract fields from query
                    // get buyer's deposit and update deposit[req.query.amount] 
                    // += req.query.quantity;
                    const { amount, quantity } = req.body;

                    const freshDeposit = {
                        ...(user.deposit || {})
                    };

                    const parsedQuantity = parseFloat(quantity)

                    if (!freshDeposit[`${amount}`]) {
                        freshDeposit[`${amount}`] = parsedQuantity;
                    } else {
                        freshDeposit[`${amount}`] += parsedQuantity;
                    }

                    await user.update({
                        deposit: freshDeposit
                    })

                    await user.save({
                        fields: ['deposit']
                    });

                    const spent = {
                        total: productPrice * amount,
                        coins: productPrice,
                        amount
                    }

                    sendSuccess.withStatus(res, {
                        data: {
                            message: 'purchase successfully made',
                            spent,
                            purchased: user.purchased,
                            change: user.deposit
                        },
                        status: 200
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

    async buy(req, res) {
        const mainCallback = async () => {
            await attempt({
                express: { res },
                callback: async () => {
                    // only logged in users with role == 'buyer' can access this route.
                    const { data, error } = await signedInRole({
                        res, role: 'buyer',
                        invalidRole: 'only a buyer can purchase products'
                    })

                    if (error) {
                        return sendError.withStatus(error)
                    }

                    const user = data.user;

                    const { id, amount } = req.body;
                    
                    // valid user;
                    // check product exists
                    const product = await Product
                        .findOne({
                            where: { id }
                        })
                    
                    if (!product) {
                        return sendError.withStatus(res, {
                            message: "this product doesn't exist might have been deleted.",
                            status: 404
                            // not found
                        })
                    }

                    // get product's price 
                    // and check if user has those coins;
                    // and user has sufficient of those coins;
                    const productPrice = product.cost;

                    const userProductCoins = user
                        .deposit?.[`${productPrice}`] || 0
                    
                    // no coin
                    if (!userProductCoins) {
                        return sendError.withStatus(res, {
                            message: "you do not have the available coins to purchase this product. Deposit some coins and try again",
                            status: 401
                            // unauthorized
                        })
                    }

                    // insufficient coins
                    if (userProductCoins < amount) {
                        return sendError.withStatus(res, {
                            message: `you do not have enough ${productPrice} coins. Deposit more and try again`,
                            status: 401
                            // unauthorized
                        })
                    }

                    // all checked;
                    // push product to user.purchased
                    const freshPurchased = [...(user.purchased || [])];

                    const reciept = {
                        timeStamp: Date.now(),
                        id,
                        amount
                    }
                    
                    freshPurchased.push(reciept);

                    await user.update({
                        purchased: freshPurchased
                    })

                    await user.save({
                        fields: ['purchased']
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
}
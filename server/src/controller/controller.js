const { User } = require('../models');
const sendSuccess = require('../utils/sendSuccess');
const attempt = require('../utils/attempt');
const generate = require('../utils/generate');
const sendError = require('../utils/sendError');


module.exports = {
    async deposit(req, res) {
        const mainCallback = async () => {
            await attempt({
                express: { res },
                callback: async () => {
                    // only logged in users with role == 'buyer' can access this route.
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

                    if (user.role != 'buyer') {
                        return sendError.withStatus(res, {
                            message: 'only a buyer can deposit coins',
                            status: 401
                            // unauthorized
                        })
                    }
                    
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

                    await user.save();

                    sendSuccess.withStatus(res, {
                        data: {
                            message: 'deposit successfully made'
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
}
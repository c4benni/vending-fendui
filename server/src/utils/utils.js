const { app } = require('../config/config');
const { User } = require('../models');
const generate = require("./generate");

module.exports = {
    clearCookies(res) {
        res?.cookie?.('jwt', null, { maxAge: 0 })
            
        res?.cookie?.('id', null, {maxAge: 0})
    },

    
    async signedInRole({ req, role, invalidRole }) {
        // only logged in users with role == '${role}' can access this route.
        const { id } = await generate.cookies(req.headers.cookie);

        if (!id) {
            return {
                error: {
                    message: 'you need to login first',
                    status: 401
                    // unauthorized
                }
            }
        }

        const user = await User.findOne({
            where: { id }
        })

        if (!user) {
            return {
                error: {
                    message: 'this account may have been deleted',
                    status: 404
                    // not found
                }
            }
        }

        if (user.role != role) {
            return {
                error: {
                    message: invalidRole,
                    status: 401
                    // unauthorized
                }
            }
        }

        return {
            data: user
        }
    },

    defaultDeposit() {
        const deposit = {};

        app.validCost.forEach(cost => {
            deposit[cost] = 0;
        })

        return deposit
    },

    unwantedUserFields: (user) => [
        'password',
        'token',
        'sessions',
        'createdAt',
        'updatedAt',
        user.isSeller ?
            ['deposit', 'purchased']
            : 'income'
    ].flat()
}
const { verify: jwtVerify} = require('jsonwebtoken');
const { auth } = require('../config/config');
const generate = require('../utils/generate');
const sendError = require('../utils/sendError');

module.exports = {
    verify: async (req, res, next) => {

        const { jwt } = await generate
            .cookies(req.headers.cookie);
        
        const expiredSession = () => sendError.withStatus(res, {
                message: 'your session has expired. Login and try again.',
                status: 401
                // unauthorized
            })
        
        if (!jwt) {
            return expiredSession()
        }
        
        const verify = jwtVerify(jwt, auth.jwtSecret);

        if (!verify) {
            return expiredSession()
        }
        next()
    }
}
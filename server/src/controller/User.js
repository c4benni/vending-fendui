const { User } = require('../models')
const attempt = require('../utils/attempt')
const sendError = require('../utils/sendError')
const sendSuccess = require("../utils/sendSuccess")
const { sign: jwtSignature } = require('jsonwebtoken')
const config = require('../config/config')
const generate = require('../utils/generate')

// sign user and return jwt;
function signUser(user, res) {
    // ms * s * min * hr
    const oneDay = 1000 * 60 * .25;

    const userJSON = user.toJSON();

    const unwantedPaths = ['password'];

    unwantedPaths.forEach(path => delete userJSON[path])

    const token = jwtSignature(
        userJSON,
        config.auth.jwtSecret,
        { expiresIn: oneDay }
    )

    res.cookie('jwt', token, { maxAge: oneDay })
    
    res.cookie('username', userJSON.username, {maxAge: oneDay})

    return {
        ...userJSON,
        token
    }
}

// logout helper function;
async function logoutLogic(req, res, all) {
        const mainCallback = async () => {
            await attempt({
                express: { res },
                callback: async () => {
                    const { id } = req.query;

                    // find existing user
                    const user = await User.findOne({
                        where: { id }
                    })

                    if (user) {

                        const { jwt } = await generate
                            .cookies(req.headers.cookie);

                        if (jwt) {
                            user.logout({
                                jwt, all
                            })

                            res.cookie('jwt', null, { maxAge: 0})

                            return sendSuccess.withStatus(res, {
                                message: 'logout successful',
                                status: 200
                                // okay
                            })                                          
                        } else {
                            return sendError.withStatus(res, {
                                message: `session expired`,
                                status: 401
                                // unauthorized
                            })
                        }
                    }
                    
                    return sendError.withStatus(res, {
                        message: `user not found`,
                        status: 401
                        // unauthorized
                    })
                },
                errorMessage: err => ({
                    message: err.message,
                    status: 409
                    // conflict
                })
            })
        }

        await attempt({
            express: { res },
            callback: mainCallback
        })
}

module.exports = {
    async register(req, res) {
        const mainCallback = async () => {
            await attempt({
                express: { res },
                callback: async () => {
                    const { username, password, role } = req.body;
                    // check that user doesnt exist.
                    const findUser = await User.findOne({
                        where: { username }
                    });

                    if (findUser) {
                        return sendError.withStatus(res, {
                            message: 'user exist',
                            status: 400
                            // bad request
                        })
                    }

                    // create a new user;
                    const user = await User.create({
                        username, password, role
                    });

                    // send success if okay;
                    sendSuccess.withStatus(res, {
                        data: {
                            message: 'account successfully created. Login',
                            id: user.id
                        },
                        status: 201
                        // created
                    });
                },
                errorMessage: err => ({
                    message: err.message,
                    status: 409
                    // conflict
                })
            })
        }

        await attempt({
            express: { res },
            callback: mainCallback
        })
    },

    // after a login, push a session
    async login(req, res) {
        const mainCallback = async () => {
            await attempt({
                express: { res },
                callback: async () => {
                    const { username, password } = req.body;

                    // find existing user
                    const user = await User.findOne({
                        where: { username }
                    })

                    if (user) {

                        const matchPassword = await user.matchPassword(password)

                        if (matchPassword) {

                            let alert;
                            
                            const { jwt } = await generate
                                .cookies(req.headers.cookie)

                            const activeSessions = await user
                                .isSignedIn(jwt);

                            if (activeSessions.sessions.length > 1) {
                                alert = 'there is already an active session using your account'
                            }
                            
                            const jwtSigned = signUser(user, res);

                            const sessions = activeSessions.sessions || [];

                            sessions.push(jwtSigned.token);

                            // get fresh user to update sessions;
                            const freshUser = await User.findOne({
                                where: { username }
                            })

                            await freshUser.update({
                                sessions
                            })

                            await freshUser.save({
                                fields: [ 'sessions' ]
                            });
                            
                            const data = {
                                ...jwtSigned,
                                sessions,
                                alert
                            }

                            return sendSuccess.withStatus(res, {
                                status: 200,
                                // okay
                                data
                            })
                        }
                    }
                    
                    return sendError.withStatus(res, {
                        message: `username or password is incorrect`,
                        status: 401
                        // unauthorized
                    })
                },
                errorMessage: err => ({
                    message: err.message,
                    status: 409
                    // conflict
                })
            })
        }

        await attempt({
            express: { res },
            callback: mainCallback
        })
    },

    async logout(req, res) {
        await logoutLogic(req, res, false)  
    },

    async logoutAll(req, res) {
        await logoutLogic(req, res, true)  
    },

    async getUser(req, res) {
        const mainCallback = async () => {
            const { id } = req.query;

            const findUser = await User.findOne({
                where: { id }
            });

            if (!findUser) {
                return sendError.withStatus(res, {
                    message: 'user not found',
                    status: 404
                    // not found
                })
            } else {
                const {
                    id, username, role, createdAt
                } = findUser;

                sendSuccess.withStatus(res, {
                    data: { id, username, role, createdAt },
                    status: 200
                })
            }
        }

        await attempt({
            express: { res },
            callback: mainCallback
        })
    },

    async getAllUsers(req, res) {
        const mainCallback = async () => {
            const { limit, where = {}, offset } = req.query;

            const findUsers = await User
                .findAll({
                    ...where,
                    limit,
                    offset
                })

            if (!findUsers.length) {
                return sendError.withStatus(res, {
                    message: 'user(s) not found',
                    status: 404
                    // not found
                })
            } else {
                const data = [];

                findUsers.forEach(user => {
                    const {
                        id, username, role, createdAt
                    } = user;

                    data.push({
                        id, username, role, createdAt
                    })
                })

                sendSuccess.withStatus(res, {
                    data,
                    status: 200
                })
            }
        }

        await attempt({
            express: { res },
            callback: mainCallback
        })
    },
    
    async updateUser(req, res) {
        const mainCallback = async () => {
            const {
                id, username, password, deposit
            } = req.body;

            const user = await User.findOne({
                where: { id }
            })

            if (!user) {
                return sendError.withStatus(res, {
                    message: 'user not found',
                    status: 401
                    // unauthorized
                })
            }

            const updateValues = {}

            if (password) {
                const oldPassword = password.old;
                const newPassword = password.new;
                
                // avoid unnecessary update
                if (oldPassword === newPassword) {
                    return sendError.withStatus(res, {
                        message: 'new password must be different from old password',
                        status: 401
                        // unauthorized
                    })
                }

                // check that old password is valid;
                const matchPassword = await user.matchPassword(oldPassword);

                if (!matchPassword) {
                    return sendError.withStatus(res, {
                        message: 'old password is incorrect',
                        status: 401
                        // unauthorized
                    })
                }

                updateValues.password = newPassword;
            }

            if (username) {
                // check that user doesnt exist on DB;
                const findUsername = await User.findOne({
                    where: { username }
                })

                if (findUsername) {
                    return sendError.withStatus(res, {
                        message: 'that username is taken. Try again.',
                        status: 400
                    })
                }

                updateValues.username = username;
            }

            if (deposit) {
                updateValues.deposit = deposit;
            }

            await user.update({
                ...updateValues
            })

            await user.save()

            const jwtSigned = signUser(user, res);

            sendSuccess.withStatus(res, {
                data: jwtSigned
            })
        }

        await attempt({
            express: { res },
            callback: mainCallback
        })
    },

    async deleteUser(req, res) {
        const mainCallback = async () => {
            const { id, password } = req.body;

            const findUser = await User.findOne({
                where: { id }
            });

            if (!findUser) {
                return sendError.withStatus(res, {
                    message: 'user not found',
                    status: 404
                    // not found
                })
            } else {
                const matchPassword = await findUser.matchPassword(password);

                if (!matchPassword) {
                    return sendError.withStatus(res, {
                        message: 'incorrect password',
                        status: 404
                        // not found
                    })
                }

                const remove = await findUser.destroy();

                if (remove.error) {
                    throw remove.error;
                }

                return sendSuccess.withStatus(res, {
                    data: {
                        message: 'user deleted'
                    },
                    status: 200
                })
            }
        }

        await attempt({
            express: { res },
            callback: mainCallback
        })
    }
}
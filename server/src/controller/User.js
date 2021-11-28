const { User } = require('../models')
const attempt = require('../utils/attempt')
const sendError = require('../utils/sendError')
const sendSuccess = require("../utils/sendSuccess")
const generate = require('../utils/generate')
const { signUser, signUserFromCookie } = require('../utils/jwt')
const {
    clearCookies,
    defaultDeposit,
    unwantedUserFields
} = require('../utils/utils')
const { Product } = require('../models')

// logout helper function;
async function logoutLogic({
    req, res, all
}) {
        const mainCallback = async () => {
            await attempt({
                express: { res },
                callback: async () => {
                    const { id } = await generate
                        .cookies(req.headers.cookie);

                    // find existing user
                    const user = await User.findOne({
                        where: { id }
                    })

                    if (user) {

                        const { jwt } = await generate
                            .cookies(req.headers.cookie);

                        if (jwt) {
                            const notCurrent = req.query.notCurrent === 'true';

                            await user.logout({
                                jwt, all, notCurrent
                            })

                            clearCookies(res)                            

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

                    const getRole = role.toLowerCase()

                    let deposit = null

                    let income = null;

                    if (getRole == 'buyer') {
                        deposit = defaultDeposit()
                    } else {
                        income = defaultDeposit()
                    }

                    // create a new user;
                    const user = await User.create({
                        username, password,
                        role: getRole,
                        deposit,
                        income
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

                            if (activeSessions.sessions.length) {
                                alert = 'there is already an active session on this account. Do you wish to end all other active sessions?'
                            }
                            
                            const jwtSigned = await signUser(user, res);

                            const sessions = activeSessions.sessions || [];

                            sessions.push(jwtSigned.token);

                            delete jwtSigned.token;

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
                                alert
                            }

                            return sendSuccess.withStatus(res, {
                                data,
                                status: 200
                                // okay
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
        await logoutLogic({
            req, res,
            all: false
        })
    },

    async logoutAll(req, res) {
        await logoutLogic({
            req, res,
            all: true,
        })
    },

    async getUser(req, res) {
        const mainCallback = async () => {
            const { id, self } = req.query;

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
                // check that self query is passed only for signed in users;
                if (self) {
                    const { jwt } = await generate.cookies(req.headers.cookie);

                    const isSignedIn = await findUser
                        .isSignedIn({ jwt })
                    
                    if (!isSignedIn) {
                        return sendError.withStatus(res, {
                            message: 'only signed in users can use the self option',
                            status: 401
                        })
                    }
                }

                const {
                    id, username, role,
                    createdAt, image, header,
                    bio, displayName
                } = findUser;

                const unwantedFields = unwantedUserFields(findUser);

                const data = self ?
                    {
                        ...findUser.toJSON()
                    } :
                    {
                        id, username, role,
                        createdAt, image, header,
                        bio, displayName
                    };
                
                unwantedFields.forEach(field => {
                    delete data[field]
                })

                await signUserFromCookie(req, res)

                res.status(200).send({ data, status: 200 })
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
                    message: 'no user found',
                    status: 404
                    // not found
                })
            } else {
                const data = [];

                findUsers.forEach(user => {
                    const {
                        id, username, role, createdAt, image
                    } = user;

                    data.push({
                        id, username, role, createdAt, image
                    })
                })

                await signUserFromCookie(req, res)

                res.send({
                    data,
                    length: data.length
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

            const { id } = await generate.cookies(req.headers.cookie);

            if (!id) {
                return sendError.withStatus(res, {
                    message: 'session expired',
                    status: 401
                    // unauthorized
                })
            }

            const {
                username, password
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

            const buildUpdateValues = async () => {
                const genericFields = [
                    'displayName',
                    'image',
                    'header',
                    'bio'
                ];

                genericFields.forEach(field => {
                    const value = req.body[field];

                    if (typeof value != undefined) {
                        updateValues[field] = value;
                    }
                })
            }

            await buildUpdateValues();

            await user.update({
                ...updateValues
            })

            await user.save()

            const jwtSigned = await signUser(user, res);

            delete jwtSigned.token;

            res.send({
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

            const { id } = await generate.cookies(req.headers.cookie);

            if (!id) {
                return sendError.withStatus(res, {
                    message: 'session expired',
                    status: 401
                    // unauthorized
                })
            }

            const { password } = req.body;

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

                const removeSellerProducts = async () => {
                    if (!findUser.isSeller) {
                        return
                    }

                    await Product.update({
                        ownerDeleted: true
                    }, {
                        where: {
                            sellerId: findUser.id
                        }
                    })
                }

                await removeSellerProducts()

                const remove = await findUser.destroy();

                if (remove.error) {
                    throw remove.error;
                }

                clearCookies(res)                            

                return sendSuccess.plain(res, {
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
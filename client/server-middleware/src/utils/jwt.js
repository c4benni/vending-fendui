const { verify: jwtVerify, sign } = require('jsonwebtoken')
const { auth, app } = require('../config/config')
const { User } = require('../models')
const sendError = require('./sendError')
const { clearCookies, unwantedUserFields } = require('../utils/main')

// sign user and return jwt;
async function signUser(user, res) {
  const sessionMaxTime = app.sessionMaxTime

  const unwanted = unwantedUserFields(user)

  const userJSON = user.toJSON()

  unwanted.forEach((path) => delete userJSON[path])

  const { id, username, password } = userJSON

  const signedDetails = { id, username, password }

  const token = sign(signedDetails, auth.jwtSecret, {
    expiresIn: sessionMaxTime,
  })

  res?.cookie?.('jwt', token, {
    maxAge: sessionMaxTime,
    httpOnly: true,
  })

  res?.cookie?.('id', userJSON.id, {
    maxAge: sessionMaxTime,
    httpOnly: true,
  })

  // return token to be stored in the user's table
  return {
    ...userJSON,
    token,
  }
}

async function verify(req, res, next) {
  const { jwt, id } = req.cookies

  const expiredSession = () =>
    sendError.withStatus(res, {
      message: 'your session has expired. Login and try again.',
      status: 401,
      // unauthorized
    })

  if (!jwt) {
    return expiredSession()
  }

  const verify = jwtVerify(jwt, auth.jwtSecret)

  if (!verify) {
    clearCookies(res)

    return expiredSession()
  } else {
    const user = await User.findOne({
      where: { id },
    })

    if (user) {
      await signUser(user, res)
    }
  }
  next()
}

async function signUserFromCookie(req, res) {
  const { id } = req.cookies

  if (id) {
    const user = await User.findOne({
      where: { id },
    })

    if (user) {
      await signUser(user, res)
    }
  }

  return 1
}

module.exports = {
  verify,
  signUser,
  signUserFromCookie,
}

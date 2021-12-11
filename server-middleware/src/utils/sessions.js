/* eslint-disable require-await */
const { Op } = require('sequelize/dist')
const { app } = require('../config/config')

const { clearCookies, getCookie } = require('../utils/utils')

function signCookies({ res, token, userId }) {
  const { sessionMaxTime } = app

  res?.cookie?.('token', token, {
    maxAge: sessionMaxTime,
    httpOnly: true
  })

  res?.cookie?.('id', userId, {
    maxAge: sessionMaxTime,
    httpOnly: true
  })
}

const { Session } = require('../models')
async function findSession(token, userId, deviceHash) {
  const session = await Session.findOne({
    where: {
      session: token,
      [Op.and]: {
        id: userId,
        deviceHash
      }
    }
  })

  console.log({ session, token, userId, deviceHash })

  if (session && session.timeout <= Date.now()) {
    await session.Sign(0)

    return null
  }

  return session
}

async function signUser(userId, res, req) {
  // use cookie parser;
  let token = req.cookies?.token

  // cookie parser's value might not be available on first
  // req. Use getCookie() then;
  if (!token) {
    token = getCookie(req.headers.cookie).token || '0'
  }

  const session = await findSession(token, userId, req.machineId)

  let signedSession

  if (session) {
    signedSession = await session.Sign()
  }

  if (signedSession?.token) {
    signCookies({
      res,
      token,
      userId
    })
  }

  return {
    token,
    id: userId
  }
}

async function verify(req, res, next) {
  const { token, id: userId } = req.cookies

  const expiredSession = () =>
    res.status(401).send({
      message: {
        text: 'your session has expired. Login and try again'
      },
      status: 401
      // unauthorized
    })

  if (!token) {
    return expiredSession()
  }

  const session = await findSession(token, userId, req.machineId)

  if (!session) {
    clearCookies(res)

    return expiredSession()
  } else {
    await signUser(userId, res, req)
  }

  next()
}

async function signUserFromCookie(req, res) {
  const { id } = req.cookies

  if (id) {
    await signUser(id, res, req)
  }

  return 1
}

module.exports = {
  verify,
  signUser,
  signUserFromCookie,
  findSession,
  signCookies
}

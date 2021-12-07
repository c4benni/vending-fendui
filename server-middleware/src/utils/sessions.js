/* eslint-disable require-await */
const { Op } = require('sequelize/dist')
const { app } = require('../config/config')

const { clearCookies } = require('../utils/utils')
const sendError = require('./sendError')

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

async function findSession(token, userId) {
  const { Session } = require('../models')

  const session = await Session.findOne({
    where: {
      id: userId,
      [Op.and]: {
        session: token
      }
    }
  })

  return session
}

async function signUser(userId, res, req) {
  let token = req.cookies?.token

  if (!token) {
    const bearer = req.headers?.Authorization?.split?.(' ')

    token = bearer?.[1]
  }

  if (!token) {
    token = '0'
  }

  const session = await findSession(token, userId)

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

  req.token = token

  return {
    token,
    id: userId
  }
}

async function verify(req, res, next) {
  const { token: cookiesToken, id: cookiesId } = req.cookies

  const bearerToken = cookiesToken
    ? null
    : req.headers?.Authorization?.split?.(' ')?.[0]
  const bearerId = cookiesId ? null : req.headers?.uid

  const bodyToken = cookiesToken || bearerToken ? null : req.body.session
  const bodyId = cookiesId || bearerId ? null : req.body.id

  const token = cookiesToken || bearerToken || bodyToken || ''
  const userId = cookiesId || bearerId || bodyId || ''

  const expiredSession = () =>
    sendError.withStatus(res, {
      message: {
        text: 'your session has expired. Login and try again'
      },
      status: 401
      // unauthorized
    })

  if (!token) {
    return expiredSession()
  }

  const session = await findSession(token, userId)

  if (!session || session?.timeout <= Date.now()) {
    clearCookies(res)

    // delete session if expired;
    session && session?.sign?.(0)

    return expiredSession()
  } else {
    await signUser(userId, res, req)
  }

  next()
}

async function signUserFromCookie(req, res) {
  let { id } = req.cookies

  if (!id) {
    id = req.headers.uid
  }

  if (id) {
    signUser(id, req, res)
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

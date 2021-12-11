const path = require('path')

const fs = require('fs')

const router = require('express').Router()

const { findSession, verify } = require('../utils/sessions')

const { unwantedUserFields, getCookie } = require('../utils/utils')

const { User } = require('../models')

const routes = []

fs.readdirSync(__dirname)
  .filter((file) => file != 'index.js')
  .forEach((file) => {
    const module = require(path.join(__dirname, file))

    if (Array.isArray(module)) {
      routes.push(...module)
    }
  })

routes.forEach((route) => {
  const method = route.method
  const url = route.url
  const middleWare = [route.middleWare].flat()

  const sessionVerification = []

  const publicUserRoutes =
    method == 'post' && /^\/user\/(?=login|register$)/.test(url)

  const publicProductRoutes =
    method == 'get' && /^\/product\/?$|^\/product\/all$/.test(url)

  const authenticate = !publicUserRoutes && !publicProductRoutes

  if (authenticate) {
    sessionVerification.push(verify)
  }

  const callbacks = [sessionVerification, middleWare, route.callback]

  router[method](url, callbacks)
})

// for authenticating a user on the client;
// returns nothing if user's session is expired;
// or user not found.
// signs user if found;
router.get('/auth', async (req, res) => {
  let data = {}

  const { id, token } = getCookie(req.headers.cookie)

  if (!token || !id) {
    return res.send({})
  }

  const session = await findSession(token, id, req.machineId)

  console.log({ session, hash: req.machineId })

  if (!session) {
    return res.send({})
  }

  await session.Sign()

  data = await User.findByPk(id)

  const unwanted = unwantedUserFields(data)

  unwanted.forEach((path) => delete data[path])

  res.send({
    data
  })
})

module.exports = router

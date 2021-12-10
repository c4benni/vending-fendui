const { Router } = require('express')

const router = Router()

const session = require('../utils/sessions')

const { signedInRole, unwantedUserFields } = require('../utils/utils')
const User = require('./User')
const Product = require('./Products')
const clientRoutes = require('./clientRoutes')

const routes = [...User, ...Product, ...clientRoutes]

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
    sessionVerification.push(session.verify)
  }

  const callbacks = [sessionVerification, middleWare, route.callback]

  router[method](url, callbacks)
})

router.get('/auth', async (req, res) => {
  const { data, error } = await signedInRole({ req, res })

  if (error) {
    return res.send({ error })
  }

  await session.signUser(data.id, res, req)

  const unwanted = unwantedUserFields(data)

  unwanted.forEach((path) => delete data[path])

  res.send({
    data
  })
})

module.exports = router

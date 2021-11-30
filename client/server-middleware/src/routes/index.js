const { Router } = require('express')

const router = Router()

// const { base } = require('../config/config');
const jwt = require('.../utils/jwt')

const User = require('./User')
const Product = require('./Products')
const Media = require('./client/media')

const routes = [...User, ...Product, ...Media]

routes.forEach((route) => {
  const method = route.method
  const url = route.url
  const middleWare = [route.middleWare].flat()

  const jwtVerification = []

  const publicUserRoutes =
    method == 'post' && /^\/user\/(?=login|register$)/.test(url)

  const publicProductRoutes =
    method == 'get' && /^\/product\/?$|^\/product\/all$/.test(url)

  const authenticate = !publicUserRoutes && !publicProductRoutes

  if (authenticate) {
    jwtVerification.push(jwt.verify)
  }

  const callbacks = [jwtVerification, middleWare, route.callback]

  router[method](url, callbacks)
})

module.exports = router

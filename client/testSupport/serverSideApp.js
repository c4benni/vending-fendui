import connect from 'connect'
import nuxtConfig from '~/nuxt.config'

const app = connect()

for (const middlewareConfig of nuxtConfig.serverMiddleware) {
  if (typeof middlewareConfig === 'string') {
    const middleware = require(middlewareConfig).default
    app.use(middleware)
  } else {
    const { handler, path } = middlewareConfig
    const middleware = require(handler).default
    app.use(path, middleware)
  }
}

export default app

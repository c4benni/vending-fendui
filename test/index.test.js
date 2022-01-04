const { readdirSync } = require('fs')
const { resolve, join: joinPath } = require('path')
const { Nuxt, Builder } = require('nuxt')
const request = require('supertest')
const { isProduction } = require('~/utils/main')


// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null

// Init Nuxt.js and create a server listening on localhost:4000
beforeAll(async () => {
  const config = {
    dev: !isProduction,
    rootDir: resolve(__dirname, '../'),
    serverMiddleware: [
      { path: '/api/v1', handler: '~/server-middleware/src/server.js' }
    ],
    build: {
      extend(config) {
        config.node = {
          fs: 'empty'
        }
      }
    }
  }

  nuxt = new Nuxt(config)

  await new Builder(nuxt).build()

  nuxt.server.listen(4000, 'localhost')
}, 60000)

const testSuites = []

// auto import test files and add them to testSuites[]
readdirSync(__dirname)
  // get only .test files that arent this file
  .filter((file) => /.+\.test\.js$/.test(file) && file != 'index.js')
  .forEach((file) => {
    // import test files;
    const testSuite = require(joinPath(__dirname, file))

    // add to testSuites[]
    // only add files that are an exported function
    typeof testSuite == 'function' && testSuites.push(testSuite)
  })

// execute each test in testSuites[];
for (const testSuite of testSuites) {
  testSuite(() => nuxt, request)
}

// require('./product.test')(() => nuxt, request)

// Close server and ask nuxt to stop listening to file changes
afterAll(() => {
  nuxt.close()
})

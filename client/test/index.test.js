const { readdirSync } = require('fs')
const { resolve, join: joinPath } = require('path')
const { Nuxt, Builder } = require('nuxt')
const request = require('supertest')

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null

// Init Nuxt.js and create a server listening on localhost:4000
beforeAll(async () => {
  const config = {
    dev: process.env.NODE_ENV === 'production',
    rootDir: resolve(__dirname, '../'),
    serverMiddleware: [
      { path: '/api/v1', handler: '~/server-middleware/src/server.js' }
    ]
  }

  nuxt = new Nuxt(config)

  await new Builder(nuxt).build()

  nuxt.server.listen(4000, 'localhost')
}, 60000)

const testFiles = []

// auto import test files and add them to testFiles[]
readdirSync(__dirname)
  // get only .test files that arent this file
  .filter((file) => /.+\.test\.js$/.test(file) && file != 'index.js')
  .forEach((file) => {
    // import test files;
    const testFile = require(joinPath(__dirname, file))

    // add to testFiles[]
    // only add files that are an exported function
    typeof testFile == 'function' && testFiles.push(testFile)
  })

// execute each test in testFiles[];
for (const testFile of testFiles) {
  testFile(() => nuxt, request)
}

// require('./product.test')(() => nuxt, request)

// Close server and ask nuxt to stop listening to file changes
afterAll(() => {
  nuxt.close()
})

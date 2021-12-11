module.exports = function (nuxt, request) {
  // Test that Nuxt renders html
  describe('GET /', () => {
    test('Route / exits and render HTML', async () => {
      const { html } = await nuxt().renderRoute('/', {})

      // nuxt id
      expect(html).toContain('__nuxt')
    })

    test('returns status code 200', async () => {
      const response = await request(nuxt().server.app).get('/')
      expect(response.statusCode).toBe(200)
    })
  })

  describe('GET /invalid-route', () => {
    test('returns status code 404', async () => {
      const response = await request(nuxt().server.app).get('/invalid-route')
      expect(response.statusCode).toBe(404)
    })
  })
}

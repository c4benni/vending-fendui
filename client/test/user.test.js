module.exports = function (nuxt, request) {
  const url = (path) => `/api/v1/user/${path}`

  const registerUrl = url('register')
  const loginUrl = url('login')
  const logoutURL = url('logout')
  const logoutAllUrl = `${logoutURL}/all`

  const { User } = require('../server-middleware/src/models')

  const validRoles = ['buyer', 'seller']

  // string{}
  // username: 3 - 20, no special chars;
  // password: 6 - 32, at least (1 uppercase, 1 lowercase, 1 number, 1 special)
  // role: buyer or seller
  const userInfo = {
    username: 'user1',
    password: 'Qwerty$2',
    role: validRoles[Math.floor(Math.random() * validRoles.length)]
  }

  const { role, password, username } = userInfo

  const login = async (api) =>
    await api.post(loginUrl).send({
      username,
      password
    })

  describe(`POST ${registerUrl}`, () => {
    test(`Returns 400 when incorrect values are passed`, async () => {
      const api = () => request(nuxt().server.app)
      const POST = api().post

      const _test = async (payload) => {
        const wrongPayload = await POST(registerUrl).send(payload)

        return expect(wrongPayload.statusCode).toEqual(400)
      }

      // no username, try adding an incorrect one;
      await _test({
        password,
        role
      })

      // with username less than 3;
      await _test({
        password,
        role,
        username: 'us'
      })

      // username has special characters
      await _test({
        password,
        role,
        username: 'user%$&'
      })

      // no password
      await _test({
        role,
        username
      })

      // incorrect password, no uppercase
      await _test({
        role,
        username,
        password: 'qwerty$1'
      })

      // no role
      await _test({
        username,
        password
      })

      // invalid role
      await _test({
        username,
        password,
        role: 'random'
      })

      // invalid fields are passed
      await _test({
        username,
        password,
        role,
        invalidField: true
      })
    })

    test(`Returns 201 when account is successfully created`, async () => {
      const api = () => request(nuxt().server.app)
      const POST = api().post

      const response = await POST(registerUrl).send(userInfo)

      const { statusCode } = response

      expect(statusCode).toEqual(201)
    })

    test('User exists in the DB and password is hashed', async () => {
      const getUser = await User.findOne({
        where: { username }
      })

      if (getUser.error) {
        throw new Error('nothing found')
      }

      // user exists;
      expect(getUser || null).toBeTruthy()

      // check password is hashed;
      expect(getUser).toBeTruthy()
    })
  })

  // Test that the above user can login
  describe(`POST ${loginUrl}`, () => {
    /**
     * NB:  The same validation process for register applies to login.
     *      A simple test below to show only username and password can be passed
     * **/

    test(`Returns 400 when an invalid field is passed`, async () => {
      const api = () => request(nuxt().server.app)
      const POST = api().post

      const { statusCode } = await POST(loginUrl).send({
        username,
        password,
        invalidField: true
      })

      expect(statusCode).toEqual(400)
    })

    test(`Returns 401 when invalid password is passed`, async () => {
      const api = () => request(nuxt().server.app)
      const POST = api().post

      const { statusCode } = await POST(loginUrl).send({
        username,
        password: 'Incorrect$1'
      })

      expect(statusCode).toEqual(401)
    })

    test(`Returns 200 when valid payload passed`, async () => {
      const api = () => request(nuxt().server.app)
      const POST = api().post

      const { statusCode } = await login(api())

      // logout all instances;
      await POST(logoutAllUrl)

      expect(statusCode).toEqual(200)
    })

    // Test that the data response has an alert when more than 1 session is active;
    test(`Returns an alert when more than 1 session is active`, async () => {
      const api = () => request(nuxt().server.app)

      // simulate double logins;

      await login(api())

      const { body } = await login(api())

      await api().post(logoutAllUrl)

      expect(body.data.alert).toBeTruthy()
    })
  })

  // Test that a user can logout;
  describe(`POST ${logoutURL}`, () => {
    test(`Returns 200 when logout is successful, and 401 when no session`, async () => {
      const api = () => request(nuxt().server.app)
      const POST = api().post

      const { statusCode: errorStatusCode } = await POST(logoutURL)

      expect(errorStatusCode).toEqual(401)

      const { headers } = await login(api())

      const { statusCode: validStatusCode } = await POST(logoutURL).set(
        'Cookie',
        headers['set-cookie']
      )

      expect(validStatusCode).toEqual(200)
    })
  })

  // Test that a user can end all sessions;
  describe(`POST ${logoutAllUrl}`, () => {
    test(`Returns 401 when unauthorized`, async () => {
      const api = () => request(nuxt().server.app)
      const POST = api().post

      const { statusCode } = await POST(logoutAllUrl)

      expect(statusCode).toEqual(401)
    })

    test(`Returns 200 when successful`, async () => {
      const api = () => request(nuxt().server.app)
      const POST = api().post

      const { headers } = await login(api())

      const { statusCode } = await POST(logoutAllUrl).set(
        'Cookie',
        headers['set-cookie']
      )

      expect(statusCode).toEqual(200)
    })
  })
}

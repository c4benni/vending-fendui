const { User } = require('../server-middleware/src/models')

const sellerInfo = {
  username: 'user5',
  password: 'Qwerty$2',
  role: 'seller'
}

const buyerInfo = {
  username: 'user6',
  password: 'Qwerty$2',
  role: 'buyer'
}

module.exports = function (nuxt, request) {
  const $fetch = () => request(nuxt().server.app)

  const reset = async (headers) => {
    const response = await $fetch()
      .post('/api/v1/reset')
      .set('Cookie', headers['set-cookie'] || 'null')

    return response
  }

  const Login = async (user) => {
    const { username, password } = user
    const response = await $fetch().post('/api/v1/user/login').send({
      username,
      password
    })

    return response
  }

  const deposit = async (payload, headers) => {
    const api = () => $fetch()
    const POST = api().post

    const cookie = headers
      ? ['Cookie', headers['set-cookie'] || 'null']
      : ['no-token', 'true']

    const output = await POST('/api/v1/deposit')
      .send(payload)
      .set(...cookie)

    return output
  }

  describe('Valid deposits can be made by logged in buyer', () => {
    test('Returns 401 when user isnt logged in', async () => {
      const { statusCode } = await deposit({
        amount: 50,
        quantity: 1
      })
      expect(statusCode).toEqual(401)
    })

    test('Returns 403 when accessed by a seller', async () => {
      // create a seller account;
      //  create a new user with seller role
      await User.create(sellerInfo)

      //   login that user
      const { headers } = await Login(sellerInfo)

      //   make a deposit;
      const { statusCode } = await deposit(
        {
          amount: 50,
          quantity: 1
        },
        headers
      )

      expect(statusCode).toEqual(403)
    })

    test('Returns 401 when amount isnt valid [5,10,20,50,100]', async () => {
      // create a seller account;
      //  create a new user with seller role
      await User.create(buyerInfo)

      //   login that user
      const { headers } = await Login(buyerInfo)

      //   make a deposit;
      const { statusCode } = await deposit(
        {
          amount: 1,
          quantity: 1
        },
        headers
      )

      expect(statusCode).toEqual(400)
    })

    test('Returns 401 when quantity > 1000', async () => {
      //   login a buyer
      const { headers } = await Login(buyerInfo)

      //   make a deposit;
      const { statusCode } = await deposit(
        {
          amount: 50,
          quantity: 1001
        },
        headers
      )

      expect(statusCode).toEqual(400)
    })

    test('Buyer can deposit successfully', async () => {
      //   login a buyer
      const { headers, body } = await Login(buyerInfo)

      const initialDeposit = body.data.deposit

      //   no deposit yet;
      expect(initialDeposit).toEqual(null)

      //   make a deposit;
      const {
        statusCode,
        body: depositBody,
        headers: buyHeader
      } = await deposit(
        {
          amount: 50,
          quantity: 10
        },
        headers
      )

      const newDeposit = depositBody.data.deposit

      expect(newDeposit).toEqual(500)

      expect(statusCode).toEqual(200)

      // reset deposit so we don't keep track of total deposits;

      const { statusCode: resetStatusCode } = await reset(buyHeader)

      expect(resetStatusCode).toEqual(200)
    })
  })

  describe('Valid buyer can reset deposit', () => {
    const reset = async (headers) => {
      const api = () => $fetch()
      const POST = api().post

      const cookie = headers
        ? ['Cookie', headers['set-cookie'] || 'null']
        : ['no-token', 'true']

      const output = await POST('/api/v1/reset').set(...cookie)

      return output
    }

    test('Returns 401 when user isnt logged in', async () => {
      const { statusCode } = await reset()

      expect(statusCode).toEqual(401)
    })

    test('Returns 403 when accessed by a seller', async () => {
      //   login a seller
      const { headers } = await Login(sellerInfo)

      //   attemt to reset
      const { statusCode } = await reset(headers)

      expect(statusCode).toEqual(403)
    })

    test('Buyer can successfully reset deposit', async () => {
      //   login a buyer
      const { headers } = await Login(buyerInfo)

      // deposit 10 100cent coins;
      const depositPayload = {
        amount: 100,
        quantity: 1
      }

      const { body } = await deposit(depositPayload, headers)

      const newBalance = body.data.deposit

      expect(newBalance).toEqual(
        depositPayload.amount * depositPayload.quantity
      )

      //   attemt to reset
      const { statusCode, body: resetBody } = await reset(headers)

      expect(statusCode).toEqual(200)

      const resetBalance = resetBody.data.deposit

      expect(resetBalance).toEqual(0)
    })
  })
}

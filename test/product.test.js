const { User } = require('../server-middleware/src/models')

const validValues = {
  productName: 'new product',
  amountAvailable: '100',
  cost: '200',
  type: 'social'
}

const sellerInfo = {
  username: 'user3',
  password: 'Qwerty$2',
  role: 'seller'
}

let productCode
let loginCookie

module.exports = function (nuxt, request) {
  const logInSellerInfo = async () => {
    const { username, password } = sellerInfo
    const { headers } = await request(nuxt().server.app)
      .post('/api/v1/user/login')
      .send({
        username,
        password
      })

    return headers
  }

  // Test that only valid values are acepted;
  describe('Create Product', () => {
    const createProduct = async (payload, headers) => {
      const api = () => request(nuxt().server.app)
      const POST = api().post

      const cookie = headers
        ? ['Cookie', headers['set-cookie'] || 'null']
        : ['no-token', 'true']

      const output = await POST('/api/v1/product')
        .send(payload)
        .set(...cookie)

      return output
    }

    test('Returns 401 when accessed by a user not logged in', async () => {
      const { statusCode } = await createProduct(validValues)

      expect(statusCode).toEqual(401)
    })

    test('Returns 401 when accessed by a "buyer"', async () => {
      const buyerInfo = {
        username: 'user2',
        password: 'Qwerty$2',
        role: 'buyer'
      }

      //   create a new user with buyer role
      await User.create(buyerInfo)

      //   login that user
      const { username, password } = buyerInfo

      const { headers } = await request(nuxt().server.app)
        .post('/api/v1/user/login')
        .send({
          username,
          password
        })

      const { statusCode } = await createProduct(validValues, headers)

      expect(statusCode).toEqual(401)
    })

    describe('Returns 401 when accessed by a "seller" with wrong payload', () => {
      const { productName, type, amountAvailable, cost } = validValues

      test('Only accepts coins in multiple of 5', async () => {
        //  create a new user with seller role
        await User.create(sellerInfo)

        //  login seller
        const headers = await logInSellerInfo()

        const { statusCode } = await createProduct(
          {
            productName,
            type,
            amountAvailable,
            cost: '9'
          },
          headers
        )

        expect(statusCode).toEqual(400)
      })

      // products type are required for future sorting
      test('Invalid type return 400', async () => {
        //   login seller
        const headers = await logInSellerInfo()

        const { statusCode } = await createProduct(
          {
            productName,
            type: 'wrong-type',
            amountAvailable,
            cost
          },
          headers
        )

        expect(statusCode).toEqual(400)
      })
    })

    test('Returns 200 when accessed by a "seller" with the right payload', async () => {
      //   login that user
      const headers = await logInSellerInfo()

      const { statusCode, body } = await createProduct(validValues, headers)

      productCode = body.data?.product?.id || ''

      expect(statusCode).toEqual(200)
    })
  })

  describe('GET product by Id', () => {
    test('Returns 400 when no id is passed in query', async () => {
      const { statusCode } = await request(nuxt().server.app).get(
        '/api/v1/product'
      )

      expect(statusCode).toEqual(400)
    })

    test('Returns 404 when no product is found', async () => {
      const { statusCode } = await request(nuxt().server.app).get(
        `/api/v1/product?id=${productCode?.replace?.(/\d+$/, '00')}`
      )

      expect(statusCode).toEqual(404)
    })

    test('Returns 200 when product is found', async () => {
      const { statusCode } = await request(nuxt().server.app).get(
        `/api/v1/product?id=${productCode}`
      )

      expect(statusCode).toEqual(200)
    })
  })

  describe('GET all products', () => {
    test('Returns 404 when no product is found', async () => {
      // pass a wrong id;
      const { statusCode } = await request(nuxt().server.app).get(
        `/api/v1/product/all?where={"id":"wrong-id"}`
      )

      expect(statusCode).toEqual(404)
    })

    test('Returns 200 when products are found', async () => {
      const { statusCode } = await request(nuxt().server.app).get(
        `/api/v1/product/all`
      )

      expect(statusCode).toEqual(200)
    })
  })

  describe('UPDATE a product', () => {
    //   expired session;
    test('Returns 401 when user not logged in', async () => {
      const { statusCode } = await request(nuxt().server.app).patch(
        '/api/v1/product'
      )

      expect(statusCode).toEqual(401)
    })

    // only the user that added the product can update it;
    // create a dummy user;
    test('Only a seller can update their item', async () => {
      const dummyUser = {
        ...sellerInfo,
        username: 'user4'
      }

      await User.create(dummyUser)

      //   login that user
      const { username, password } = dummyUser

      const { headers } = await request(nuxt().server.app)
        .post('/api/v1/user/login')
        .send({
          username,
          password
        })

      loginCookie = ['Cookie', headers['set-cookie']]

      // try updating the product in let productCode above;
      const { statusCode } = await request(nuxt().server.app)
        .patch('/api/v1/product')
        .set('Cookie', headers['set-cookie'])
        .send({
          id: productCode
        })

      expect(statusCode).toEqual(401)
    })

    //   bad request;
    test('Returns 400 when user no id is in body', async () => {
      const { statusCode } = await request(nuxt().server.app)
        .patch('/api/v1/product')
        .set(...loginCookie)

      expect(statusCode).toEqual(400)
    })

    test('Returns 200 when the right user updates an existing product', async () => {
      //   login sellerInfo;
      const headers = await logInSellerInfo()

      // try updating the product in let productCode above;
      const { statusCode } = await request(nuxt().server.app)
        .patch('/api/v1/product')
        .set('Cookie', headers['set-cookie'])
        .send({
          id: productCode,
          productName: 'New name'
        })

      expect(statusCode).toEqual(200)
    })

    //   to confirm, get that product and check that its name is updated from "new product" to "New name"
    test('Product name changed successfully', async () => {
      const { body } = await request(nuxt().server.app).get(
        `/api/v1/product?id=${productCode}`
      )

      expect(body.data.productName).toEqual('New name')
    })
  })

  describe('DELETE a product', () => {
    test('Returns 401 if user not logged in', async () => {
      const { statusCode } = await request(nuxt().server.app).delete(
        '/api/v1/product'
      )

      expect(statusCode).toEqual(401)
    })

    // check that id is present in req.query;
    test('Returns 400 if no id in query', async () => {
      // login
      const headers = await logInSellerInfo()

      const { statusCode } = await request(nuxt().server.app)
        .delete('/api/v1/product')
        .set('Cookie', headers['set-cookie'])

      expect(statusCode).toEqual(400)
    })

    test('Returns 204 if successful', async () => {
      // login
      const headers = await logInSellerInfo()

      const { statusCode } = await request(nuxt().server.app)
        .delete(`/api/v1/product?id=${productCode}`)
        .set('Cookie', headers['set-cookie'])

      expect(statusCode).toEqual(200)
    })
  })
}

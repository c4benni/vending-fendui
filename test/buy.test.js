const { User } = require('../server-middleware/src/models')

const sellerInfo = {
  username: 'user8',
  password: 'Qwerty$2',
  role: 'seller'
}

let sellerId

// let buyerId

let productCode

// let deletedSellerProductCode

let sellerIncome

const productInfo = {
  productName: 'new product2',
  amountAvailable: '100',
  cost: '10',
  type: 'social'
}

const buyerInfo = {
  username: 'user7',
  password: 'Qwerty$2',
  role: 'buyer'
}

module.exports = function (nuxt, request) {
  const $fetch = () => request(nuxt().server.app)

  const Login = async (user) => {
    const { username, password } = user
    const response = await $fetch().post('/api/v1/user/login').send({
      username,
      password
    })

    return response
  }

  const reset = async (headers) => {
    const response = await $fetch()
      .post('/api/v1/reset')
      .set('Cookie', headers['set-cookie'] || 'null')

    return response
  }

  describe('Logged in buyers can buy a product successfully and the seller gets paid', () => {
    const createProduct = async (payload, headers) => {
      const api = () => $fetch()
      const POST = api().post

      const cookie = headers
        ? ['Cookie', headers['set-cookie'] || 'null']
        : ['no-token', 'true']

      const output = await POST('/api/v1/product')
        .send(payload)
        .set(...cookie)

      return output
    }

    const buy = async (payload, headers) => {
      const api = () => $fetch()
      const POST = api().post

      const cookie = headers
        ? ['Cookie', headers['set-cookie'] || 'null']
        : ['no-token', 'true']

      const output = await POST('/api/v1/buy')
        .send(payload)
        .set(...cookie)

      return output
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

    test('Returns 401 when user isnt logged in', async () => {
      const { statusCode } = await buy({
        id: productCode,
        amount: 2
      })
      expect(statusCode).toEqual(401)
    })

    test('Returns 403 when accessed by a seller', async () => {
      // create a seller account;
      //  create a new user with seller role
      await User.create(sellerInfo)

      //   login that user
      const { headers, body: loginBody } = await Login(sellerInfo)

      // while we are at it, lets create a product.
      const { body } = await createProduct(productInfo, headers)

      productCode = body.data?.product?.id || 'null'

      sellerId = body.data?.product?.sellerId

      expect(sellerId).toEqual(loginBody.data.id)

      //  attempt to buy a product as seller;
      const { statusCode } = await buy(
        {
          id: productCode,
          amount: 2
        },
        headers
      )

      expect(statusCode).toEqual(403)
    })

    test('Returns 404 if product not found', async () => {
      // create a buyer account;
      //  create a new user with buyer role
      await User.create(buyerInfo)

      //   login that user
      const { headers } = await Login(buyerInfo)

      // buyerId = body.data.id

      //   buy an unavailable product;
      const { statusCode } = await buy(
        {
          id: productCode.replace(/\d+$/, '00'),
          amount: 2
        },
        headers
      )

      expect(statusCode).toEqual(404)
    })

    // test("Returns 403 if product's owner is deleted", async () => {
    //   // create a dummy seller account;
    //   //  create a new user with seller role
    //   const dummyInfo = {
    //     username: 'dummySeller2',
    //     password: sellerInfo.password,
    //     role: 'seller'
    //   }
    //   await User.create(dummyInfo)

    //   //   login that user
    //   const { headers } = await Login(dummyInfo)

    //   // lets create a product.
    //   const { body } = await createProduct(
    //     { ...productInfo, productName: 'Deleted Seller ProductCode' },
    //     headers
    //   )

    //     deletedSellerProductCode = body.data?.product?.id || 'null'

    //   // delete that user;
    //   await $fetch()
    //     .delete('/api/v1/user')
    //     .set('Cookie', headers['set-cookie'] || 'null')

    //   // login as a buyer;
    //   const { headers: buyerHeader } = await Login(buyerInfo)

    //   // try buying the deleted user's product;
    //   const { statusCode } = await buy(
    //     {
    //       id: deletedSellerProductCode,
    //       amount: 2
    //     },
    //     buyerHeader
    //   )

    //   expect(statusCode).toEqual(403)
    // })

    test("Returns 403 when user doesn't have sufficient coins", async () => {
      //   login a buyer
      const { headers, body } = await Login(buyerInfo)

      const expectedCoin = body.data.deposit

      expect(expectedCoin).toEqual(null)

      //   deposit 1 10cent coin

      //   make insufficient deposit;
      const { body: depositBody } = await deposit(
        {
          amount: 10,
          quantity: 1
        },
        headers
      )

      const expectedCoinDeposit = depositBody.data.deposit

      expect(expectedCoinDeposit).toEqual(10)

      // attempt to buy with insufficient coins;
      const { statusCode, headers: buyHeader } = await buy(
        {
          id: productCode,
          amount: 100
        },
        headers
      )

      expect(statusCode).toEqual(403)

      // reset deposit so we don't keep track of total deposits;

      const { statusCode: resetStatusCode } = await reset(buyHeader)

      expect(resetStatusCode).toEqual(200)
    })

    test('Returns 403 when product.avaliableAmount is less than requested amount', async () => {
      //   login a buyer
      const { headers } = await Login(buyerInfo)

      //   make sufficient deposit;

      const depositPayload = {
        amount: 10,
        quantity: 1000
      }

      const { body } = await deposit(depositPayload, headers)

      const expectedCoinDeposit = body.data.deposit

      expect(expectedCoinDeposit).toEqual(
        depositPayload.amount * depositPayload.quantity
      )

      // available is 100, attempt to buy 101 pieces;

      const { statusCode } = await buy(
        {
          id: productCode,
          amount: 101
        },
        headers
      )

      expect(statusCode).toEqual(403)
    })

    // on success:
    // push product to user.purchased;
    // deduct from product.amountAvailable;
    // update buyer's purchases and deduct deposit;
    // update seller's income;
    describe('Buy process', () => {
      //   save seller's income before buying;
      test(`Seller's income for 10cent coin is 0`, async () => {
        const { body: sellerLogin } = await Login(sellerInfo)

        sellerIncome = sellerLogin.data.income

        expect(sellerIncome).toEqual(null)
      })
      //    make a successful purchase
      test('Returns 200 on successful purchase', async () => {
        //   login a buyer
        const { headers, body: buyerLogin } = await Login(buyerInfo)

        const initialDeposit = +buyerLogin.data.deposit

        expect(initialDeposit).toEqual(10000)

        //   1 should be left;
        const purchasePayload = {
          id: productCode,
          amount: 99
        }

        const { statusCode, body: purchaseBody } = await buy(
          purchasePayload,
          headers
        )

        expect(statusCode).toEqual(200)

        expect(Array.isArray(purchaseBody.data.change)).toBe(true)

        //   check that user.purchased is updated;
        //   get user;
        // const { body: currentBuyer } = await $fetch()
        //   .get(`/api/v1/user?id=${buyerId}&self=true`)
        //   .set('Cookie', headers['set-cookie'])

        // const purchased = currentBuyer.data.purchased

        // const findPurchasedProduct = purchased.find(
        //   (product) => product.id == productCode
        // )

        // expect(findPurchasedProduct).toBeTruthy()

        //   check that buyer's deposit is updated;

        const newBuyerDeposit = purchaseBody.data.changeTotal

        // 99 items were bought, meaning 99 * 10 (+productInfo.cost) will be subtracted from initial 10000 (= 9010)

        const totalAmount = +productInfo.cost * purchasePayload.amount

        expect(newBuyerDeposit).toEqual(
          parseFloat(initialDeposit - totalAmount)
        )

        //   Seller's income is updated;
        const { body: sellerLogin, headers: sellerHeader } = await Login(
          sellerInfo
        )

        sellerIncome = sellerLogin.data.income || 0

        expect(+sellerIncome).toEqual(totalAmount)

        //   product.amountAvailable is 1;
        const { body: getProduct } = await $fetch()
          .get(`/api/v1/product?id=${productCode}`)
          .set('Cookie', sellerHeader['set-cookie'])

        expect(parseFloat(getProduct.data.amountAvailable)).toEqual(1)
      })
    })
  })
}

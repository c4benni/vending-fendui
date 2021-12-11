/* eslint-disable camelcase */
const { app } = require('../../config/config')
const { Product, User } = require('../../models')
const { sendServerError } = require('../../utils/utils')

module.exports = async function (req, res) {
  const callback = async () => {
    // only logged in users with role == 'seller' can access this route.
    const { id } = req.cookies

    if (!id) {
      return res.status(401).send({
        error: {
          message: 'you need to login first',
          status: 401
        }
      })
      // unauthorized
    }

    const user = await User.findByPk(id, {
      attributes: ['role'],
      raw: true
    })

    if (!user) {
      return res.status(404).send({
        error: {
          message: 'this account may have been deleted',
          status: 404
        }
      })
      // not found
    }

    if (user.role != 'seller') {
      return res.status(401).send({
        error: {
          message: 'only a seller can add a product. Create a seller account?',
          status: 401
        }
      })
      // unauthorized
    }

    // check if product name exist;
    const findProduct = await Product.findOne({
      where: { productName: req.body.productName },
      attributes: ['id'],
      raw: true
    })

    if (findProduct) {
      return res.status(403).send({
        error: {
          message: 'product exists. Choose another name.',
          status: 403
        }
      })
      // forbidden
    }

    // create a new product;
    const product = await Product.create({
      ...req.body,
      sellerId: id,
      background: app.productImages
    })

    const productJSON = product.toJSON()

    delete productJSON.createdAt

    // send success if okay;
    res.send({
      data: {
        message: 'product successfully created!',
        product: productJSON
      }
    })
  }

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

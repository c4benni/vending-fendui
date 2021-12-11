/* eslint-disable camelcase */
const { Product } = require('../../models')
const attempt = require('../../utils/attempt')

// only the user that posted this product can update it;
module.exports = async function (req, res) {
  const mainCallback = async () => {
    // check that user is signed in;
    const { id: userId } = req.cookies

    if (!userId) {
      return res.status(401).send({
        error: {
          message: 'session expired',
          status: 401
        }
      })
      // unauthorized
    }

    const { id: productID } = req.body

    // check that product exists;
    const product = await Product.findByPk(productID)

    if (!product) {
      return res.status(404).send({
        error: {
          message: 'item not found or might have been deleted',
          status: 404
        }
      })
      // not found
    }

    // check that product.sellerId == userId;
    if (product.sellerId !== userId) {
      return res.status(401).send({
        error: {
          message: 'only the owner of this product can update it',
          status: 401
        }
      })
      // unauthorized
    }

    // ensure new productName doesn't exist;
    if (req.body.productName) {
      const existingProductName = await Product.findOne({
        where: { productName: req.body.productName },
        attributes: ['productName']
      })

      if (existingProductName) {
        return res.status(403).send({
          error: {
            message: 'product name is taken. Choose another name',
            status: 403
          }
        })
        // forbidden
      }
    }

    // all checked, can update roles in body,
    // since the policy validates them.
    await product.update(req.body)

    await product.save()

    res.send({
      data: product.toJSON()
    })
  }

  await attempt({
    express: { res },
    callback: mainCallback
  })
}

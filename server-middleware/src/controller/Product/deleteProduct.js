/* eslint-disable camelcase */
const { Product } = require('../../models')
const attempt = require('../../utils/attempt')

async function deleteProductLogic({ req, res, productID, sendMessage }) {
  const mainCallback = async () => {
    // check that user is signed in;
    const { id: userId } = req.cookies

    if (!userId) {
      return (
        sendMessage &&
        res.status(401).send({
          error: {
            message: 'session expired'
          }
        })
        // unauthorized
      )
    }

    // check that product exists;
    const product = await Product.findByPk(productID, {
      attributes: ['sellerId']
    })

    if (!product) {
      return (
        sendMessage &&
        res.status(404).send({
          error: {
            message: 'item not found or might have been deleted',
            status: 404
          }
        })
        // not found
      )
    }

    // check that product.sellerId == userId;
    if (product.sellerId !== userId) {
      return (
        sendMessage &&
        res.status(401).send({
          error: {
            message: 'only the owner of this product can delete it',
            status: 401
          }
        })
        // unauthorized
      )
    }

    // all checked, can delete;
    await product.destroy()

    return sendMessage
      ? res.status(204).send({
          data: {
            message: 'product successfully deleted'
          }
          // no content
        })
      : true
  }

  await attempt({
    express: { res },
    callback: mainCallback
  })
}

module.exports = {
  async deleteProduct(req, res) {
    await deleteProductLogic({
      req,
      res,
      productID: req.query.id,
      sendMessage: true
    })
  },

  async deleteMultipleProducts(req, res) {
    const { ids } = req.body

    let errorCaught = false

    for (const id of ids) {
      const deleteItem = await deleteProductLogic({
        req,
        res,
        productID: id,
        sendMessage: false
      })

      if (deleteItem === false) {
        errorCaught = true
        break
      }
    }

    errorCaught
      ? res.status(500).send({
          error: {
            message: 'an error occured',
            status: 500
          }
        })
      : res.status(204).send({
          data: {
            message: 'item(s) deleted',
            status: 204
          }
        })
    // no content
  }
}

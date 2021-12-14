/* eslint-disable camelcase */
const { Product, sequelize } = require('../../models')
const { sendServerError } = require('../../utils/utils')

async function deleteProductLogic({ req, res, productID, sendResponse }) {
  const callback = async () => {
    // check that user is signed in;
    const { id: userId } = req.cookies

    if (!userId) {
      return (
        sendResponse &&
        res.status(401).send({
          error: {
            message: 'session expired'
          }
        })
        // unauthorized
      )
    }

    try {
      await sequelize.transaction(async function (tx) {
        // check that product exists;
        const product = await Product.findByPk(productID, {
          attributes: ['sellerId', 'id'],
          transaction: tx
        })

        if (!product) {
          if (sendResponse)
            throw new Error('{404} Item not found or might have been deleted')
          // not found
        }

        // check that product.sellerId == userId;
        if (product.sellerId !== userId) {
          if (sendResponse) {
            throw new Error(
              '{401} Only the owner of this product can delete it'
            )
          }
        }

        // all checked, can delete;
        const deleteProduct = await product.destroy({
          transaction: tx
        })

        if (deleteProduct.error && sendResponse) {
          throw new Error('Error deleting product')
        }

        return sendResponse
          ? res.status(200).send({
              data: {
                message: 'product successfully deleted'
              }
              // no content
            })
          : {}
      })
    } catch (err) {
      if (err) {
        const matchStatus = err.message.match(/^\{\d+\}/g)

        // defined error
        if (matchStatus) {
          const status = matchStatus[0].replace(/\{|\}/g, '')

          return res.status(status).send({
            error: {
              message: err.message.replace(/^\{\d+\}\s/, '')
            }
          })
        }

        // conflict error
        return res.status(409).send({
          error: {
            message: err.message,
            trace: err
          }
        })
      }
    }
  }

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

module.exports = {
  async deleteProduct(req, res) {
    await deleteProductLogic({
      req,
      res,
      productID: req.query.id,
      sendResponse: true
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
        sendResponse: false
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

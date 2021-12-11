/* eslint-disable camelcase */
const { Product, sequelize } = require('../../models')
const { sendServerError } = require('../../utils/utils')

// only the user that posted this product can update it;
module.exports = async function (req, res) {
  const callback = async () => {
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

    // transaction
    try {
      await sequelize.transaction(async function (tx) {
        const { id: productID } = req.body

        // check that product exists;
        const product = await Product.findByPk(productID, { transaction: tx })

        if (!product) {
          throw new Error('{404} Item not found or might have been deleted')
        }

        // check that product.sellerId == userId;
        if (product.sellerId !== userId) {
          throw new Error('{401} Only the owner of this product can update it')
          // unauthorized
        }

        // ensure new productName doesn't exist;
        if (req.body.productName) {
          const existingProductName = await Product.findOne({
            where: { productName: req.body.productName },
            attributes: ['productName'],
            transaction: tx
          })

          if (existingProductName) {
            throw new Error('{403} Product name is taken. Choose another name')
            // forbidden
          }
        }

        // all checked, can update roles in body,
        // since the policy validates them.
        const updateProduct = await product.update(req.body, {
          transaction: tx
        })

        if (updateProduct.error) {
          throw new Error('Error updating product')
        }

        const saveUpdate = await product.save({
          transaction: tx
        })

        if (saveUpdate.error) {
          throw new Error('Error saving update')
        }
        res.send({
          data: product.toJSON()
        })

        return 1
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
            message: err.message
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

/* eslint-disable camelcase */
const { Product, User } = require('../../models')
const { signUserFromCookie } = require('../../utils/sessions')
const { sendServerError } = require('../../utils/utils')

module.exports = async function (req, res) {
  const callback = async () => {
    // anyone can view this
    const { id } = req.query

    // still renew signed in users.
    await signUserFromCookie(req, res)

    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).send({
        error: {
          message: 'product not found or might have been deleted',
          status: 404
        }
      })
      // not found
    }

    // send filtered result;
    const disAllowedFields = ['updatedAt']

    const productJSON = product.toJSON()

    const sellerUser = await User.findByPk(productJSON.sellerId, {
      attributes: ['username'],
      raw: true
    })

    const sellerInfo = {}

    if (sellerUser) {
      sellerInfo.username = sellerUser.username
    } else {
      sellerInfo.error = {
        message: 'this user has been deleted'
      }
    }

    const data = {
      ...productJSON,
      sellerInfo
    }

    disAllowedFields.forEach((field) => {
      delete data[field]
    })

    return res.send({
      data
    })
  }

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

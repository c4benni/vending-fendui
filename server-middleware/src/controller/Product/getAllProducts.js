/* eslint-disable camelcase */
const { Product } = require('../../models')
const { signUserFromCookie } = require('../../utils/sessions')
const { sendServerError } = require('../../utils/utils')

module.exports = async function (req, res) {
  const callback = async () => {
    const { limit, where = '{}', offset } = req.query

    const getWhere = typeof where == 'object' ? JSON.stringify(where) : where

    const findProducts = await Product.findAll({
      where: JSON.parse(getWhere),
      limit,
      offset,
      raw: true
    })

    if (!findProducts.length) {
      return res.status(404).send({
        error: {
          message: 'no product(s) found',
          status: 404
        }
      })
      // not found
    } else {
      await signUserFromCookie(req, res)

      res.send({
        data: findProducts.map((x) => {
          const {
            id,
            sellerId,
            productName,
            cost,
            amountAvailable,
            type,
            background,
            rating,
            caption,
            ownerDeleted
          } = x

          return {
            id,
            sellerId,
            productName,
            cost,
            amountAvailable,
            type,
            background,
            rating,
            caption,
            ownerDeleted
          }
        }),
        length: findProducts.length
      })
    }
  }

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

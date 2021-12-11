/* eslint-disable camelcase */
const { Product } = require('../../models')
const attempt = require('../../utils/attempt')
const { signUserFromCookie } = require('../../utils/sessions')

module.exports = async function (req, res) {
  const mainCallback = async () => {
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

  await attempt({
    express: { res },
    callback: mainCallback
  })
}

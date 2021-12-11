const { User } = require('../../../models')
const attempt = require('../../../utils/attempt')
const { clearCookies } = require('../../../utils/utils')
const { Product } = require('../../../models')

module.exports = async function (req, res) {
  const mainCallback = async () => {
    const { id } = req.cookies

    if (!id) {
      return res.status(401).send({
        message: 'session expired',
        status: 401
        // unauthorized
      })
    }

    const { password } = req.body

    const findUser = await User.findByPk(id)

    if (!findUser) {
      return res.status(404).send({
        message: 'user not found',
        status: 404
        // not found
      })
    } else {
      const matchPassword = await findUser.matchPassword(password)

      if (!matchPassword) {
        return res.status(404).send({
          message: 'incorrect password',
          status: 404
          // not found
        })
      }

      const updateSellerProduct = async () => {
        if (!findUser.isSeller) {
          return
        }

        await Product.update(
          {
            ownerDeleted: true
          },
          {
            where: {
              sellerId: findUser.id
            }
          }
        )
      }

      await updateSellerProduct()

      const remove = await findUser.destroy()

      if (remove.error) {
        throw remove.error
      }

      clearCookies(res)

      return res.send(res, {
        data: {
          message: 'user deleted'
        },
        status: 200
      })
    }
  }

  await attempt({
    express: { res },
    callback: mainCallback
  })
}

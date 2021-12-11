const { User, sequelize } = require('../../../models')
const { clearCookies, sendServerError } = require('../../../utils/utils')
const { Product } = require('../../../models')

module.exports = async function (req, res) {
  const callback = async () => {
    const { id } = req.cookies

    if (!id) {
      return res.status(401).send({
        message: 'session expired',
        status: 401
        // unauthorized
      })
    }

    // transaction
    try {
      await sequelize.transaction(async function (tx) {
        const { password } = req.body

        const findUser = await User.findByPk(id, { transaction: tx })

        if (!findUser) {
          throw new Error('{404} User not found')
        } else {
          const matchPassword = await findUser.matchPassword(password)

          if (!matchPassword) {
            throw new Error('{401} Incorrect password')
          }

          const updateSellerProduct = async () => {
            if (!findUser.isSeller) {
              return
            }

            const updateProduct = await Product.update(
              {
                ownerDeleted: true
              },
              {
                where: {
                  sellerId: findUser.id
                },
                transaction: tx
              }
            )

            if (updateProduct) {
              return {
                error: `Error updating seller's product`
              }
            }
          }

          const updateProduct = await updateSellerProduct()

          if (updateProduct.error) {
            throw new Error(updateProduct.error)
          }

          const remove = await findUser.destroy({ transaction: tx })

          if (remove.error) {
            throw new Error('Error deleting user')
          }

          clearCookies(res)
        }

        return {}
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

    return res.send(res, {
      data: {
        message: 'user deleted'
      },
      status: 200
    })
  }

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

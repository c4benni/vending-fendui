const { sequelize } = require('../../models')

const { signedInRole, sendServerError } = require('../../utils/utils')

module.exports = async function (req, res) {
  const callback = async () => {
    const { data: user, error } = await signedInRole({
      req,
      role: 'buyer',
      invalidRole: 'only a buyer can reset deposit',
      res
    })

    if (error) {
      return res.status(error.status).send({ error })
    }

    try {
      await sequelize.transaction(async function (tx) {
        const updateUser = await user.update(
          {
            deposit: 0
          },
          { transaction: tx }
        )

        if (updateUser.error) {
          throw new Error('Error updating user')
        }

        const saveUpdate = await user.save({
          fields: ['deposit'],
          transaction: tx
        })

        if (saveUpdate.error) {
          throw new Error('Error saving update')
        }
      })
    } catch (err) {
      if (err) {
        // conflict error
        return res.status(409).send({
          error: {
            message: err.message
          }
        })
      }
    }

    res.send({
      data: {
        message: 'reset successful',
        deposit: user.deposit
      }
    })
  }

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

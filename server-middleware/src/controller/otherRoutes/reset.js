const attempt = require('../../utils/attempt')
const { signedInRole } = require('../../utils/utils')

module.exports = async function (req, res) {
  const mainCallback = async () => {
    const { data: user, error } = await signedInRole({
      req,
      role: 'buyer',
      invalidRole: 'only a buyer can reset deposit',
      res
    })

    if (error) {
      return res.status(error.status).send({ error })
    }

    await user.update({
      deposit: 0
    })

    await user.save({
      fields: ['deposit']
    })

    res.send({
      data: {
        message: 'reset successful',
        deposit: user.deposit
      }
    })
  }

  await attempt({
    express: { res },
    callback: mainCallback
  })
}

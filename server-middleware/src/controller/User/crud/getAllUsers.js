const { User } = require('../../../models')
const attempt = require('../../../utils/attempt')
const { signUserFromCookie } = require('../../../utils/sessions')

module.exports = async function (req, res) {
  const mainCallback = async () => {
    const { limit, where = {}, offset } = req.query

    const findUsers = await User.findAll({
      ...where,
      limit,
      offset,
      raw: true
    })

    if (!findUsers.length) {
      return res.status(404).send({
        message: 'no user found',
        status: 404
        // not found
      })
    } else {
      const data = []

      findUsers.forEach((user) => {
        const { id, username, role, createdAt, image } = user

        data.push({
          id,
          username,
          role,
          createdAt,
          image
        })
      })

      await signUserFromCookie(req, res)

      res.send({
        data,
        length: data.length
      })
    }
  }

  await attempt({
    express: { res },
    callback: mainCallback
  })
}

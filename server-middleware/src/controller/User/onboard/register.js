const attempt = require('../../../utils/attempt')
const { app } = require('../../../config/config')
const { User } = require('../../../models')

module.exports = async function (req, res) {
  const mainCallback = async () => {
    const { username, password, role } = req.body
    // check that user doesnt exist.
    const findUser = await User.findOne({
      where: { username },
      attributes: ['id'],
      raw: true
    })

    if (findUser) {
      return res.status(403).send({
        error: {
          message: 'user exist',
          status: 403
        }
      })
      // forbidden
    }

    const getRole = role.toLowerCase()

    let deposit = null

    let income = null

    if (getRole == 'buyer') {
      deposit = 0
    } else {
      income = 0
    }

    // create a new user;
    const user = await User.create({
      username,
      password,
      role: getRole,
      deposit,
      income,
      image: app.userImages
    })

    // send success if okay;
    res.status(201).send({
      data: {
        message: 'account successfully created. Login',
        id: user.id
      }
    })
  }

  await attempt({
    express: { res },
    callback: mainCallback
  })
}

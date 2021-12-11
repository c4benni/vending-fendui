const { app } = require('../../../config/config')
const { User, sequelize } = require('../../../models')
const { sendServerError } = require('../../../utils/utils')

module.exports = async function (req, res) {
  const callback = async () => {
    let newUser

    try {
      await sequelize.transaction(async function (tx) {
        const { username, password, role } = req.body

        // check that user doesnt exist.
        const findUser = await User.findOne(
          {
            where: { username },
            attributes: ['id'],
            raw: true
          },
          { transaction: tx }
        )

        if (findUser) {
          throw new Error('{403} Username taken!')
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
        newUser = await User.create(
          {
            username,
            password,
            role: getRole,
            deposit,
            income,
            image: app.userImages
          },
          { transaction: tx }
        )

        if (newUser.error) {
          throw new Error('Error creating user')
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

    // send success if okay;
    res.status(201).send({
      data: {
        message: 'account successfully created. Login',
        id: newUser.id
      }
    })
  }

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

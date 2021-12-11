const { User } = require('../../../models')
const { signUserFromCookie } = require('../../../utils/sessions')
const { unwantedUserFields, sendServerError } = require('../../../utils/utils')

module.exports = async function (req, res) {
  const callback = async () => {
    const { id, self } = req.query

    const findUser = await User.findByPk(id)

    if (!findUser) {
      return res.status(404).send({
        message: 'user not found',
        status: 404
        // not found
      })
    } else {
      // check that self query is passed only for signed in users;
      if (self) {
        const { id } = req.cookies

        const isSignedIn = await findUser.isSignedIn({ id })

        if (!isSignedIn) {
          return res.status(401).send({
            message: 'only signed in users can use the self option',
            status: 401
          })
        }
      }

      const { id, username, role, createdAt, image, header, bio, displayName } =
        findUser

      const data = self
        ? {
            ...findUser.toJSON()
          }
        : {
            id,
            username,
            role,
            createdAt,
            image,
            header,
            bio,
            displayName
          }

      const unwantedFields = unwantedUserFields(findUser)

      unwantedFields.forEach((field) => {
        delete data[field]
      })

      // sign user from cookie cos this route isn't required to be verified;
      await signUserFromCookie(req, res)

      res.status(200).send({ data, status: 200 })
    }
  }

  try {
    await callback()
  } catch (e) {
    sendServerError(res, e)
  }
}

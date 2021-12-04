const cloudinary = require('../../utils/cloudinary')
const attempt = require('../../utils/attempt')
const { signedInRole } = require('../../utils/utils')

module.exports = {
  async getMedia(req, res) {
    const mainCallback = async () => {
      await attempt({
        express: { res },
        callback: async () => {
          const { data: user, error } = await signedInRole({
            req,
            res
          })

          if (error) {
            return res.status(error.status).send({
              error
            })
          }

          // all checked;
          const img = cloudinary.image(
            'vendingApp/vector/pixeltrue-error-1_hdvys7.png',
            {
              secure: true,
              transformation: [
                { width: 150, height: 150, gravity: 'face', crop: 'thumb' },
                { radius: 20 },
                { effect: 'sepia' },
                {
                  overlay: 'cloudinary_icon_blue',
                  gravity: 'south_east',
                  x: 5,
                  y: 5,
                  width: 50,
                  opacity: 60,
                  effect: 'brightness:200'
                },
                { angle: 10 }
              ]
            }
          )

          res.send({ img, user })
        },
        errorMessage: (err) => ({
          message: err.message,
          status: 403
        })
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  }
}

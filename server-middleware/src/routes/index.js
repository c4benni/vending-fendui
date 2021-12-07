const { Router } = require('express')

const router = Router()

const session = require('../utils/sessions')

const { signedInRole, unwantedUserFields } = require('../utils/utils')
const User = require('./User')
const Product = require('./Products')
const Media = require('./client/media')

const routes = [...User, ...Product, ...Media]

routes.forEach((route) => {
  const method = route.method
  const url = route.url
  const middleWare = [route.middleWare].flat()

  const sessionVerification = []

  const publicUserRoutes =
    method == 'post' && /^\/user\/(?=login|register$)/.test(url)

  const publicProductRoutes =
    method == 'get' && /^\/product\/?$|^\/product\/all$/.test(url)

  const authenticate = !publicUserRoutes && !publicProductRoutes

  if (authenticate) {
    sessionVerification.push(session.verify)
  }

  const callbacks = [sessionVerification, middleWare, route.callback]

  router[method](url, callbacks)
})

// router.get('/build', async (req, res) => {
//   // organize images;

//   const favIco = await mediaTable.findOne({
//     where: {
//       title: 'icons8-vending-machine-96'
//     },
//     attributes: ['url']
//   })

//   const registerImg = await mediaTable.findOne({
//     where: {
//       title: 'bermuda-profitable-growth'
//     },
//     attributes: ['url']
//   })

//   const loginImg = await mediaTable.findOne({
//     where: {
//       title: 'sammy-woman-financial-analyst'
//     },
//     attributes: ['url']
//   })

//   const notFound = await mediaTable.findAll({
//     where: {
//       [Op.or]: [
//         {
//           [Op.like]: '%jaconda-17%'
//         },
//         {
//           [Op.like]: '%bermuda-page-not-found%'
//         },
//         {
//           [Op.like]: '%pixeltrue-error-1%'
//         }
//       ]
//     },
//     attributes: ['url']
//   })

//   const noConnection = await mediaTable.findOne({
//     where: {
//       [Op.like]: '%urban-677%'
//     },
//     attributes: ['url']
//   })

//   const media = {
//     favIco,
//     registerImg,
//     loginImg,
//     notFound,
//     noConnection
//   }

//   res.send(media)
// })

router.get('/auth', async (req, res) => {
  const { data, error } = await signedInRole({ req, res })

  if (error) {
    return res.send({ error })
  }

  await session.signUser(data.id, res, req)

  const unwanted = unwantedUserFields(data)

  unwanted.forEach((path) => delete data[path])

  res.send({
    data
  })
})

module.exports = router

const app = require('express')()

const bodyParser = require('body-parser')

const cors = require('cors')

const morgan = require('morgan')

const cookieParser = require('cookie-parser')

const cloudinary = require('cloudinary').v2

const { sequelize: DB } = require('./models')

const routes = require('./routes/index')

app.use([morgan('combined'), bodyParser.json(), cors(), cookieParser(), routes])

DB.authenticate().then(() => {
  DB.sync({
    force: /test/i.test(process.env.NODE_ENV)
  })
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = app

const app = require('express')()

const fileUpload = require('express-fileupload')

const bodyParser = require('body-parser')

const cors = require('cors')

const morgan = require('morgan')

const cookieParser = require('cookie-parser')

const cloudinary = require('cloudinary').v2

const { sequelize: DB } = require('./models')

const routes = require('./routes/index')

app.use([
  fileUpload(),
  morgan('combined'),
  bodyParser.json(),
  cors(),
  cookieParser(),
  routes
])

if (!DB.DB_STARTED) {
  DB.sync({})

  DB.DB_STARTED = true
}

cloudinary.config({
  cloud_name: 'c4benn',
  api_key: '336555747421799',
  api_secret: '0TtMTNIreV2Ljo7S1Binntv8dc0'
})

module.exports = app

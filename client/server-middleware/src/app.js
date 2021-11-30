const app = require('express')()

const bodyParser = require('body-parser')

const cors = require('cors')

const morgan = require('morgan')

const cookieParser = require('cookie-parser')

const { sequelize: DB } = require('./models')

// const config = require('./config/config')

const routes = require('./routes/index')

app.use([morgan('combined'), bodyParser.json(), cors(), cookieParser(), routes])

if (!DB.DB_STARTED) {
  DB.sync({})

  DB.DB_STARTED = true
}

module.exports = app

const app = require('express')()

const bodyParser = require('body-parser')

const cors = require('cors')

const morgan = require('morgan')

const cookieParser = require('cookie-parser')

const { sequelize: DB } = require('./models')

const routes = require('./routes/index')

const corsOptions = {
  credentials: true,
  origin: ['*']
}

app.use([
  cors(corsOptions),
  morgan('combined'),
  bodyParser.json(),
  cookieParser(),
  routes
])

DB.authenticate().then(() => {
  DB.sync({
    force: /test/i.test(process.env.NODE_ENV)
  })
})

module.exports = app

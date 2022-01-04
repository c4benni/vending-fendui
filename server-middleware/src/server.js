const app = require('express')()

const bodyParser = require('body-parser')

const cors = require('cors')

const morgan = require('morgan')

const cookieParser = require('cookie-parser')

const { isTesting } = require('../../utils/main')

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
DB.sync({ force: isTesting })

})

module.exports = app

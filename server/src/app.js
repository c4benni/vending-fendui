const app = require('express')()

const bodyParser = require('body-parser')

const cors = require('cors')

const morgan = require('morgan')

const { sequelize: DB } = require('./models')

const cookieParser = require('cookie-parser')

const config = require('./config/config')


const routes = require('./routes/index')

app.use([
    morgan('combined'),
    bodyParser.json(),
    cors(),
    cookieParser(),
    routes
])

DB.sync({}).then(() => {    
    app.listen(config.port, () => {
        console.log('server started');
    })
})


module.exports = app
const express = require('express')

const bodyParser = require('body-parser')

const cors = require('cors')

const morgan = require('morgan')

const { sequelize } = require('./models')

const config = require('./config/config')

const app = express();

const routes = require('./routes')

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.use(routes)

sequelize.sync({}).then(() => {    
    app.listen(config.port, () => {
        console.log('server started');
    })
})

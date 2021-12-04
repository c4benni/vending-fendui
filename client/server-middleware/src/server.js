const app = require('express')()

const bodyParser = require('body-parser')

const cors = require('cors')

const morgan = require('morgan')

const cookieParser = require('cookie-parser')

const cloudinary = require('cloudinary').v2

const { sequelize: DB } = require('./models')

const routes = require('./routes/index')

app.use([morgan('combined'), bodyParser.json(), cors(), cookieParser(), routes])

if (!DB.DB_STARTED) {
  DB.sync({ force: true })

  DB.DB_STARTED = true
}

cloudinary.config({
  cloud_name: 'c4benn',
  api_key: '336555747421799',
  api_secret: '0TtMTNIreV2Ljo7S1Binntv8dc0'
})

// add media remove on prod;
app.get('/check', async (req, res) => {
  const d = await cloudinary.search.expression('folder:vendingApp/*').execute()

  // for (const r of d.resources) {
  //   await Media.create({
  //     url: r.url,
  //     public_id: r.public_id,
  //     title: r.display_name
  //   })
  // }

  res.send(d)
})

module.exports = app

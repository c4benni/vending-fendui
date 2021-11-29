const { createSSRApp } = require('vue')

const { renderToString } = require('@vue/server-renderer')

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


app.get('*', async (req, res) => {
  const app = createSSRApp({
    data() {
      return {
        user: 'John Doe'
      }
    },
    template: `<div>Current user is: {{ user }}</div>`
  })

  const appContent = await renderToString(app)
  const html = `
  <html>
    <body>
      <h1>My First Heading</h1>
      <div id="app">${appContent}</div>
    </body>
  </html>
  `

  res.end(html)
})

DB.sync({}).then(() => {    
    app.listen(config.port, () => {
        console.log('server started');
    })
})

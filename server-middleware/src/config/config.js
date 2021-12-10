require('dotenv').config('../../../.env')

module.exports = {
  base: '/api/v1',
  port: process.env.PORT || 1001,
  db: {
    database: process.env.DB_NAME,

    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    options: {
      dialect: process.env.DIALECT || 'postgres',
      host: process.env.HOST || 'localhost',
      storage: './vending.sql'
    }
  },

  app: {
    get productImages() {
      const food = '/samples/food'
      const ecommerce = '/samples/ecommerce'
      const landscape = '/samples/landscapes'

      const output = [
        `${food}/spices`,
        `${food}/pot-mussels`,
        `${food}/fish-vegetables`,
        `${food}/dessert`,
        `${ecommerce}/accessories-bag`,
        `${ecommerce}/leather-bag-gray`,
        `${ecommerce}/car-interior-design`,
        `${ecommerce}/shoes`,
        `${ecommerce}/analog-classic`,
        `${landscape}/landscape-panorama`,
        `${landscape}/nature-mountains`,
        `${landscape}/beach-boat`,
        `${landscape}/architecture-signs`
      ]

      return output[Math.floor(Math.random() * (output.length - 1))]
    },
    get userImages() {
      const path = '/samples/people'

      const output = [
        `${path}/bicycle`,
        `${path}/jazz`,
        `${path}/boy-snow-hoodie`,
        `${path}/smiling-man`,
        `${path}/kitchen-bar`
      ]

      return output[Math.floor(Math.random() * (output.length - 1))]
    },
    validCost: [5, 10, 20, 50, 100],
    validProductTypes: [
      'creativity',
      'education',
      'entertainment',
      'games',
      'generic',
      'health & fitness',
      'shopping & food',
      'social',
      'travel',
      'utilities'
    ],
    saltRounds: 10,
    // ms * s * min
    sessionMaxTime: 1000 * 60 * 60
  }
}

module.exports = {
  base: '/api/v1',
  port: process.env.PORT || 1001,
  db: {
    database:
      process.env.NODE_ENV == 'test'
        ? 'test_db'
        : process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'Fendui',
    options: {
      dialect: process.env.DIALECT || 'postgres',
      host: process.env.HOST || 'localhost',
      storage: './vending.sql'
    }
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
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
        `${food}/desert`,
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

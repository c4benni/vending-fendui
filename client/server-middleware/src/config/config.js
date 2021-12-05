module.exports = {
  base: '/api/v1',
  port: process.env.PORT || 1001,
  db: {
    database: process.env.DB_NAME || 'postgres',
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
    // ms * s * min * hr
    sessionMaxTime: 1000 * 60 * 10
  }
}

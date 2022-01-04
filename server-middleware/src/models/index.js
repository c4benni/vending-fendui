const fs = require('fs')

const path = require('path')

const { Sequelize, DataTypes } = require('sequelize')

const { db: dbConfig } = require('../config/config')

const { isProduction } = require('../../../utils/main')


// database instance
const DB = {}

// new Sequelize instance

let sequelize;

if (isProduction) {
const ssl = {
  required: true,
  rejectUnauthorized: false
}

sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl
  },
  ssl
})

} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    dbConfig.options
  )
}

// auto import models and add them to DB{}
fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js')
  .forEach((file) => {
    // import and initialize models;
    const model = require(path.join(__dirname, file))(sequelize, DataTypes)

    // add to DB{}
    DB[model.name] = model
  })

// add the instance above to DB{}
DB.sequelize = sequelize

// add the Sequelize class to DB{}
DB.Sequelize = Sequelize

module.exports = DB

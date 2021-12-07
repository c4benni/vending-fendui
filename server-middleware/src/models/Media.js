/* eslint-disable require-await */
// create product model;
// should have sellerId varchar(99) primary key, amountAvailable bigint, cost bigInt, & productName varchar(99);

// const { app } = require('../config/config')

const { id: generateId } = require('../utils/generate')

module.exports = (sequelize, dataTypes) => {
  const Media = sequelize.define('Media', {
    id: {
      type: dataTypes.STRING(99),
      defaultValue: () => generateId('m-'),
      primaryKey: true,
      unique: true
    },
    url: {
      type: dataTypes.STRING(999),
      allowNull: false,
      unique: true
    },
    public_id: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true
    }
  })

  return Media
}

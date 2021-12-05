/* eslint-disable require-await */
// create product model;
// should have sellerId varchar(99) primary key, amountAvailable bigint, cost bigInt, & productName varchar(99);

// we need just the api for admin calls;
// const { api: cloudinary } = require('cloudinary').v2

const { app } = require('../config/config')

const { id: generateId } = require('../utils/generate')

// async function beforeCreate(product) {
//   const { id } = product

//   const { success } = await cloudinary.create_folder(
//     `/vendingApp/Product/${id}`,
//     {
//       unsigned: true
//     }
//   )

//   await product.setDataValue('folderCreated', success)
// }

// async function beforeDestroy(product) {
//   if (this.folderCreated) {
//     const { id } = product
//     await cloudinary.delete_folder(`/vendingApp/Product/${id}`)
//   }
// }

module.exports = (sequelize, dataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: dataTypes.STRING(99),
        defaultValue: () => generateId(),
        primaryKey: true,
        unique: true
      },
      sellerId: {
        type: dataTypes.STRING(99),
        allowNull: false
      },
      productName: {
        type: dataTypes.STRING(99),
        allowNull: false,
        unique: true,
        required: true
      },
      amountAvailable: {
        type: dataTypes.BIGINT,
        allowNull: false
      },
      cost: {
        type: dataTypes.BIGINT,
        allowNull: false
      },
      background: {
        type: dataTypes.STRING(255),
        allowNull: true
      },
      slideShow: {
        type: dataTypes.ARRAY(dataTypes.STRING(255)),
        allowNull: true
      },
      caption: {
        type: dataTypes.STRING(255),
        allowNull: true
      },
      description: {
        type: dataTypes.TEXT,
        allowNull: true
      },
      rating: {
        type: dataTypes.DECIMAL(5, 2),
        allowNull: true
      },
      type: {
        type: dataTypes.STRING(99),
        allowNull: true,
        defaultValue: 'generic'
      },
      ownerDeleted: {
        type: dataTypes.BOOLEAN,
        defaultValue: false
      },
      folderCreated: {
        type: dataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['id']
        }
      ]

      // hooks: {
      //   beforeCreate,
      //   beforeDestroy
      // }
    }
  )

  Product.prototype.confirmCost = async function (cost) {
    return app.validCost.includes(cost)
  }

  return Product
}

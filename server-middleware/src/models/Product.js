const { id: generateId } = require('../utils/generate')

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
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['id']
        }
      ]
    }
  )

  return Product
}

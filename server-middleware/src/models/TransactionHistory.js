const generate = require('../utils/generate')

module.exports = (sequelize, dataTypes) => {
  const TransactionHistory = sequelize.define(
    'TransactionHistory',
    {
      id: {
        type: dataTypes.STRING(99),
        allowNull: false,
        primaryKey: true,
        defaultValue: () => generate.id('tx-')
      },
      userId: {
        type: dataTypes.STRING(99),
        allowNull: false
      },
      timestamp: {
        type: dataTypes.BIGINT,
        defaultValue: () => Date.now(),
        allowNull: false
      },
      type: {
        type: dataTypes.STRING,
        defaultValue: () => Date.now(),
        allowNull: false,
        validate: {
          is: /^(deposit|purchase|reset)$/
        }
      },
      amount: {
        type: dataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^(¢|\$)/
        }
      },
      quantity: {
        type: dataTypes.BIGINT,
        allowNull: true
      }
    },
    {
      timestamps: false,
      indexes: [
        {
          unique: false,
          fields: ['userId']
        }
      ]
    }
  )

  return TransactionHistory
}


// create product model;
// should have sellerId uuid primary key, amountAvailable bigint, cost bigInt, & productName varchar(99);

const { app } = require("../config/config");

function generateId() {
    return `p-${Date.now().toString(36)}`.replace(/\./g,'-')
}

module.exports = (sequelize, dataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: dataTypes.STRING(99),
            defaultValue: generateId(),
            primaryKey: true,
            unique: true
        },
        sellerId: {
            type: dataTypes.STRING(99),
            allowNull: false
        },
        productName: {
            type: dataTypes.STRING(999),
            allowNull: false,
            unique: true,
            required: true
        },
        amountAvailable: {
            type: dataTypes.BIGINT,
            allowNull: false
        },
        cost: {
            type: dataTypes.BIGINT(3),
            allowNull: false
        }
    })

    Product.prototype.confirmCost = async function (cost) {
            
        return app.validCost.includes(cost);
    }

    return Product;
}
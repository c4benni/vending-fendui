const { id: generateId } = require('../utils/generate')

const bcrypt = require('bcrypt');
const { app } = require('../config/config');

async function hashPassword(user) {
    
    if (!user.changed('password')) {
        return;
    }
        
    const hash = await bcrypt.hash(user.password, app.saltRounds)
    
    await user.setDataValue('password', hash)

    console.log(user);

    return user
}

// define a User model;
module.exports = (sequelize, dataTypes) => {
    const User = sequelize
        .define (
            'User',
            {
                id: {
                    type: dataTypes.STRING(99),
                    defaultValue: () => generateId('u-'),
                    primaryKey: true,
                    unique: true
                },      
                username: {
                    type: dataTypes.STRING(20),
                    unique: true,
                    allowNull: false
                },
                password: {
                    type: dataTypes.STRING,
                    allowNull: false
                },
                deposit: {
                    type: dataTypes.BIGINT,
                    allowNull: true
                },
                role: {
                    type: dataTypes.STRING(6),
                    allowNull: false
                },
                // sessions: {
                    
                // }
            },
            {
                hooks: {
                    beforeSave: hashPassword
                }
            }
        )    
    
    User.prototype.matchPassword = async function (password) {

        const hash = this.password

        console.log({hash,password});
        
        const match = await bcrypt.compare(password, hash)
        
        return match;
    }
    

    User.prototype.hashPassword = async function (password) {
        const hash = await bcrypt.hash(password, app.saltRounds)
        
        return hash
    }

    return User
}
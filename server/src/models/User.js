const { id: generateId } = require('../utils/generate')

const bcrypt = require('bcrypt');
const { app, auth } = require('../config/config');
const { verify: jwtVerify } = require('jsonwebtoken');

async function hashPassword(user) {
    
    if (!user.changed('password')) {
        return;
    }
        
    const hash = await bcrypt.hash(user.password, app.saltRounds)
    
    await user.setDataValue('password', hash)

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
                sessions: {
                    type: dataTypes.ARRAY(dataTypes.TEXT),
                    allowNull: true,
                    defaultValue: []
                },

                displayName: {
                    type: dataTypes.STRING(99),
                    allowNull: true
                },
                image: {
                    type: dataTypes.STRING(99),
                    allowNull: true
                },
                header: {
                    type: dataTypes.STRING(99),
                    allowNull: true
                },
                bio: {
                    type: dataTypes.TEXT,
                    allowNull: true
                }
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

    // this function generates a new active session, 
    // then returns if (jwt) is found;
    User.prototype.isSignedIn = async function (jwt) {
        if (!jwt) {
            return {
                sessions: []
            }
        }

        const activeSessions = [
            ...(this.sessions || [])
        ].filter(session => session && jwtVerify(session, auth.jwtSecret));

        return {
            active: this.sessions.includes(jwt),
            sessions: activeSessions
        }
    }

    // remove session(s) from user - logout;
    User.prototype.logout = async function ({ jwt, all, notCurrent }) {
        const sessions = this.sessions;

        await this.setDataValue(
            'sessions',
            all ?
                [
                    notCurrent ? jwt : null
                ].filter(Boolean)
            : sessions.filter(session => session != jwt)
        )

        return this
    }

    return User
}
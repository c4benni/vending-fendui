const bcrypt = require('bcrypt')

function hashPassword(user,) {
    const SALT_FACTOR = 12;

    if (!user.changed('password')) {
        return;
    }

    return bcrypt
        .genSalt(SALT_FACTOR)
        .then(salt => bcrypt.hashSync(user.password, salt, null))
        .then(hash => {
            user.setDataValue('password', hash)
    })
}

// define a User model;

module.exports = (sequelize, DataTypes) => {
  const User =  sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            unique:true,
        },
        password: DataTypes.STRING,
        deposit: DataTypes.BIGINT,
        role: DataTypes.BOOLEAN
  }, {
      hooks: {
          beforeCreate: hashPassword,
          beforeUpdate:hashPassword,
          beforeSave:hashPassword          
      }
  })
    
    
    User.prototype.comparePassword = async function (password) {
        
        const decode = await bcrypt.compare(password, this.dataValues.password)
    
        return decode;
    }
    
    return User
}
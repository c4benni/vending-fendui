const { app } = require("../config/config")

module.exports = function (Joi) {
    return {
        user: {
            id: Joi
                .string()
                .min(5)
                .max(99)
                .pattern(
                    new RegExp(
                        '^u-.+\\d{2,2}-\\d{2,2}$'
                    )
            ),
            
            username: Joi
                .string()
                .min(3)
                .max(20)
                .pattern (
                    new RegExp(
                        '^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$'
                    )
            ),
                    
            password: Joi
                .string()
                .min(6)
                .max(32)
                .pattern (
                    new RegExp(
                        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,32}$'
                    )
            ),

            role: Joi
                .string()
                .valid(
                    'buyer', 'seller'
            )
        },
        deposit: Joi
            .number()
            .valid(...app.validCost),
        
        get changePassword() {
            return Joi.object({
                old: this.user.password.required(),
                new: this.user.password.required()
            })
        }
    }
}
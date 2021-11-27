const { app } = require("../config/config")

module.exports = function (Joi) {
    const links = Joi
        .string()
        .min(10)
        .uri();
    
    const deposit = Joi
        .number()
        .integer()
        .valid(...app.validCost);
    
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

            displayName: Joi
                .string()
                .min(1)
                .max(99)
                .pattern (
                    new RegExp(
                        '^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$'
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

        deposit,
        
        get changePassword() {
            const password = this.user.password.required()
            return Joi.object({
                old: password,
                new: password
            })
        },
        links,
        text: Joi
            .string()
            .min(1),

        product: {
            amountAvailable: Joi
                .number()
                .min(1)
                .max(1000),
            cost: deposit,
            productName: Joi
                .string()
                .min(3)
                .max(255),
            sellerId: Joi
                .string()
                .min(5)
                .max(99)
                .pattern(
                    new RegExp(
                        '^u-.+\\d{2,2}-\\d{2,2}$'
                    )
            ),
             slideShow: Joi
                .array()
                .items(
                    links
            ),
            caption: Joi
                .string()
                .min(10)
                .max(99),
            rating: Joi
                .number()
                .min(0.5)
                .max(5),
            type: Joi
                .string()
                .valid(
                    ...app.validProductTypes
                )
        }
    }
}
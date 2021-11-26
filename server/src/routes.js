const policies = require('./policies/crud');
const crud = require('./controller/crud')

const base = '/api/v1'

module.exports = function (app) {
    
    app.get(`${base}/product`,
        policies.getProduct,
        crud.getProduct
    );

    app.post(`${base}/product`,
        policies.addProduct,
        crud.addProduct
    )
}
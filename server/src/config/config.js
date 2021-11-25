module.exports = {
    port: process.env.PORT|| 8081,
    db: {
        database: process.env.DB_NAME || 'vending',
        user: process.env.DB_USER||'vending',
        password:process.env.DB_PASS||'vending',
        options: {
            dialect: process.env.DIALECT || 'sqlite',
            host:process.env.HOST||'localhost',
            storage:'./vending.sqlite'
        },
    },
    auth: {
        jwtSecret:process.env.JWT_SECRET||'secret'
    }
}
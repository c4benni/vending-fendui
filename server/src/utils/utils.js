module.exports = {
    clearCookies(res) {
        res?.cookie?.('jwt', null, { maxAge: 0 })
            
        res?.cookie?.('id', null, {maxAge: 0})
    }
}
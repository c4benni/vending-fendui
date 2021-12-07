module.exports = {
    withStatus(res, {message, status}) {
        return res.status(status).send({
            error: { status, message }
        })
    },
    plain(res, { message }) {
        return res.send({
            error: { message }
        })
    }
}
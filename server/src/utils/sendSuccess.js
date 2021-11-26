module.exports = {
    withStatus(res, {data, status}) {
        return res.status(status).send({
            data: { status, data }
        })
    }
}
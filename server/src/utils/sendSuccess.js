module.exports = {
    withStatus(res, {data, status}) {
        return res.status(status).send({
            data: { status, data }
        })
    },
    plain(res, { data, status }) {
        return res.send({
            data: { status, data }
        })
    }
}
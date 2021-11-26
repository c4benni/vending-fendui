const sendError = require("./sendError");

const defaultError = {
    message: 'Oops! An error occured. Try again.',
    status: 500
}

module.exports = function (
    express = {},
    callback = () => { },
    error = () => (defaultError)
) {
    const { res } = express;

    return new Promise((r) => {
        try {
            callback();

            r({
                data: 1
            });
        } catch (e) {
            sendError.withStatus(res, error(e) || defaultError)

            r({
                error: e
            })
        }
    })
}
const sendError = require("./sendError");

const defaultError = {
    message: 'Oops! An error occured. Try again.',
    status: 500
}

module.exports = function ({
    express = {},
    callback = () => { },
    onError = () => {},
    errorMessage = () => (defaultError)
}) {
    const { res } = express;

    return new Promise((r) => {
        try {
            callback();

            r({
                data: 1
            });
        } catch (e) {
            onError?.(e);

            sendError.withStatus(res, errorMessage(e) || defaultError)

            r({
                error: e
            })
        }
    })
}
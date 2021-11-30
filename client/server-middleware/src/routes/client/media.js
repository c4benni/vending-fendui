const mediaController = require("../../controller/client/media");
const mediaPolicies = require("../../policies/client/media");

module.exports = [
        {
            method: 'get',
            url: '/media',
            middleWare: mediaPolicies.getMedia,
            callback: mediaController.getMedia
        },
    ]
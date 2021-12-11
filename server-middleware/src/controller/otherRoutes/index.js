const { autoImportFromSameDirectory } = require('../../utils/utils')

const controller = autoImportFromSameDirectory(__dirname)

module.exports = controller

const path = require('path')
const fs = require('fs')

const controller = {}

const directories = fs
  .readdirSync(__dirname)
  .filter((dir) => !/\.\w+$/.test(dir))

directories.forEach((dir) => {
  const jsFiles = fs
    .readdirSync(path.join(__dirname, dir))
    .filter((file) => /\.js$/.test(file))

  jsFiles.forEach((file) => {
    const filePath = path.join(__dirname, dir, file)

    const module = require(filePath)

    if (typeof module == 'function') {
      const moduleName = file.replace(/\.js$/, '')

      controller[moduleName] = module
    } else if (typeof module == 'object') {
      Object.assign(controller, module)
    }
  })
})

module.exports = controller

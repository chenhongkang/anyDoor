const path = require("path")
const { config } = require("../config/config")

const canCompass = (localPath) => {
    let extname = path.extname(localPath).split(".").pop().toLowerCase()
    return config.compassType.test(extname)
}

module.exports = {
    canCompass
}
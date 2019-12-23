const path = require("path")
const fs = require("fs")
const { contentType, fileType } = require("../config/matchConfig")

const matchContentType = (localPath) => {
    let extname = path.extname(localPath).split(".").pop().toLowerCase()
    extname || (extname = "txt")
    contentType[extname] || (extname = "txt")
    return contentType[extname]
}

const matchFileType = (localPath) => {
    console.log(localPath)
    let extname = path.extname(localPath).split(".").pop().toLowerCase()
    const fileStat = fs.statSync(localPath)
    if(fileStat.isDirectory()){
        extname = "folder"
    }
    else {
        fileType[extname] || (extname = "unknow")
    }
    return fileType[extname]
}

module.exports = {
    matchContentType,
    matchFileType
}
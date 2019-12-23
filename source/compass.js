const {createGzip, createDeflate} = require('zlib')

const compass = (rs, req, res) => {
    const acceptEncoding = req.headers["accept-encoding"]
    if(/\bgzip\b/.test(acceptEncoding)){
        res.setHeader("content-encoding", "gzip")
        return rs.pipe(createGzip())
    }
    else if(/\bdeflate\b/.test(acceptEncoding)){
        res.setHeader("content-encoding", "deflate")
        return rs.pipe(createDeflate())
    }
    return rs
}

module.exports = {
    compass
}
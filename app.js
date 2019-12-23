const http = require("http")
const fs = require("fs")
const path = require("path")
const { promisify } = require("util") 

const { config } = require("./config/config")
const { matchContentType, matchFileType } = require("./source/match")
const { canCompass } = require("./source/check")
const { compass } = require("./source/compass")

const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

class Server {
    constructor(config) {
        this.argv = config
        this.handleRequest = this.handleRequest.bind(this)
    }

    //有url获取本地文件路径
    getLocalPath(url, req) {
        let urlPath = ""
        const urlSplit = url.split("?")
        //如果是icon结尾，就是特殊情况，从图标处取数据
        if(urlSplit.pop() === "icon"){
            urlPath = path.join(__dirname, urlSplit.join())
        }
        else {
            urlPath = path.join(this.argv.rootFileRoute || __dirname, url)
        }
        // const urlPath = path.join(argv.rootFileRoute, url)
        req.localPath = urlPath
        return urlPath
    }

    //由readdir读取到的数组生成相应的Dom
    createFileListDom(fileList, req) {
        let result = ""
        fileList.map((item) => {
            console.log(item)
            result += `<li style="style-list:none">
                        <img src="http://${req.headers.host}/img/fileIcon/${matchFileType(req.localPath + '/' + item)}?icon" style="width:20px;height:20px;vertical-align:middle"/>
                        <a href="http://${req.headers.host + req.url}/${item}" style="line-height:20px;vertical-align:middle;height:20px;display:inline-block;">${item}</a>
                    </li>`
        })
        result = "<ul>" + result + "</ul>"
        return result
    }

    //由文件的本地路径获取，显示文件内部的信息
    async handleLocalPath (req, res) {
        try{
            const fileStat = await stat(req.localPath)
            if(fileStat.isDirectory()){
                res.setHeader("content-type", "text/html")
                console.log(req.localPath)
                let result = await readdir(req.localPath)
                res.end(this.createFileListDom(result, req), 'charset=utf-8')
            }
            else if(fileStat.isFile()){
                let result = ""
                const mime = matchContentType(req.localPath)
                res.setHeader("content-type", mime)
                let readStream = await fs.createReadStream(req.localPath)
                //压缩
                canCompass(req.localPath) && (readStream = compass(readStream, req, res))
                //直接这样写入可写流 res
                readStream.pipe(res)
                readStream.on("end", (err) => {
                    res.end()
                })
            }
        }
        catch(err){
            console.log(err)
            res.end("file is not found")
        }
    }

    //处理请求
    handleRequest(req, res) {
        const { url } = req
        if(url !== "/favicon.ico"){
            this.getLocalPath(url, req)
            this.handleLocalPath(req, res)
        }
    }

    startServer() {
        const server = http.createServer(this.handleRequest)

        server.listen(this.argv.port || config.port, (err) => {
            if(err){
                console.log("create server fail")
            }
            console.log(`create server success in port ${this.argv.port || config.port}`)
        })
    }
}

module.exports = Server
// server.listen(config.port, (err) => {
//     if(err){
//         console.log("create server fail")
//     }
//     console.log(`create server success in port ${config.port}`)
// })
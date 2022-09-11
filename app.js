const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')

// npm install mime 下载插件 
const mime = require('mime')

// 创建服务器
const app = http.createServer()

// 服务器请求事件
app.on('request', (req, res)=>{
	// 获取用户请求路径
	let pathname = url.parse(req.url).pathname
	pathname = pathname == '/' ? '/index.html' : pathname
	let realpath = path.join(__dirname, '' + pathname)
	let type = mime.getType(realpath)
	fs.readFile(realpath, (error, result) => {
		if(error!=null){
			res.writeHead(400, {
				'content-type': 'text/html;charset=utf8'
			})
			res.end('文件读取失败')
			return 
		}
		res.writeHead(200, {
			'content-type': type
		})
		res.end(result)
	})
})

// 监听3000端口
app.listen(3000)
console.log("服务器启动成功！")

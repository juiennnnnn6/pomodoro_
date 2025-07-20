const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// MIME類型映射
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf'
};

// 創建HTTP服務器
const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // 解析URL
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // 獲取文件擴展名
    const extname = path.extname(filePath);
    
    // 設置默認MIME類型
    let contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // 讀取文件
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // 文件不存在
                fs.readFile('./404.html', (error, content) => {
                    if (error) {
                        // 404頁面也不存在
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('404 Not Found');
                    } else {
                        // 返回404頁面
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                // 服務器錯誤
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // 成功讀取文件
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// 啟動服務器
server.listen(PORT, () => {
    console.log(`服務器運行在 http://localhost:${PORT}/`);
    console.log('按 Ctrl+C 停止服務器');
}); 
const path = require('path');
const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const fs = require("fs");

const PORT = 9999;

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
    console.log('someone connected');
    ws.on("error", (e) => ws.send(e));
  
    ws.on("message", (data) => {
        console.log(data.toString());
        const path = './server/files/stat.txt';

        if (data.toString() === "check") {
            if (fs.existsSync(path)) {
                var status =fs.readFileSync(path, 'utf8');
            }
            else {
                var status = '0';
            }
            const message = JSON.stringify({
                status: status,
            });
            ws.send(message);
        }


        if (data.toString() === "toggle") {
            const start= new Date().getTime();
                    
            if (fs.existsSync(path)) {
                //file exists
                var status =fs.readFileSync(path, 'utf8');
                if (status === '1') {
                    fs.writeFileSync(path, '0', 'utf8');
                }
                else {
                    fs.writeFileSync(path, '1', 'utf8');
                }
            }
            else {
                fs.writeFileSync(path, '1', 'utf8');
            }
            var status =fs.readFileSync(path, 'utf8');
            console.log('status: ' + status);

            const data = fs.readFileSync("server/files/file.rtf"); 
            const stats = fs.statSync("server/files/file.rtf");
            const size = stats.size;
            console.log('fileSize: '+size);

            file = data.toString();	 
                    //console.log(file)
            
            const end = new Date().getTime();
            var time = end - start;
            console.log('Time: '+time);
            const message = JSON.stringify({
                status: status,
                time: time,
                size: size,
                content: file.toString(), // здесь передаем данные в виде строки
              });
            ws.send(message);
        };
    });
});

server.listen(PORT, () => {
    console.log(`Server runing on http://localhost:${PORT}`);
});
var htmlPath = path.resolve(__dirname, '..',  'index.html');
app.get('/', function (req, res) {  
      res
      .status(200)
        .sendFile(htmlPath);
});
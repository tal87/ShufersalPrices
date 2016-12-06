var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var port = 80;
var html = fs.readFileSync('index.html')
    //var srv = http.createServer((req, res) => {
    //    res.writeHead(200, { 'Content-Type': 'text/html' });
    //    res.end(html);
    //});

//srv.listen(port);

app.use('/', express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port);
console.log('server is listening on port ' + port)
var http = require('http');
var fs = require('fs');
var port = 3000;

var srv = http.createServer((req, res) => {
    console.log('got request');
    res.writeHead(200, {
        'Content-Encoding': 'gzip',
        'Access-Control-Allow-Origin': '*'
    });
    fs.readFile('prices.xml.gz', (err, data) => {
        if (err) {
            console.log('error', err);
        } else {
            console.log(data);
            res.end(data);
        }
    });
});

srv.listen(port);
console.log('listening on port ' + port);
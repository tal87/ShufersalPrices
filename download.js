var fs = require('fs');
var http = require('http');
var zlib = require('zlib');
var jsdom = require('jsdom');
var ftpClient = require('ftp');

//// ------ Decompress File
function decompression(srcFile, destFile, callback) {
    console.log('decompressing');
    var gzip = zlib.createUnzip();
    var outputFile = fs.createWriteStream(destFile);
    var inputFile = fs.createReadStream(srcFile);
    inputFile.pipe(gzip).pipe(outputFile);
}

//// ------ File Download
function DownloadFile(url, dest, callback) {
    var file = fs.createWriteStream(dest);
    http.get(url, function(resp) {
        resp.on('data', function(data) {
            file.write(data);
        });

        resp.on('end', function() {
            file.end();
            console.log('finished downloading file');
            callback(dest);
        });
    });
}

/// --- Get Page
function GetLinks(url, callback) {
    jsdom.env(url, ['http://code.jquery.com/jquery.js'], (err, window) => {
        var links = [];
        var allRows = window.$('tr');
        for (var i = 0; i < allRows.length; i++) {
            var txt = window.$(allRows[i]).text();
            if (txt.indexOf('pricefull') > -1 || txt.indexOf('promofull') > -1) {
                var newTS = window.$(allRows[i]).find('td').next('td').html();
                console.log('New TS: ' + currentTS);
                if (newTS != currentTS) {
                    console.log('Refreshing files');
                    links.push(window.$(allRows[i]).find('a').attr('href'));
                    currrentTS = newTS;
                } else {
                    console.log('No new files');
                }
            }
        }

        callback(links);
    });
}

//function UploadToFTP(fileName){
//    console.log('uploading');
//    var ftp = new ftpClient();
//    ftp.on('ready', () =>{
//        ftp.put(fileName, 'public_html/' + fileName, (err) =>{
//            if(err){
//                console.log('error', err);
//            }else{
//                console.log('finished upload');
//            }
//        });
//    });
//    
//    ftp.connect({
//        host: 'tal.comule.com',
//    });
//}

var currentTS = '';
var url = 'http://prices.shufersal.co.il/FileObject/UpdateCategory?catID=0&storeId=27';
var hour = 60 * 60000;
// refresh prices every five hours
setInterval(startProcess, hour * 5);

function startProcess() {
    var links = GetLinks(url, (links) => {
        for (var i = 0; i < links.length; i++) {
            var fileName = links[i].indexOf('pricefull') > -1 ? 'prices.xml.gz' : 'promo.xml.gz';
            DownloadFile(links[i], fileName, (fileName) => {
                //                if(fileName.indexOf('.gz') > -1){
                //                    var ind = fileName.indexOf('.gz');
                //                    var decompressedFileName = fileName.substring(0, ind);
                //                    decompression(fileName, decompressedFileName);
                //                    fileName = decompressedFileName;
                //                }

                //                UploadToFTP(fileName);
            });
        }
    });
}


var srv = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    console.log('Current TS: ' + currentTS);
    startProcess();
});

srv.listen(5000);
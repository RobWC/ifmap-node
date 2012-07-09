var https = require('https');
var fs = require('fs');

var options = {
  https: {
  key: fs.readFileSync('./server.key', 'utf8'),
  cert: fs.readFileSync('./server.crt', 'utf8')
  }
};

var server = https.createServer(options.https, function(req,res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay')
}).listen(8096);
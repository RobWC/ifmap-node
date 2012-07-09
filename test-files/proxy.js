var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var fs = require('fs');

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('death', function(worker) {
    console.log('worker ' + worker.pid + ' died');
  });
} else {
	var fs = require('fs'),
		https = require('https'),
		httpProxy = require('http-proxy');
	
	var options = {
	  https: {
		key: fs.readFileSync('./keys/juniperfaqdotnet.key', 'utf8'),
		cert: fs.readFileSync('./keys/www_juniperfaq_net.crt', 'utf8'),
		ca: fs.readFileSync('./keys/DigiCertCA.crt','utf8')
	  }
	};
	
	//
	// Create your proxy server
	var proxy = new httpProxy.RoutingProxy();
	https.createServer(options.https, function(req,res) {
	  if (req.url == '/register') {
	    console.log('reg');
	    fs.readFile('./index.htm', function(error, content) {
          if (error) {
              res.writeHead(500);
              res.end();
          }
          else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(content, 'utf-8');
          }
      });
    } else if (req.url == '/') {
      res.writeHead(302, {
      'Location': 'https://www.juniperfaq.net/faqman/_design/FAQcouch/index.html'
      });
      res.end();
	  } else {
      proxy.proxyRequest(req,res, {
        host: 'localhost',
        port: 5984
      });
	  };
	}).listen(443);
	
	http.createServer(function(req,res) {
	  if (req.url == '/register') {
      res.writeHead(302, {
        'Location': 'https://www.juniperfaq.net/register'
        });
      res.end();
	  } else {
      res.writeHead(302, {
      'Location': 'https://www.juniperfaq.net/faqman/_design/FAQcouch/index.html'
      });
      res.end();
    };
	}).listen(80);
};

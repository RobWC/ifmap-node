var tls = require('tls');
var fs = require('fs');
var ifMapCommands = require('./ifmap-commands.js').IFMapCommands;
var ifmapper = new ifMapCommands();

var options = {
  // These are necessary only if using the client certificate authentication
  //key: fs.readFileSync('client-key.pem'),
  //cert: fs.readFileSync('client-cert.pem'),

  // This is necessary only if the server uses the self-signed certificate
  //ca: [ fs.readFileSync('server-cert.pem') ]
};

var cleartextStream = tls.connect(443, '10.0.1.21',options, function() {
  console.log('client connected',
              cleartextStream.authorized ? 'authorized' : 'unauthorized');
  console.log(cleartextStream);
});
cleartextStream.setEncoding('utf8');
cleartextStream.write(ifmapper.getSession() + '\n\r\n\r');

cleartextStream.on('data', function(data) {
  console.log(data);
});

cleartextStream.on('end', function() {
  //server.close();
  console.log('end');
});

var getHeaders = function() {
  ''
};
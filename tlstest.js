var tls = require('tls');
var fs = require('fs');
var util = require('util');
var events = require('events');
var parser = require('xml2json');
var ifMapCommands = require('./ifmap-commands.js').IFMapCommands;
var ifmapper = new ifMapCommands();

var options = {
  // These are necessary only if using the client certificate authentication
  //key: fs.readFileSync('client-key.pem'),
  //cert: fs.readFileSync('client-cert.pem'),

  // This is necessary only if the server uses the self-signed certificate
  //ca: [ fs.readFileSync('server-cert.pem') ]
};

//events.EventEmitter.call(this);
//util.inherits(IFMapClient,events.EventEmitter);

var getHeaders = function(length) {
  var headers = 'POST /dana-ws/soap/dsifmap HTTP/1.1\r\nAuthorization: Basic YWRtaW46aGVsbG8=\r\nUser-Agent: node/6.18\r\nHost: users.rwc.io\r\nConnection: Keep-Alive\r\nAccept: */*\r\nContent-Type: text/xml\r\nContent-Length: ' + length + '\r\n\r\n';
  return headers;
};

var cleartextStream = tls.connect(443, '10.0.1.21',options, function() {
  //console.log('client connected', cleartextStream.authorized ? 'authorized' : 'unauthorized');
  //console.log(cleartextStream);
});
cleartextStream.setEncoding('utf8');
cleartextStream.write(getHeaders(ifmapper.getSession().length)+  ifmapper.getSession());

cleartextStream.on('data', function(data) {
  var split = data.split('\r\n');
  if (split[0] != '0') {
  var header = '';
  var tempData = '';
  var body = '';
  var stopCount = 0;
  var headerCmp = 0;
  var bodyCmp = 0;
  var lenCmp = 0;
  var len = 0;  
  for (i in split) {
    if (!!split[i]) {
      tempData = tempData ? tempData + ',' + split[i]: tempData = split[i];
    }
    
    if (split[i] == '') {
      stopCount++;
    };
    
    if (stopCount == 1 && headerCmp == 0 && lenCmp == 0) {
      header = tempData;
      tempData = '';
      headerCmp = 1;
    } else if (stopCount == 1 && headerCmp == 1 && lenCmp == 0) {
      len = parseInt(split[i]);
      tempData = '';
      lenCmp = 1;
    } else if (stopCount == 1 && headerCmp == 1 && lenCmp == 1 && bodyCmp == 0 && !!split[i]) {
       body = split[i];
       bodyCmp = 1
    };
    
  };
  var output = JSON.parse(parser.toJson(body.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
  console.log(output);
  };
});

cleartextStream.on('end', function() {
  console.log('Connection Closed');
});


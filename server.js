var https = require('https');
var parser = require('xml2json');
var IfmapNode = require('./ifmap-node.js').IfmapNode;

//evil globals
var sessionID = '';
//var soapPath = '/dana-ws/soap/dsifmap';
var soapPath = '/';
var soapPort = 8096;
//var soapPort = 443;
var soapHost = '10.0.1.250';

var ifmapper = new IfmapNode();

var options = {
  host: soapHost,
  port: soapPort,
  path: soapPath,
  method: 'POST',
  auth: 'admin:hello',
  headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': ifmapper.getSession().length
      }
};

var req = https.request(options, function(res) {

  res.on('data', function(d) {
    var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
    sessionID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
    console.log(sessionID);
    
    var options2 = {
        host: soapHost,
        port: soapPort,
        path: soapPath,
        method: 'POST',
        auth: 'admin:hello',
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': ifmapper.getUsers(sessionID).length
            }
      };
      
      var req2 = https.request(options2, function(res2) {
        res2.on('data', function(d) {
          console.log(d.toString());
          var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
        });
      });
      
      req2.on('error', function(e) {
        console.error(e);
      });

      req2.write(ifmapper.getUsers(sessionID,'DrBeef') + '\n');
      req2.end();
  });
  
});

req.on('error', function(e) {
  console.error(e);
});

// write data to request body

req.write(ifmapper.getSession() + '\n');
req.end();

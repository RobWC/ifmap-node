var https = require('https');
var parser = require('xml2json');

//evil globals
var sessionID = '';

var IfmapNode = function() {
    this.info = '';
};

IfmapNode.constructor = IfmapNode;

IfmapNode.prototype.getSession = function() {
    var message = '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1"><SOAP-ENV:Body><ifmap:new-session/> </SOAP-ENV:Body></SOAP-ENV:Envelope>';
    return message;
};

IfmapNode.prototype.getUsers = function() {
}

IfmapNode.prototype.setUser = function(sessionID) {
  var message = '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jnpr="http://www.juniper.net/2008/IFMAP/1" xmlns:meta="http://www.trustedcomputinggroup.org/2006/IFMAP-METADATA/1" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:jnpr2="http://www.juniper.net/2009/IFMAP/1" xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1" xmlns:wsdl="http://www.juniper.net/2008/IFMAP/1/ifmap.wsdl"><SOAP-ENV:Header><ifmap:session-id>' + sessionID + '</ifmap:session-id></SOAP-ENV:Header><SOAP-ENV:Body><ifmap:publish validation="None"><update><link><identifier><identity name="DrBeef" type="username"/></identifier></link></update></ifmap:publish></SOAP-ENV:Body></SOAP-ENV:Envelope>';
  return message;
};

var ifmapper = new IfmapNode();

var options = {
  host: '10.0.1.21',
  path: '/dana-ws/soap/dsifmap',
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
        host: '10.0.1.21',
        path: '/dana-ws/soap/dsifmap',
        method: 'POST',
        auth: 'admin:hello',
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': ifmapper.setUser(sessionID).length
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
      
      // write data to request body
      
      req2.write(ifmapper.setUser(sessionID) + '\n');
      req2.end();
  });
  
});

req.on('error', function(e) {
  console.error(e);
});

// write data to request body

req.write(ifmapper.getSession() + '\n');
req.end();

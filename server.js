var https = require('https');
var parser = require('xml2json');

//evil globals
var sessionID = '';

var IfmapNode = function() {
    this.info = '';
};

IfmapNode.constructor = IfmapNode;

IfmapNode.prototype.getSession = function() {
    var message = '<?xml version="1.0"?><env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope" xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1"><env:Body><ifmap:new-session/> </env:Body></env:Envelope>';
    return message;
};

IfmapNode.prototype.getUsers = function() {
    /*
     <?xml version="1.0"?>
   <ifmap:search
xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1"
xmlns:meta="http://www.trustedcomputinggroup.org/2006/IFMAP- METADATA/1"
     match-links="meta:access-request-ip or meta:ip-mac or
   meta:access-request-mac"
     max-depth="2" result-filter="meta:capability">
     <identifier>
       <ip-address value="192.0.2.11" type="IPv4"/>
     </identifier>
   </ifmap:search>
    */
}

IfmapNode.prototype.setUser = function(sessionID) {
  var message = '<?xml version="1.0"?> <ifmap:publish xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1" xmlns:meta="http://www.trustedcomputinggroup.org/2006/IFMAP- METADATA/1"><env:Header><ifmap:session-id>' + sessionID +  '</ifmap:session-id></env:Header><update><identifier><identity name="joe" type="username"/></identifier>';  
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
  //console.log("statusCode: ", res.statusCode);
  //console.log("headers: ", res.headers);

  res.on('data', function(d) {
    var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
    //console.log(d.toString());
    console.log(output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2'));
    sessionID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
  });
  
});

req.on('error', function(e) {
  console.error(e);
});

// write data to request body

req.write(ifmapper.getSession() + '\n');
req.end();

var options = {
  host: '10.0.1.21',
  path: '/dana-ws/soap/dsifmap',
  method: 'POST',
  auth: 'admin:hello',
  headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': ifmapper.setUser(sessionID).length
      }
};

var req = https.request(options, function(res) {
  //console.log("statusCode: ", res.statusCode);
  //console.log("headers: ", res.headers);

  res.on('data', function(d) {
    console.log(d.toString());
    var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
    console.log(output);
  });
  
});

req.on('error', function(e) {
  console.error(e);
});

// write data to request body

req.write(ifmapper.setUser(sessionID) + '\n');
req.end();
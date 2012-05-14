var https = require('https');
var IfmapNode = require('./ifmap-commands.js').IfmapNode;

var IFmapClient = function(soapHost, soapPort, soapPath, username, password) {
  this.sessionOptions = {
    host: soapHost,
    port: soapPort,
    path: soapPath,
    method: 'POST',
    auth: username + ':' + password,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': ''
    }
  };
  this.sessionID = '',
  this.publisherID = ''
};

IfmapClient.constructor = IFmapClient;

IFmapClient.prototype.createSession = function() {
  var self = this;
  sessionOptions.headers['Content-Length'] = getSesssion().length
  var ifmapper = new IfmapNode();
  var req = https.request(sessionOptions, function(res) {

    res.on('data', function(d) {
      console.log(d.toString());
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      self.sessionID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
      self.publisherID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_publisherid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
      console.log(sessionID + ' ' + publisherID);

    });

  });

  req.on('error', function(e) {
    console.error(e);
  });

  // write data to request body
  req.write(ifmapper.getSession() + '\n');
  req.end();
};
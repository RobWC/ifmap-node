var https = require('https');
var ifMapCommands = require('./ifmap-commands.js').IFMapCommands;
var parser = require('xml2json');

var IFMapClient = function(soapHost, soapPort, soapPath, username, password) {
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

exports.IFMapClient = IFMapClient;

IFMapClient.prototype.createSession = function() {
  var ifmapper = new ifMapCommands();
  var self = this;
  self.sessionOptions.headers['Content-Length'] = ifmapper.getSession().length
  var req = https.request(self.sessionOptions, function(res) {

    res.on('data', function(d) {
      console.log(d.toString());
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      self.sessionID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
      self.publisherID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_publisherid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
      console.log(self.sessionID + ' ' + self.publisherID);

    });

  });

  req.on('error', function(e) {
    console.error(e);
  });

  // write data to request body
  req.write(ifmapper.getSession() + '\n');
  req.end();
};

exports.IFMapClient = IFMapClient;
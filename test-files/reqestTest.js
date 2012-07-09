var request = require('request');
var ifMapCommands = require('./ifmap-commands.js').IFMapCommands;
var ifmapper = new ifMapCommands();
var parser = require('xml2json');

var url = 'https://admin:hello@10.0.1.21/dana-ws/soap/dsifmap';

var req = request.defaults({pool:{maxSockets: 5},method:'POST'});

req({'url':url,headers:{'Content-Length':ifmapper.getSession().length},body:ifmapper.getSession()}, function(error,response,body){
  console.log(response);
  var output =  JSON.parse(parser.toJson(body.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
  var sessionID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
  var publisherID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_publisherid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
  
  console.log('Session ID "' + sessionID +'"');
  console.log('Publisher ID ' + publisherID);
  console.log(body)
  
  if (!error) {
     // Print the google web page.
    req({'url':url,headers:{'Content-Length':ifmapper.getUsers(sessionID).length},body:ifmapper.getUsers(sessionID)}, function(err,res,body){
      console.log(body);
    });
  }
});
var tls = require('tls');
var fs = require('fs');
var util = require('util');
var events = require('events');
var parser = require('xml2json');
var ifMapCommands = require('./ifmap-commands.js').IFMapCommands;
var ifmapper = new ifMapCommands();

var IFMapClient = function(soapHost, soapPort, soapPath, username, password,useRedis) {
  var self = this;
  events.EventEmitter.call(this);
  
  this.connOpt = {
    soapHost: soapHost,
    soapPort: soapPort,
    soapPath: soapPath,
    username: username,
    password: password,
    useRedis: useRedis
  };

  this.sessionID = '';
  this.publisherID = '';
  
  this._clearTextStream = tls.connect(this.connOpt.soapPort, this.connOpt.soapHost,{},function(){
    self.emit('connected',{});
  });
  
  this._clearTextStream.on('data',function(data){
    
  });
  
  this._clearTextStream.on('error',function(data){
    self.emit('error',{});
    console.log('Error: ' + data.toString());
  });
  
  this._clearTextStream.on('end',function(){
    self.emit('end',{});
    console.log('Connection Closed');
  });
  
};

util.inherits(IFMapClient,events.EventEmitter);

exports.IFMapClient = IFMapClient;

var client = new IFMapClient('10.0.1.21',443,'/dana-ws/soap/dsifmap','admin','hello',false);

client.on('connected', function(){
  console.log('Connected');  
})
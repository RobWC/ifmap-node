var tls = require('tls');
var fs = require('fs');
var util = require('util');
var events = require('events');
var parser = require('xml2json');
var http = require('./http-messages.js');
var ifMapCommands = require('./ifmap-commands.js').IFMapCommands;
var ifmapper = new ifMapCommands();
var IFMapPollSession = require('./map-poller.js').IFMapPollSession;

var IFMapClient = function(soapHost, soapPort, soapPath, username, password) {
  var self = this;
  events.EventEmitter.call(this);

  this.connOpt = {
    soapHost: soapHost,
    soapPort: soapPort,
    soapPath: soapPath,
    username: username,
    password: password
  };

  this.sessionID = '';
  this.publisherID = '';
  
  this.pollSession;
  this.pollIntervalSession;
  
  this._clearTextStream = tls.connect(this.connOpt.soapPort, this.connOpt.soapHost,{},function(){
    self.emit('connected',{});
  });
  
  this._clearTextStream.setMaxListeners(0);
  
  this._clearTextStream.on('data',function(data){
    self.emit('data',data);
  });
  
  this._clearTextStream.on('error',function(data){
    self.emit('error',data);
    console.log('Error: ' + data.toString());
  });
  
  this._clearTextStream.on('end',function(data){
    self.emit('end',data);
    console.log('Connection Closed');
  });
  
  this.on('connected', function(){
    self._newSession();
  });
  
};

util.inherits(IFMapClient,events.EventEmitter);

exports.IFMapClient = IFMapClient;

IFMapClient.prototype._newSession = function() {
  var self = this;
  
  var options = {
    host: this.connOpt.soapHost,
    body: ifmapper.newSession(),
    path: this.connOpt.soapPath,
    auth: {
      username: this.connOpt.username,
      password: this.connOpt.password
    }
  };
  
  var req = new http.request(options,this._clearTextStream,function(res){
  
  });
  
  var callback = function(res){
    //grab the session ID
    if (!!res.body) {
      var output = JSON.parse(parser.toJson(res.body.replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      self.sessionID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
      self.publisherID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_publisherid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
      self.emit('newsession',self.sessionID);
      req.removeListener('end', callback);
    };
  }
  
  req.on('end',callback);
  
};

IFMapClient.prototype.getUsers = function() {
  var self = this;
  
  var options = {
    host: this.connOpt.soapHost,
    body: ifmapper.getUsers(self.sessionID),
    path: this.connOpt.soapPath,
    auth: {
      username: self.connOpt.username,
      password: self.connOpt.password
    }
  };
  
  var req = new http.request(options,self._clearTextStream,function(res){
  
  });
    
  req.on('end', function(res){
    //grab the session ID
    if (!!res.body) {
      var output = JSON.parse(parser.toJson(res.body.replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      console.log(output.SOAPENV_Envelope.SOAPENV_Body);
    };
  });
  
};

IFMapClient.prototype.newPollSession = function(interval) {
  var self = this;
  self.pollSession = new IFMapPollSession(self.connOpt.soapHost,self.connOpt.soapPort,self.connOpt.soapPath,self.connOpt.username,self.connOpt.password,self.sessionID,self.publisherID,interval);
  //emit poll when data is recieved
  //allow user to set polling interval at creation
};

IFMapClient.prototype.endPollSession = function() {
  var self = this;
  self.pollSession.close();
};

IFMapClient.prototype.subscribeIP = function(host) {
  var self = this;
  
  var options = {
    host: this.connOpt.soapHost,
    body: ifmapper.subscribeIP(self.sessionID,host),
    path: this.connOpt.soapPath,
    auth: {
      username: self.connOpt.username,
      password: self.connOpt.password
    }
  };
  
  var req = new http.request(options,self._clearTextStream,function(res){
  
  });
    
  req.on('end', function(res){
    //grab the session ID
    if (!!res.body) {
      var output = JSON.parse(parser.toJson(res.body.replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      console.log(output.SOAPENV_Envelope.SOAPENV_Body);
    };
  });
  
};

IFMapClient.prototype.subscribeDevice = function(host) {
  var self = this;
  
  var options = {
    host: this.connOpt.soapHost,
    body: ifmapper.subscribeDevice(self.sessionID,host),
    path: this.connOpt.soapPath,
    auth: {
      username: self.connOpt.username,
      password: self.connOpt.password
    }
  };
  
  var req = new http.request(options,self._clearTextStream,function(res){
  
  });
    
  req.on('end', function(res){
    //grab the session ID
    if (!!res.body) {
      var output = JSON.parse(parser.toJson(res.body.replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      console.log(output.SOAPENV_Envelope.SOAPENV_Body);
    };
  });
  
};
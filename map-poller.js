var tls = require('tls');
var fs = require('fs');
var util = require('util');
var events = require('events');
var parser = require('xml2json');
var http = require('./http-messages.js');
var ifMapCommands = require('./ifmap-commands.js').IFMapCommands;
var ifmapper = new ifMapCommands();

//poll session section
var IFMapPollSession = function(soapHost, soapPort, soapPath, username, password,sessionID,publisherID,interval) {
  var self = this;
  events.EventEmitter.call(this);

  this.connOpt = {
    soapHost: soapHost,
    soapPort: soapPort,
    soapPath: soapPath,
    username: username,
    password: password
  };
  
  this.interval = interval;

  this.sessionID = sessionID;
  this.publisherID = publisherID;
  
  this.pollIntervalSession;
  
  this._clearTextStream = tls.connect(this.connOpt.soapPort, this.connOpt.soapHost,{},function(){
    self.emit('pollConnected',{});
  });

  this._clearTextStream.setMaxListeners(0);
  
  this._clearTextStream.on('data',function(data){
    //self.emit('pollData',data);
  });
  
  this._clearTextStream.on('error',function(data){
    self.emit('pollError',data);
    console.log('Error: ' + data.toString());
  });
  
  this._clearTextStream.on('end',function(data){
    self.emit('pollEnd',data);
    console.log('Poll Connection Closed');
  });
  
  this.on('pollConnected', function(){
    self._newSession();
  });
  
  this.on('pollData', function(data){
    console.log(data);
  })
  
};

util.inherits(IFMapPollSession,events.EventEmitter);

exports.IFMapPollSession = IFMapPollSession;

IFMapPollSession.prototype._newSession = function() {
  var self = this;
  
  var options = {
    host: this.connOpt.soapHost,
    body: ifmapper.getPollSession(self.sessionID),
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
      self.emit('pollNewsession',self.sessionID);
      var pollCallback = function() {
        self.poll();
        console.log('callback');
      };
      self.pollIntervalSession = setInterval(pollCallback,self.interval * 1000);
      req.removeListener('end', callback);
    };
  }
  
  req.on('end',callback);
  
};

IFMapPollSession.prototype.poll = function() {
  var self = this;
  
  var options = {
    host: self.connOpt.soapHost,
    body: ifmapper.poll(self.sessionID),
    path: self.connOpt.soapPath,
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
      self.emit('pollData',JSON.stringify(output.SOAPENV_Envelope.SOAPENV_Body));
    };
  });
  
};

IFMapPollSession.prototype.close = function() {
  var self = this;
  
  var options = {
    host: this.connOpt.soapHost,
    body: ifmapper.poll(self.sessionID),
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
      self.emit('pollEnd',output.SOAPENV_Envelope.SOAPENV_Body);
      console.log(output.SOAPENV_Envelope.SOAPENV_Body);
      //close socket
      clearInterval(self.pollIntervalSession);
      self._clearTextStream.end();
    };
  });
};
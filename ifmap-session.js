//node modules
var https = require('https');
var util = require('util');
var events = require('events');
//first party modules
var ifMapCommands = require('./ifmap-commands.js').IFMapCommands;
//third party modules
var parser = require('xml2json');
var redis;
var redisClient;

https.globalAgent.maxSockets = 100;

var IFMapClient = function(soapHost, soapPort, soapPath, username, password,useRedis) {
  events.EventEmitter.call(this);
  if (useRedis) {
    redis = require('redis');
    client = redis.createClient();
  }
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
  this.sessionID = '';
  this.publisherID = '';
  this.useRedis = useRedis;
};

util.inherits(IFMapClient,events.EventEmitter);

exports.IFMapClient = IFMapClient;

IFMapClient.prototype.createSession = function(options) {
  var ifmapper = new ifMapCommands();
  var self = this;
  self.sessionOptions.headers['Content-Length'] = ifmapper.getSession().length
  var req = https.request(self.sessionOptions, function(res) {

    res.on('data', function(d) {
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      self.sessionID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
      self.publisherID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_publisherid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
    });
    
    res.on('end', function(d){
      self.emit('sessionStart',self.sessionID);
    });

  });

  req.on('error', function(e) {
    console.error(e);
  });

  // write data to request body
  req.write(ifmapper.getSession());
  req.end(); 
  
};

IFMapClient.prototype.publishUpdate = function(options) {
  var ifmapper = new ifMapCommands();
  var self = this;
  self.sessionOptions.headers['Content-Length'] = ifmapper.setUser(self.sessionID,'DrBeef').length
  var req = https.request(self.sessionOptions, function(res) {

    res.on('data', function(d) {
      console.log(d.toString());
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      self.emit('response',output);
    });
    
    res.on('end', function(d){
      self.emit('end','');
    });
  
  });

  req.on('error', function(e) {
    console.error(e);
  });

  req.write(ifmapper.setUser(self.sessionID,'DrBeef'));
  req.end(); 
};

IFMapClient.prototype.publishUpdate = function(options) {
  var ifmapper = new ifMapCommands();
  var self = this;
  self.sessionOptions.headers['Content-Length'] = ifmapper.setUser(self.sessionID,'DrBeef').length
  var req = https.request(self.sessionOptions, function(res) {

    res.on('data', function(d) {
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      self.emit('response',output);
    });
    
    res.on('end', function(d){
      self.emit('published','');
    });
  });

  req.on('error', function(e) {
    console.error(e);
  });

  req.write(ifmapper.setUser(self.sessionID,'DrBeef'));
  req.end(); 
};

IFMapClient.prototype.getPollSession = function(options) {
  var ifmapper = new ifMapCommands();
  var self = this;
  var response = '';

  self.sessionOptions.headers['Content-Length'] = ifmapper.getPollSession(self.sessionID).length
  var req = https.request(self.sessionOptions, function(res) {

    res.on('data', function(d) {
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      response = output;
      self.emit('pollSession',{msg:response,type:'pollSession'});
      
      //self.emit('response',output);
    });
    
    res.on('end', function(d){
      //self.emit('polled',{msg:response,type:'poll'});
    });
  });

  req.on('error', function(e) {
    console.error(e);
  });

  req.write(ifmapper.getPollSession(self.sessionID));
  req.end(); 
};

IFMapClient.prototype.pollData = function(options) {
  var ifmapper = new ifMapCommands();
  var self = this;
  var response = '';
  self.sessionOptions.headers['Content-Length'] = ifmapper.poll(self.sessionID).length
  
  var req = https.request(self.sessionOptions, function(res) {
    res.on('data', function(d) {
      console.log(d.toString());
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      response = output;
      //REDIS TIME
      if (self.useRedis) {
        client.append('polls',d.toString());
      }
      self.emit('poll',{msg:response,type:'poll'});
    });
    
    res.on('end', function(d){
      //self.emit('polled',{msg:response,type:'poll'});
    });
  });

  req.on('error', function(e) {
    console.error(e);
  });

  req.write(ifmapper.poll(self.sessionID));
  req.end(); 
};

IFMapClient.prototype.subscribe = function(options) {
  var ifmapper = new ifMapCommands();
  var self = this;
  self.sessionOptions.headers['Content-Length'] = ifmapper.subscribeUser(self.sessionID,'DrBeef').length
  var req = https.request(self.sessionOptions, function(res) {

    res.on('data', function(d) {
      console.log(d.toString());
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      self.emit('response',output);
    });
    
    res.on('end', function(d){
      self.emit('subscribed','channel12');
    });
  });

  req.on('error', function(e) {
    console.error(e);
  });

  req.write(ifmapper.setUser(self.subscribeUser,'DrBeef'));
  req.end(); 
};

IFMapClient.prototype.subscribeDevice = function(options,deviceName) {
  var ifmapper = new ifMapCommands();
  var self = this;
  var response = ''
  self.sessionOptions.headers['Content-Length'] = ifmapper.subscribeDevice(self.sessionID,deviceName).length
  var req = https.request(self.sessionOptions, function(res) {

    res.on('data', function(d) {
      console.log(d.toString());
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      response = output;
      self.emit('response',output);
    });
    
    res.on('end', function(d){
      self.emit('subscribed', {msg:response,type:'device',name:deviceName});
    });
  });

  req.on('error', function(e) {
    console.error(e);
  });

  req.write(ifmapper.subscribeDevice(self.sessionID,deviceName));
  req.end(); 
};
//node modules
var https = require('https');
var util = require('util');
var events = require('events');
//first party modules
var ifMapCommands = require('./ifmap-commands.js').IFMapCommands;
//third party modules
var parser = require('xml2json');

https.globalAgent.maxSockets = 20;

var IFMapClient = function(soapHost, soapPort, soapPath, username, password) {
  var self = this;
  
  events.EventEmitter.call(this);

  this.sessionOptions = {
    host: soapHost,
    port: soapPort,
    path: soapPath,
    method: 'POST',
    auth: username + ':' + password,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': '',
      'Connection': 'Keep-Alive'
    }
  };
  
  this.sessionID = '';
  this.publisherID = '';
  this.useRedis = useRedis;
  this.ifmapper = new ifMapCommands();
    
  this.httpsSession = new Object();
  
  this.sessionOptions.headers['Content-Length'] = this.ifmapper.getSession().length
  
  var self = this;
  
  this.httpsSession.request = https.request(self.sessionOptions, function(res) {
      
    res.on('data', function(d) {
      //this.httpsSession.response = res;
      console.log(d.toString());
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      if (!!output.SOAPENV_Envelope && !!output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid){
        self.sessionID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
        self.publisherID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_publisherid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
        console.log('Session ID "' + self.sessionID +'"');
        console.log('Publisher ID ' + self.publisherID);
      };
    });
    
    res.on('end', function(d){
      console.log(this.httpsSession.request);
      this.emit('sessionStart',self.sessionID);
    });
    
  });
  
  this.httpsSession.request.on('response', function(e) {
    console.log('response')
    //this.httpsSession.request.setSocketKeepAlive(enable=true);
  });
  
  
  this.httpsSession.request.on('socket', function(socket) {
    //socket.emit("agentRemove");
    console.log('socket assigned')
    //this.httpsSession.request.setSocketKeepAlive(enable=true);
  });
  
  this.httpsSession.request.on('error', function(e) {
    console.error(e);
  });
  
  this.httpsSession.request.write(self.ifmapper.getSession());
  
};

util.inherits(IFMapClient,events.EventEmitter);

exports.IFMapClient = IFMapClient;

IFMapClient.prototype.sendCommand = function(command) {
  var self = this;
  console.log(self.httpsSession);
  self.httpsSession.request.write(self.ifmapper.getUsers(self.sessionID));
  self.emit('commandSent');
};

IFMapClient.prototype.createSession = function(options) {
  var self = this;
  
  self.sessionOptions.headers['Content-Length'] = this.ifmapper.getSession().length
  
  self.httpsSession.request = https.request(self.sessionOptions, function(res) {
      
    res.on('data', function(d) {
      //this.httpsSession.response = res;
      console.log(d.toString());
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      if (!!output.SOAPENV_Envelope && !!output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid){
        self.sessionID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
        self.publisherID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_publisherid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
        console.log('Session ID "' + self.sessionID +'"');
        console.log('Publisher ID ' + self.publisherID);
      };
    });
    
    res.on('end', function(d){
      self.emit('sessionStart',self.sessionID);
    });
    
  });
  
  self.httpsSession.request.on('response', function(e) {
    console.log('response')
    //this.httpsSession.request.setSocketKeepAlive(enable=true);
  });
  
  
  self.httpsSession.request.on('socket', function(socket) {
    //socket.emit("agentRemove");
    console.log('socket assigned')
    //this.httpsSession.request.setSocketKeepAlive(enable=true);
  });
  
  self.httpsSession.request.on('error', function(e) {
    console.error(e);
  });
  
  self.httpsSession.request.write(self.ifmapper.getSession());
};

/*


IFMapClient.prototype.createSession = function(options) {
  var self = this;
  self.sessionOptions.headers['Content-Length'] = this.ifmapper.getSession().length
  
  var req = https.request(self.sessionOptions, function(res) {

    res.on('data', function(d) {
      console.log(d.toString());
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      if (!!output.SOAPENV_Envelope && !!output.SOAPENV_Envelope.SOAPENV_Body.ifmap_publisherid){
        self.sessionID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_sessionid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
        self.publisherID = output.SOAPENV_Envelope.SOAPENV_Body.ifmap_publisherid.replace(/(\w)[_]{1}(\w)/gi, '$1:$2');
        console.log('Session ID "' + self.sessionID +'"');
        console.log('Publisher ID ' + self.publisherID);
      };
    });
    
    res.on('end', function(d){
      self.emit('sessionStart',self.sessionID);
    });

  });

  req.on('error', function(e) {
    console.error(e);
  });

  // write data to request body
  req.end(this.ifmapper.getSession()); 
  
};

IFMapClient.prototype.publishUpdate = function(options) {
  var self = this;
  self.sessionOptions.headers['Content-Length'] = this.ifmapper.setUser(self.sessionID,'DrBeef').length
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

  req.end(this.ifmapper.setUser(self.sessionID,'DrBeef')); 
};

IFMapClient.prototype.publishUpdate = function(options) {
  var self = this;
  self.sessionOptions.headers['Content-Length'] = this.ifmapper.setUser(self.sessionID,'DrBeef').length
  var req = https.request(self.sessionOptions, function(res) {

    res.on('data', function(d) {
      console.log(d.toString());
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

  req.end(this.ifmapper.setUser(self.sessionID,'DrBeef')); 
};

IFMapClient.prototype.getPollSession = function(options) {
  var self = this;
  
  var httpsP = require('https');
  self.pollSessionOptions.headers['Content-Length'] = this.ifmapper.getPollSession(self.sessionID).length
  var req = httpsP.request(self.pollSessionOptions, function(res) {

    res.on('data', function(d) {
      console.log(d.toString());
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      self.emit('pollSession',{msg:output,type:'pollSession'});
    });
    
    res.on('end', function(d){
      //self.emit('polled',{msg:response,type:'poll'});
    });
  });

  req.on('error', function(e) {
    console.error(e);
  });
  console.log('PULL SESSION REQUEST ########################');
  console.log(this.ifmapper.getPollSession(self.sessionID));
  console.log('####################################');
  req.end(this.ifmapper.getPollSession(self.sessionID)); 
};

IFMapClient.prototype.pollData = function(options) {
  var self = this;
  console.log('LENGTH ' + this.ifmapper.poll(self.sessionID).length);
  self.pollSessionOptions.headers['Content-Length'] = this.ifmapper.poll(self.sessionID).length
  
  var httpsP = require('https');
  var req = httpsP.request(self.pollSessionOptions, function(res) {
    res.on('data', function(d) {
      console.log(d.toString());
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      //REDIS TIME
      if (self.useRedis) {
        client.append('polls',d.toString());
      }
      self.emit('poll',{msg:output,type:'poll'});
    });
    
    res.on('error', function(d){
      console.log('poll error');
    })
    
    res.on('end', function(d){
      console.log('poll ended');
    });
    
  });

  req.on('error', function(e) {
    console.error(e);
  });
  
  req.on('response', function(d){
    console.log('poll response');
  })

  req.end(this.ifmapper.poll(self.sessionID),'utf8');
};

IFMapClient.prototype.subscribe = function(options) {
  var self = this;
  self.sessionOptions.headers['Content-Length'] =this.ifmapper.subscribeUser(self.sessionID,'DrBeef').length
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

  req.end(this.ifmapper.setUser(self.subscribeUser,'DrBeef')); 
};

IFMapClient.prototype.subscribeDevice = function(options,deviceName) {
  var self = this;
  var response = ''
  self.sessionOptions.headers['Content-Length'] = this.ifmapper.subscribeDevice(self.sessionID,deviceName).length
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

  req.end(this.ifmapper.subscribeDevice(self.sessionID,deviceName)); 
};

IFMapClient.prototype.getUsers = function(options) {
  var self = this;
  self.sessionOptions.headers['Content-Length'] = this.ifmapper.getUsers(self.sessionID).length;
  console.log('requesting users');
  
  var req = https.request(self.sessionOptions, function(res) {
    res.on('data', function(d) {
      console.log(d.toString());
      var output = JSON.parse(parser.toJson(d.toString().replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
      self.emit('response',output);
    });
    
    res.on('end', function(d){
      //self.emit('rec','channel12');
    });
  });

  req.on('error', function(e) {
    console.error(e);
  });
  
  console.log(this.ifmapper.getUsers(self.sessionID));
  
  req.end(this.ifmapper.getUsers(self.sessionID)); 
};
*/
var util = require('util');
var events = require('events');

///////////////Request

//object path, body, 

var Request = function(options, stream,callback) {
  events.EventEmitter.call(this);
  var self = this;
  
  this.headers = new ReqHeaders(options.host,'POST',options.path,options.auth); //assuming reqheaders object
  this.body = options.body;
  this.clearStream = stream;
  this.bodyLen = options.body.length;
  //this.response;
  this.headers.headers['Content-Length'] = this.bodyLen;
  stream.write(this.headers.getHeadersString() + this.body);
  
  stream.on('data',function(data){
    self.emit('end',new Response(data));
  });
  
};

util.inherits(Request,events.EventEmitter);

Request.prototype._send = function() {
  //setup content length header
  this.headers['Content-Length'] = this.body.length;
  stream.write(this.headers + this.body)
  stream.on('data',function(data){
    self.emit('end',new Response(data));
  });
};

exports.request = function(options, stream,callback) {
  
  return new Request(options, stream,callback);
};

//////////////////////Response
var Response = function(data) {
  this.headers;
  this.body;
  this.bodyLen;
  this._pareseData(data);
};

Response.prototype._pareseData = function(data) {
  var self = this;
  
  var split = data.toString().split('\r\n');
  if (split[0] != '0') {
    var header = '';
    var tempData = '';
    var body = '';
    var stopCount = 0;
    var headerCmp = 0;
    var bodyCmp = 0;
    var lenCmp = 0;
    var len = 0;
    for (i in split) {
      if ( !! split[i]) {
        tempData = tempData ? tempData + '::::' + split[i] : tempData = split[i];
      }
      if (split[i] == '') {
        stopCount++;
      };

      if (stopCount == 1 && headerCmp == 0 && lenCmp == 0) {
        header = tempData;
        tempData = '';
        headerCmp = 1;
      } else if (stopCount == 1 && headerCmp == 1 && lenCmp == 0) {
        len = parseInt(split[i]);
        tempData = '';
        lenCmp = 1;
      } else if (stopCount == 1 && headerCmp == 1 && lenCmp == 1 && bodyCmp == 0 && !! split[i]) {
        body = split[i];
        bodyCmp = 1
      };

    };
    if (!!header) {
      self.headers = new ResHeaders(header);
    } else {
      self.headers = null;
    };
    if (!!body) {
      self.body = body;
    } else {
      self.body = null;
    };
    if (!!len) {
      self.bodyLen = len;
    } else {
      self.bodyLen = null;
    };
  };
}

exports.Response = Response;

///////////////////////ReqHeaders
var ReqHeaders = function(host, type, path, auth) {
  //auth object is {username:x, password:y}
  this.method = {
    type: 'POST',
    path: path ? path : '/',
    protocol: 'HTTP/1.1'
  };
  this.headers = {
    'Host': host ? host : '',
    'User-Agent': 'ifmapper/1.0',
    'Connection': 'Keep-Alive',
    'Accept': '*/*',
    'Content-Type': 'text/xml',
    'Content-Length': ''
  };
  if ( !! auth && !! auth.username && !! auth.password) {
    var buf = new Buffer(auth.username + ':' + auth.password, 'utf8');
    this.headers['Authorization'] = 'Basic ' + buf.toString('base64');
  };
};

exports.ReqHeaders = ReqHeaders;

ReqHeaders.prototype.getMethodHeader = function() {
  var header = this.method.type + ' ' + this.method.path + ' ' + this.method.protocol + '\r\n';
  return header;
};

ReqHeaders.prototype.getHeadersString = function() {
  var headers = '';
  headers = this.getMethodHeader(); //start with the method header always
  for (var key in this.headers) {
    headers = headers + key + ': ' + this.headers[key] + '\r\n';
  };
  return headers + '\r\n';
};

//////////////////ResHeaders
var ResHeaders = function(headers) {
  var _headArray = headers.split('::::');
  //pull off the method header first
  var _methodHead = _headArray.shift().split(' ');
  this.method = {
    protocol: _methodHead[0],
    code: _methodHead[1],
    message: _methodHead[2]
  }
  for (var i in _headArray) {
    var _headItem = _headArray[i].split(':');
    this[_headItem[0]] = _headItem[1].replace(/\r\n$/, '').replace(/^\s+/, '');
  };
};

exports.ResHeaders = ResHeaders;
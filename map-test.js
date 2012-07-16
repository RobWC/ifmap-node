var IFMapClient = require('./map-session.js').IFMapClient;

var client = new IFMapClient('10.0.1.21',443,'/dana-ws/soap/dsifmap','admin','hello');

client.on('connected', function(){
  console.log('Connected');  
});

client.on('newsession',function(data){
  console.log('NEW SESSION ' + data);
  client.subscribeIP('10.0.1.20');
  client.newPollSession(30);
});
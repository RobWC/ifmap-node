var IFMapClient = require('./ifmap-session.js').IFMapClient;

var client = new IFMapClient('10.0.1.250', '8096', '/', 'admin', 'hello',true);
client.createSession();

client.on('sessionStart', function(d) {
  console.log('Session Started!');
  //subscribing
  var subscribeCalback = function() {
    client.subscribeDevice({},'1000:45');
  };
  subscribeCalback(); //start the sub
  setInterval(subscribeCalback,120000);
});

client.on('poll',function(d){
    console.log('Poll Results ' + Date());
    console.log(d);
    //console.log(d.msg.SOAPENV_Envelope.SOAPENV_Body.ifmap_response.pollResult.searchResult.identifierResult.identifier.device);
});

client.on('subscribed', function(d) {
    console.log('Subscribed!');
    console.log(d.msg.SOAPENV_Envelope.SOAPENV_Body.ifmap_response);
    //get a new polling session
    client.getPollSession({});
});

client.on('pollSession',function(d){
    console.log('Poll Session Started');
    console.log(d);
    //setup a new callback to continue polling
    setInterval(function() {
      console.log('Polling!')
      client.pollData();
    }, 5000);
});
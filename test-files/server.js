var IFMapClient = require('./ifmap-session.js').IFMapClient;

var client = new IFMapClient('10.0.1.21', '443', '/dana-ws/soap/dsifmap', 'admin', 'hello', false);

client.on('sessionStart',function(d){
    console.log('session started');
    setInterval(client.sendCommand,5000);
});

client.on('commandSent',function(d){
  console.log('commandSent');
});

    //subscribing
    /*var subscribeCalback = function() {
        client.subscribeDevice({},'1000:45');
    };
    */
    //subscribeCalback(); //start the sub
    //setInterval(subscribeCalback,60000);
/*
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
*/
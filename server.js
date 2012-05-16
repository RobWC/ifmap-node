var IFMapClient = require('./ifmap-session.js').IFMapClient;

var client = new IFMapClient('10.0.1.250', '8096', '/', 'admin', 'hello');
client.createSession();

client.on('sessionStart', function(d) {
    console.log('Session Started!');
    //subscribing
    var subscribeCalback = function() {
        client.subscribeDevice({}, 'happy');
    };
    subscribeCalback(); //start the sub
    setInterval(subscribeCalback,120000);
});

client.on('poll',function(d){
    console.log('Poll Results');
    console.log(d);
});

client.on('subscribed', function(d) {
    console.log('Subscribed!');
    console.log(d.msg.SOAPENV_Envelope.SOAPENV_Body.ifmap_response);
    client.poll();
});

client.on('pollSession',function(d){
    var callback = function() {
     client.pollData();
    };
    setInterval(callback, 5000);
});
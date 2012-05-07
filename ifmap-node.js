module.exports = new IfmapNode();

var IfmapNode = function() {
    this.info = '';
};

IfmapNode.constructor = IfmapNode;

IfmapNode.prototype.getSession = function() {
    var message = '<?xml version="1.0"?><env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope" xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1"><env:Body><ifmap:new-session/> </env:Body></env:Envelope>'
    return message;
}
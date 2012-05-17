var IFMapCommands = function() {
  this.info = '';
  return this;
};

exports.IFMapCommands = IFMapCommands;

//start sessions
IFMapCommands.prototype.getSession = function() {
  var message = '<?xml version="1.0" encoding="UTF-8"?>\
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1">\
      <SOAP-ENV:Body>\
        <ifmap:new-session/>\
      </SOAP-ENV:Body>\
    </SOAP-ENV:Envelope>';
  return message;
};

IFMapCommands.prototype.getPollSession = function(sessionID) {
  var message = '<?xml version="1.0" encoding="utf-8"?>\
  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jnpr="http://www.juniper.net/2008/IFMAP/1" xmlns:meta="http://www.trustedcomputinggroup.org/2006/IFMAP-METADATA/1" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:jnpr2="http://www.juniper.net/2009/IFMAP/1" xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1" xmlns:wsdl="http://www.juniper.net/2008/IFMAP/1/ifmap.wsdl">\
    <SOAP-ENV:Header>\
    </SOAP-ENV:Header>\
    <SOAP-ENV:Body>\
      <ifmap:attach-session>' + sessionID + '</ifmap:attach-session>\
      <ifmap:poll validation="None"/>\
    </SOAP-ENV:Body>\
</SOAP-ENV:Envelope>';
  return message;
};

IFMapCommands.prototype.getUsers = function(sessionID) {
  username = 'DrBeef';
  var message = '<?xml version="1.0" encoding="utf-8"?>\
  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jnpr="http://www.juniper.net/2008/IFMAP/1" xmlns:meta="http://www.trustedcomputinggroup.org/2006/IFMAP-METADATA/1" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:jnpr2="http://www.juniper.net/2009/IFMAP/1" xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1" xmlns:wsdl="http://www.juniper.net/2008/IFMAP/1/ifmap.wsdl">\
    <SOAP-ENV:Header>\
        <ifmap:session-id>' + sessionID + '</ifmap:session-id>\
    </SOAP-ENV:Header>\
    <SOAP-ENV:Body>\
      <ifmap:search validation="None" match-links="(meta:username | meta:role)" max-depth="10">\
        <identifier>\
          <identity name="' + username + '" type="username"/>\
        </identifier>\
      </ifmap:search>\
    </SOAP-ENV:Body>\
</SOAP-ENV:Envelope>';
  return message;
}

IFMapCommands.prototype.subscribeUser = function(sessionID,username) {
  username = 'DrBeef';
  var message = '<?xml version="1.0" encoding="utf-8"?>\
  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jnpr="http://www.juniper.net/2008/IFMAP/1" xmlns:meta="http://www.trustedcomputinggroup.org/2006/IFMAP-METADATA/1" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:jnpr2="http://www.juniper.net/2009/IFMAP/1" xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1" xmlns:wsdl="http://www.juniper.net/2008/IFMAP/1/ifmap.wsdl">\
    <SOAP-ENV:Header>\
        <ifmap:session-id>' + sessionID + '</ifmap:session-id>\
    </SOAP-ENV:Header>\
    <SOAP-ENV:Body>\
      <ifmap:subscribe>\
        <update max-depth="10" max-size="0" name="admin">\
          <identifier>\
            <identity administrative-domain="" name="' + username + '" type="username"/>\
          </identifier>\
        </update>\
      </ifmap:subscribe>\
    </SOAP-ENV:Body>\
</SOAP-ENV:Envelope>';
  return message;
};

IFMapCommands.prototype.subscribeDevice = function(sessionID,deviceName) {
  username = 'happy';
  var message = '<?xml version="1.0" encoding="utf-8"?>\
  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jnpr="http://www.juniper.net/2008/IFMAP/1" xmlns:meta="http://www.trustedcomputinggroup.org/2006/IFMAP-METADATA/1" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:jnpr2="http://www.juniper.net/2009/IFMAP/1" xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1" xmlns:wsdl="http://www.juniper.net/2008/IFMAP/1/ifmap.wsdl">\
    <SOAP-ENV:Header>\
      <ifmap:session-id>' + sessionID + '</ifmap:session-id>\
    </SOAP-ENV:Header>\
    <SOAP-ENV:Body>\
      <ifmap:subscribe>\
        <update max-depth="4" name="admin">\
          <identifier>\
            <device>\
              <name>' + deviceName +'</name>\
            </device>\
          </identifier>\
        </update>\
      </ifmap:subscribe>\
    </SOAP-ENV:Body>\
</SOAP-ENV:Envelope>';
  return message;
};

IFMapCommands.prototype.poll = function(sessionID) {
  var message = '<?xml version="1.0" encoding="utf-8"?>\
  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jnpr="http://www.juniper.net/2008/IFMAP/1" xmlns:meta="http://www.trustedcomputinggroup.org/2006/IFMAP-METADATA/1" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:jnpr2="http://www.juniper.net/2009/IFMAP/1" xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1" xmlns:wsdl="http://www.juniper.net/2008/IFMAP/1/ifmap.wsdl">\
    <SOAP-ENV:Header>\
      <ifmap:session-id>' + sessionID + '</ifmap:session-id>\
    </SOAP-ENV:Header>\
    <SOAP-ENV:Body>\
      <ifmap:poll validation="None"/>\
    </SOAP-ENV:Body>\
</SOAP-ENV:Envelope>';
  return message;
};

IFMapCommands.prototype.deleteUser = function(sessionID,username) {
  username = 'DrBeef';
  var message = '<?xml version="1.0" encoding="utf-8"?>\
  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jnpr="http://www.juniper.net/2008/IFMAP/1" xmlns:meta="http://www.trustedcomputinggroup.org/2006/IFMAP-METADATA/1" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:jnpr2="http://www.juniper.net/2009/IFMAP/1" xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1" xmlns:wsdl="http://www.juniper.net/2008/IFMAP/1/ifmap.wsdl">\
    <SOAP-ENV:Header>\
        <ifmap:session-id>' + sessionID + '</ifmap:session-id>\
    </SOAP-ENV:Header>\
    <SOAP-ENV:Body>\
      <ifmap:publish xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1" xmlns:meta="http://www.trustedcomputinggroup.org/2006/IFMAP- METADATA/1">\
      <delete>\
        <identifier>\
          <identity name="' + username + '" type="username" />\
        </identifier>\
      </delete>\
    </ifmap:publish>\
  </SOAP-ENV:Body>\
</SOAP-ENV:Envelope>';
  return message;
}

IFMapCommands.prototype.setUser = function(sessionID, username) {
  username = 'DrBeef';
  var message = '<?xml version="1.0" encoding="utf-8"?>\
  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jnpr="http://www.juniper.net/2008/IFMAP/1" xmlns:meta="http://www.trustedcomputinggroup.org/2006/IFMAP-METADATA/1" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:jnpr2="http://www.juniper.net/2009/IFMAP/1" xmlns:ifmap="http://www.trustedcomputinggroup.org/2006/IFMAP/1" xmlns:wsdl="http://www.juniper.net/2008/IFMAP/1/ifmap.wsdl">\
    <SOAP-ENV:Header>\
        <ifmap:session-id>' + sessionID + '</ifmap:session-id>\
    </SOAP-ENV:Header>\
    <SOAP-ENV:Body>\
        <ifmap:publish validation="None">\
        <delete>\
        <identifier>\
          <identity name="' + username + '" type="username" />\
        </identifier>\
      </delete>\
            <update>\
                <link>\
                    <identifier>\
                        <identity name="' + username + '" type="username" />\
                    </identifier>\
                    <identifier>\
                        <ip-address value="1.1.1.1" type="IPv4"/>\
                    </identifier>\
                </link>\
                <metadata>\
                    <meta:role>\
                        <name>Guest</name>\
                    </meta:role>\
                    <meta:role>\
                        <name>Contractor</name>\
                    </meta:role>\
                </metadata>\
            </update>\
        </ifmap:publish>\
    </SOAP-ENV:Body>\
</SOAP-ENV:Envelope>';
  return message;
};
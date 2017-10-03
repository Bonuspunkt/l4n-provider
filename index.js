const TlsServer = require('./lib/tlsServer');
const UdpResponder = require('./lib/udpResponder');

module.exports = ({ register, resolve }) => {
    const udpResponder = new UdpResponder(resolve);
    register('udpResponder', () => udpResponder);

    const tlsServer = new TlsServer(resolve);
    register('tlsServer', () => tlsServer);

    udpResponder.listen();
    tlsServer.listen();

    require('./glue/setupTlsResponses')(resolve);
};

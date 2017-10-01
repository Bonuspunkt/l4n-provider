const TlsServer = require('./lib/tlsServer');
const UdpResponder = require('./lib/udpResponder');
const Watchdog = require('./lib/watchdog');

module.exports = ({ register, resolve }) => {
    const udpResponder = new UdpResponder(resolve);
    register('udpResponder', () => udpResponder);

    const tlsServer = new TlsServer(resolve);
    register('tlsServer', () => tlsServer);

    const watchdog = new Watchdog(resolve);
    register('watchdog', () => watchdog);

    udpResponder.listen();
    tlsServer.listen();

    require('./glue/setupTlsResponses')(resolve);
};

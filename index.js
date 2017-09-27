const UdpResponder = require('./lib/udpResponder');
const Watchdog = require('./lib/watchdog');
const { Resolver } = require('l4n-common');

module.exports = function(settings) {
    const { register, resolve } = new Resolver();

    register('settings', () => settings);
    const gameProviders = settings.servers.map(({ name, ...game }) => {
        const provider = require(`l4n-provider-${name}`);
        return provider(game);
    });
    register('gameProviders', () => gameProviders);

    const udpResponder = new UdpResponder({});
    register('udpResponder', () => udpResponder);

    const TlsServer = require('./lib/tlsServer');
    const tlsServer = new TlsServer(resolve);
    register('tlsServer', () => tlsServer);

    const watchdog = new Watchdog();
    register('watchdog', () => watchdog);

    udpResponder.listen();
    tlsServer.listen();

    require('./glue/setupTlsResponses')(resolve);
};

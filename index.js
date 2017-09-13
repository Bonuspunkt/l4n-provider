const UdpResponder = require('./lib/udpResponder');
const { Resolver } = require('l4n-common');

module.exports = function(settings) {
    const { register, resolve } = new Resolver();

    register('settings', () => settings);
    const gameProviders = settings.games.map(game => {
        const provider = require(`l4n-provider-${ game.name }`);
        return provider(game);
    });
    register('gameProviders', () => gameProviders);


    const udpResponder = new UdpResponder({});
    udpResponder.listen();

    const TlsServer = require('./lib/tlsServer');
    const tlsServer = new TlsServer(resolve);
    tlsServer.listen()
};

const UdpResponder = require('./lib/udpResponder');

module.exports = function(settings) {
    const { https, gameProviders } = settings;

    const udpResponder = new UdpResponder();
    udpResponder.listen();

    require('./lib/httpsServer')(https, gameProviders);

};

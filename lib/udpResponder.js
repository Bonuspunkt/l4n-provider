const debug = require('debug')('l4n:provider:udpResponder');
const dgram = require('dgram');

const os = require('os');
const interfaces = os.networkInterfaces();
const defaultIp = Object.keys(interfaces)
    .map(interface => interfaces[interface])
    .reduce((prev, curr) => prev.concat(curr))
    .filter(interface => interface.family === 'IPv4' && !interface.internal)
    .map(interface => interface.address)
    .find(_ => true);

class UdpResponder {
    constructor(resolve) {
        const {
            udpResponder: { message: udpMessage, port: udpPort },
            tlsServer: { port: tlsPort },
        } = resolve('settings');

        const responseMessage = new Buffer(`tls://${defaultIp}:${tlsPort}`);

        const socket = dgram.createSocket('udp4');
        socket.on('message', (msg, { port, address }) => {
            if (!udpMessage.equals(msg)) return;

            socket.send(responseMessage, port, address, () =>
                debug(`responded to ${address}:${port}`),
            );
        });

        this.listen = () => {
            socket.bind(udpPort, () => debug(`started listening at ${defaultIp}:${udpPort}`));
        };

        this.close = () => {
            socket.close(() => debug(`stopped listening`));
        };
    }
}

module.exports = UdpResponder;

const debug = require('debug')('l4n:provider:udpResponder');
const dgram = require('dgram');

class UdpResponder {
    constructor(resolve) {
        const {
            udpResponder: { message: udpMessage, port: udpPort },
            tlsServer: { ip, port: tlsPort },
        } = resolve('settings');

        const responseMessage = new Buffer(`tls://${ip}:${tlsPort}`);

        const socket = dgram.createSocket('udp4');
        socket.on('message', (msg, { port, address }) => {
            if (!udpMessage.equals(msg)) return;

            socket.send(responseMessage, port, address, () =>
                debug(`responded to ${address}:${port}`),
            );
        });

        this.listen = () => {
            socket.bind(udpPort, () => debug(`started listening at ${ip}:${udpPort}`));
        };

        this.close = () => {
            socket.close(() => debug(`stopped listening`));
        };
    }
}

module.exports = UdpResponder;

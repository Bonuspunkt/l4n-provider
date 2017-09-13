const debug = require('debug')('l4n:provider:udpResponder');
const dgram = require('dgram');
const {
    udpServer: { message, port: defaultUdpPort },
    tlsServer: { port: defaultTlsPort },
} = require('l4n-common').defaults;

const os = require('os');
const interfaces = os.networkInterfaces();
const defaultIp = Object.keys(interfaces)
    .map(interface => interfaces[interface])
    .reduce((prev, curr) => prev.concat(curr))
    .filter(interface => interface.family === 'IPv4' && !interface.internal)
    .map(interface => interface.address)
    .find(_ => true);

class UdpResponder {
    constructor({ ip = defaultIp, tlsPort = defaultTlsPort }) {
        this.socket = dgram.createSocket('udp4');
        this.socket.on('message', this.handleMessage.bind(this));

        this.ip = ip;

        this.responseMessage = new Buffer(`tls://${ip}:${tlsPort}`);
    }

    handleMessage(msg, rinfo) {
        if (!message.equals(msg)) {
            return;
        }

        this.socket.send(this.responseMessage, rinfo.port, rinfo.address, () =>
            debug(`responded to ${rinfo.address}:${rinfo.port}`),
        );
    }

    listen(udpPort = defaultUdpPort) {
        this.socket.bind(udpPort, this.ip, () =>
            debug(`started listening at ${this.ip}:${udpPort}`),
        );
    }
}

module.exports = UdpResponder;

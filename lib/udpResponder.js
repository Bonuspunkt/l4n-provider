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

const defaultUdpPort = 19999;
const defaultWebPort = 20000;

const expectedMessage = new Buffer('Hello, is it me you are looking for?');

class UdpResponder {
    constructor(ip = defaultIp, webPort = defaultWebPort) {
        this.socket = dgram.createSocket('udp4');
        this.socket.on('message', this.handleMessage.bind(this));

        this.webPort = webPort;
        this.ip = ip;

        this.responseMessage = new Buffer(`yes go to https://${ ip }:${ webPort }`);
    }

    handleMessage(msg, rinfo) {
        if (!expectedMessage.equals(msg)) { return; }

        this.socket.send(
            this.responseMessage,
            rinfo.port, rinfo.address,
            () => debug(`responded to ${ rinfo.address }:${ rinfo.port }`)
        );
    }

    listen(udpPort = defaultUdpPort) {
        this.socket.bind(
            udpPort, this.ip,
            () => debug(`started listening at ${ this.ip }:${ udpPort }`)
        );
    }
}

module.exports = UdpResponder;

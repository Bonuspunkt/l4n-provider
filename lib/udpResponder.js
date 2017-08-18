const dgram = require('dgram');
const debug = require('debug')('l4n:provider:udpResponder');

const port = 19999;
const ip = '192.168.5.6';
const webPort = 20000;

const expectedMessage = new Buffer('Hello, is it me you are looking for?');
const responseMessage = new Buffer(`yes go to https://${ ip }:${ webPort }`);

const socket = dgram.createSocket('udp4');
socket.on('message', (msg, rinfo) => {
    if (!expectedMessage.equals(msg)) { return; }

    socket.send(responseMessage, rinfo.port, rinfo.address,
        () => debug(`responded to ${ rinfo.address }:${ rinfo.port }`));
});
socket.bind(port, ip, () => debug(`started listening at ${ ip }:${ port }`));

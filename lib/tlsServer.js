const tls = require('tls');
const { EventEmitter } = require('events');
const { MessageParser } = require('l4n-common');
const { port: PORT } = require('l4n-common').defaults.tlsServer;
const debug = require('debug')('l4n:provider:tlsServer');

class TlsServer extends EventEmitter {
    constructor(resolve) {
        super();

        const { port = PORT, ...options } = resolve('settings').tls;
        this.port = port;
        const server = (this.server = tls.createServer(options));
        server.on('secureConnection', this.handleConnection.bind(this));
    }

    handleConnection(socket) {
        socket.on('error', e => debug(e));

        const parser = new MessageParser();
        parser.on('status', () => this.emit('status', socket));
        parser.on('spawn', options => this.emit('spawn', socket, options));

        parser.on('ping', () => socket.write('pong\n'));

        socket.pipe(parser);
    }

    listen() {
        this.server.listen(this.port, () => debug(`listen at port ${this.port}`));
    }
}

module.exports = TlsServer;

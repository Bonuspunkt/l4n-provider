const tls = require('tls');
const { EventEmitter } = require('events');
const { MessageParser } = require('l4n-common');
const debug = require('debug')('l4n:provider:tlsServer');

class TlsServer extends EventEmitter {
    constructor(resolve) {
        super();

        const { port, ...options } = resolve('settings').tlsServer;
        const server = (this.server = tls.createServer(options));
        server.on('secureConnection', this.handleConnection.bind(this));

        this.listen = () => {
            server.listen(port, () => debug(`listen at port ${port}`));
        };
    }

    handleConnection(socket) {
        socket.on('error', e => debug(e));

        const parser = new MessageParser();
        parser.on('status', () => this.emit('status', socket));
        parser.on('spawn', options => this.emit('spawn', socket, options));

        parser.on('ping', () => socket.write('pong\n'));

        socket.pipe(parser);
    }
}

module.exports = TlsServer;

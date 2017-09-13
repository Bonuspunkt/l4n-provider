const tls = require('tls');
const { EventEmitter } = require('events');
const debug = require('debug')('l4n:provider:tlsServer');

const PORT = 20000;

class TlsServer extends EventEmitter {
    constructor(resolve) {
        super();

        const { port = PORT, options = {} } = resolve('settings').tls;
        const server = this.server = tls.createServer(options);
        server.on('secureConnection', this.handleConnection)
    }

    handleConnection(socket) {

        const parser = new MessageParser();
        parser.on('list', () => this.emit('list', socket));
        parser.on('spawn', options => this.emit('spawn', socket, options));

        parser.on('ping', () => socket.write('pong\n'));

        socket.pipe(parser);
    }

    listen() {
        this.server.listen(this.port, () => debug(`listen at port ${ this.port }`));
    }
}

module.exports = TlsServer;

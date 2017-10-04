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

        const write = (command, argument) => {
            if (!argument) {
                socket.write(`${command}\n`);
            } else {
                socket.write(`${command} ${JSON.stringify(argument)}\n`);
            }
        };

        const parser = new MessageParser();
        parser.on('status', () => this.emit('status', { write }));
        parser.on('spawn', options => this.emit('spawn', { write, options }));

        parser.on('ping', () => write('pong'));

        socket.pipe(parser);
    }
}

module.exports = TlsServer;

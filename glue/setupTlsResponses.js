module.exports = function(resolve) {
    const tlsServer = resolve('tlsServer');

    const status = require('../lib/route/status')(resolve);
    const spawn = require('../lib/route/spawn')(resolve);

    tlsServer.on('status', socket => status(socket));
    tlsServer.on('spawn', spawn);
};

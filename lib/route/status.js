const debug = require('debug')('l4n:provider:route:status');
const os = require('os');
const hostname = os.hostname();

module.exports = resolve => {
    debug('init');

    const gameProviders = resolve('gameProviders');
    const result = {
        name: hostname,
        servers: gameProviders
            .map(provider => provider.servers)
            .reduce((prev, curr) => prev.concat(curr)),
    };

    return writableStream => {
        debug('status reply', result);
        writableStream.write(`status ${JSON.stringify(result)}\n`);
    };
};

const debug = require('debug')('l4n:provider:route:status');

module.exports = resolve => {
    debug('init');

    const { hostname } = resolve('settings');
    const providers = resolve('providers');

    const result = {
        name: hostname,
        servers: providers
            .map(provider => provider.servers)
            .reduce((prev, curr) => prev.concat(curr)),
    };

    return writableStream => {
        debug('status reply', result);
        writableStream.write(`status ${JSON.stringify(result)}\n`);
    };
};

const debug = require('debug')('l4n:provider:route:status');
const os = require('os');
const hostname = os.hostname();

module.exports = resolve => {
    debug('init');

    const gameProviders = resolve('gameProviders');
    const result = {
        name: hostname,
        games: gameProviders.map(provider => ({
            ...provider.definition,
            lobbyDefinition: provider.lobbyDefinition,
        })),
    };

    return writableStream => {
        debug('status reply', result);
        writableStream.write(`status ${JSON.stringify(result)}\n`);
    };
};

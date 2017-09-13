const os = require('os');
const hostname = os.hostname();
const start = `${ Date.now() }`;

module.exports = (resolve) => {
    const gameProviders = resolve('gameProviders');
    const result = {
        name: hostname,
        games: gameProviders.map(provider => ({
            ...provider.definition,
            lobbyDefinition: provider.lobbyDefinition
        }))
    };

    return (writableStream) => {
        writableStream.write(`list ${ JSON.stringify(result) }\n`);
    };
};

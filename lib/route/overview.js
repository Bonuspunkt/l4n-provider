const os = require('os');
const hostname = os.hostname();
const start = `${ Date.now() }`;

module.exports = function(providers) {
    return (req, res) => {
        const headers = {
            'content-type': 'application/json',
            etag: start
        };

        console.log(req.headers)

        if (req.headers['if-none-match'] === start) {
            res.writeHead(304, headers)
            res.end();
            return;
        }

        res.writeHead('200', headers);
        const result = {
            name: hostname,
            games: providers.map(provider => ({
                ...provider.definition,
                lobbyDefinition: provider.lobbyDefinition
            }))
        };
        res.end(JSON.stringify(result));
    };
};

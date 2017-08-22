const https = require('https');
const debug = require('debug')('l4n:provider:httpServer');

const serverList = require('./route/serverList');

const port = 20000;

module.exports = function(options) {
    const server = https.createServer(options);
    server.on('request', (req, res) => {
        debug(`${ req.method } ${ req.url }`);

        if (req.method === 'GET' && req.url === '/') {
            return serverList(res);
        }
        if (req.method === 'POST' && req.url === '/spawn') {
            return spawnServer()
        }
        res.writeHead(404, { 'content-type': 'text/plain' });
        res.end('not found');
    });
    server.listen(
        port,
        () => debug(`listening at ${port}`)
    );
    return server;
}

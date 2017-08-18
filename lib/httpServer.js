const https = require('https');
const debug = require('debug')('l4n:provider:httpServer');

const serverList = require('./route/serverList');

const port = 20000;

// --
const fs = require('fs');
const path = require('path');

const key = fs.readFileSync(path.resolve(__dirname, '../keys/key.pem'));
const cert = fs.readFileSync(path.resolve(__dirname, '../keys/cert.pem'));
// --

const server = https.createServer({
    rejectUnauthorized: false,
    key, cert
});
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

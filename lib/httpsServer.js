const https = require('https');
const debug = require('debug')('l4n:provider:httpsServer');

const router = require('http-router');

const routeOverview = require('./route/overview');
const routeSpawn = require('./route/spawn')

const port = 20000;

module.exports = function(options, gameProviders) {

    const routes = router.createRouter();
    routes.get('/', routeOverview(gameProviders));
    routes.post('/server', routeSpawn(gameProviders));

    const server = https.createServer(options);
    server.on('request', (req, res) => {
        debug(`${ req.method } ${ req.url }`);

        if (!routes.route(req, res)) {
            res.writeHead(404, { 'content-type': 'text/plain' });
            res.end('not found');
        }
    });
    server.listen(
        port,
        () => debug(`listening at ${port}`)
    );

    return server;
};

const fs = require('fs');

module.exports = {
    https: {
        ca: fs.readFileSync('ca-crt.pem'),
        key: fs.readFileSync('server-key.pem'),
        cert: fs.readFileSync('server-crt.pem'),
        requestCert: true,
        rejectUnauthorized: true
    },
    gameServers: [{
        name: 'csgo',
        workingDir: 'C:/SteamCMD/servers/csgo',
        // not needed for lan but for workshop
        keyPool: [
            'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        ],
    }, {
        name: 'l4d2',
        workingDir: 'C:/SteamCMD/servers/l4d2',
    }]
};

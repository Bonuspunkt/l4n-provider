// .\steamcmd +login anonymous +force_install_dir ./servers/csgo +app_update 740 +quit
// .\steamcmd +login anonymous +force_install_dir ./servers/l4d +app_update 222840 +quit
// .\steamcmd +login anonymous +force_install_dir ./servers/l4d2 +app_update 222860 +quit
// .\steamcmd +login anonymous +force_install_dir ./servers/tf2 +app_update 232250 +quit

// .\steamcmd +login anonymous +force_install_dir ./servers/reflexArena +app_update 329740 +quit
// .\steamcmd +login anonymous +force_install_dir ./servers/seriousSam3 +app_update 41080 +quit

module.exports = {
    https: {
        //key,
        //cert
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
        workingDir: 'E:/SteamCMD/servers/l4d2',
    }]
};

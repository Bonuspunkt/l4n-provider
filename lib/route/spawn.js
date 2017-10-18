const debug = require('debug')('l4n:provider:routes:spawn');
const { spawn } = require('child_process');
const os = require('os');
const platform = os.platform();

module.exports = function(resolve) {
    const providers = resolve('providers');
    const { tlsServer: { ip } } = resolve('settings');

    const ports = {};

    return ({ write, options: lobby }) => {
        const { game, mode } = lobby;

        const gameProvider = providers.find(p =>
            p.servers.some(({ lobby }) => lobby.game === game && lobby.mode === mode),
        );

        const getPort = () => {
            const [start, end] = gameProvider.portRange;
            for (let port = start; port <= end; port++) {
                if (!ports[port]) return port;
            }
            throw Error('could not find an available port');
        };

        const port = getPort();

        const args = gameProvider.getArgs({ lobby, port });

        const command = gameProvider.command[platform];

        const identifier = `${gameProvider.options.cwd}/${command} ${JSON.stringify(args)}`;

        debug(`spawning ${identifier}`);
        const childProcess = spawn(command, args, gameProvider.options);
        childProcess.on('exit', () => {
            debug(`exit ${identifier}`);
            ports[port] = null;
            write('destroy', { lobbyId: lobby.id });
            if (gameProvider.onDestroy) {
                gameProvider.onDestroy({ lobby, port });
            }
        });

        const privateInfo = `# [join](steam://connect/${ip}:${port})`;

        write('spawned', { lobbyId: lobby.id, privateInfo });

        // loop till query response
        // 5min till first check
        // then check every 30sec

        let justLaunched = true;
        const check = () => {
            setTimeout(async () => {
                justLaunched = false;
                try {
                    const { players, maxPlayers } = await gameProvider.query({ port });
                    debug(`check ${identifier} ${players}/${maxPlayers}`);
                    if (players < 2) {
                        childProcess.kill();
                    }
                    check();
                } catch (e) {
                    // query failed - maybe stuck?
                    childProcess.kill();
                }
            }, justLaunched ? 300e3 : 30e3);
        };
        check();
    };
};

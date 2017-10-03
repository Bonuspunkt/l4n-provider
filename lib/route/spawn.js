const debug = require('debug')('l4n:provider:routes:spawn');
const { spawn } = require('child_process');
const os = require('os');
const platform = os.platform();

module.exports = function(resolve) {
    const providers = resolve('providers');
    const { tlsServer: { ip } } = resolve('settings');

    const ports = {};

    return (writable, lobby) => {
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

        const command = gameProvider.launch[platform];
        if (!command) return;

        const identifier = `${gameProvider.workingDir}/${command} ${JSON.stringify(args)}`;

        debug(`spawning ${identifier}`);
        const childProcess = spawn(command, args, { cwd: gameProvider.workingDir });
        childProcess.on('exit', () => {
            debug(`exit ${identifier}`);
            ports[port] = null;
            writable.write(`destroy ${JSON.stringify({ lobby: lobby.id })}\n`);
        });

        const privateInfo = `# [join](steam://connect/${ip}:${port})`;

        writable.write(`spawned ${JSON.stringify({ lobbyId: lobby.id, privateInfo })}\n`);

        let justLaunched = true;
        const check = () => {
            setTimeout(async () => {
                justLaunched = false;
                try {
                    const { players, maxPlayers } = await gameProvider.query(port);
                    debug(`check ${players}/${maxPlayers}`);
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

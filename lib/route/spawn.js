

module.exports = function(providers) {
    return (req, res) => {
        const buffers = [];
        req.on('data', chunk => buffers.push(chunk));
        req.on('end', () => {

            const buffer = Buffer.concat(buffers);
            //const lobbyDefinition = JSON.parse(buffer);

            const lobbyDefinition = {
                mode: 'Classic Casual',
                hostname: 'RL Simulator 2020',
            };

            watchdog.spawn({
                provider,
                lobbyDefinition
            });

            res.end('{}');
        })
    };
};
/*
const { spawn } = require('child_process');

module.exports = function() {
    const options = {
        cwd: '',
        stdio: 'pipe',
    };

    const process = spawn('command', ['arg0', 'arg1', 'arg2'], options);
    process.stdin
    process.stdout
    process.stderr

    return {
        kill: () => process.kill(),
        getState: () => {
            return new Promise((resolve, reject) => {

            });
        }
    }
}
*/

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
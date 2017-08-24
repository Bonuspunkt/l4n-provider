const debug = require('debug')('l4n:provider:watchdog');
const os = require('os');
const { EventEmitter } = require('events');
const { spawn } = require('child_process');

const refreshInterval = 5e3;

class Watchdog extends EventEmitter {
    constructor(providers) {
        super();
        this.providers = providers;
        this.spawned = [];

        process.on('uncaughtException', error => {
            this.teardown();
            throw error;
        });
        process.on('exit', code => {
            this.teardown();
        });

        setInterval(() => this.refresh(), refreshInterval);
    }

    teardown() {
        this.spawned.forEach(process => process.kill());
    }

    refresh() {
        this.spawned.forEach(spawned => {
            spawned.query
        })
    }

    spawn(config) {
        const provider = this.providers.find(p => p.providerId === config.providerId);
        const { launch, lobbySettingsToArgs, workingDir, query } = provider;

        const platform = os.platform();
        const command = launch[platform];
        if (!command) {
            return Promise.reject(Error('os is not supported'));
        }

        const args = lobbySettingsToArgs(config, generator);

        const child = spawn(
            command,
            args,
            { cwd: workingDir, stdio: 'pipe' }
        );
        child.on('exit', () => {
            debugger;
        });

        this.spawned.push({ child, query, lastValid: Date.now() });
    }
};

module.exports = Watchdog;

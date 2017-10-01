#!/usr/bin/env node
/* eslint no-console: 0 */
const debug = require('debug')('l4n:provider:cli');
const fs = require('fs');
const os = require('os');
const path = require('path');

const cwd = process.cwd();

const templatePattern = /\$\{([^}]+)\}/g;
const [, , /*executable*/ /*script*/ command = '', arg] = process.argv;

switch (command.toLowerCase()) {
    case 'init':
        return init();

    default:
        return help();
}

////////////////////////////////////////////////////////////////////////////////
function init() {
    const nodeModulesDir = path.resolve(cwd, 'node_modules');

    debug(`searching modules in ${nodeModulesDir}`);

    const modules = fs
        .readdirSync(nodeModulesDir)
        .filter(module => /^l4n-provider-/i.test(module))
        .sort();
    debug(`found modules ${modules.join(', ')}`);

    const outputPath = path.resolve(cwd, 'settings.js');
    debug(`writing settings to '${outputPath}'`);
    if (fs.existsSync(outputPath) && arg !== '--force') {
        return console.error('settings.js exists. use --force');
    }

    const template = fs.readFileSync(
        path.resolve(__dirname, 'templates/settings.template'),
        'utf8',
    );

    const interfaces = os.networkInterfaces();

    const settingsContent = template.replace(templatePattern, (_, capture) => {
        switch (capture) {
            case 'hostname':
                return JSON.stringify(os.hostname());

            case 'ip':
                return Object.keys(interfaces)
                    .map(interface => interfaces[interface])
                    .reduce((prev, curr) => prev.concat(curr))
                    .filter(interface => interface.family === 'IPv4' && !interface.internal)
                    .map(interface => JSON.stringify(interface.address))
                    .find(_ => true);

            case 'providers':
                return modules
                    .map(module => path.resolve(nodeModulesDir, module, 'settings.template'))
                    .filter(templatePath => fs.existsSync(templatePath))
                    .map(templatePath => fs.readFileSync(templatePath, 'utf8'))
                    .join('');
            default:
                throw Error(`'${capture}' can not be resolved`);
        }
    });

    fs.writeFileSync(outputPath, settingsContent);

    const indexPath = path.resolve(cwd, 'index.js');
    debug(`writing index to ${indexPath}`);
    fs.copyFile(path.resolve(__dirname, 'templates/index.template'), indexPath, err => {
        if (err) throw err;
    });
}
////////////////////////////////////////////////////////////////////////////////
function help() {
    console.log('usage:');
    console.log('');
    console.log('l4n-provider init [--force]');
    console.log('    generates index.js and settings.js');
    console.log('    use `--force` to override existing file');
    console.log('');
}

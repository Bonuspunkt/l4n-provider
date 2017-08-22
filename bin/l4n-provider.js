#!/usr/bin/env node
const debug = require('debug')('l4n:provider:cli');
const l4nProvider = require('../');
const fs = require('fs');
const path = require('path');

const settings = process.argv[1];

if (!settings) {
    return console.log('Usage: l4n-provider <settings.js>');
}
const settingPath = path.resolve(settings);
debug(`settings.js resolved to '${ settingPath }'`);

if (!fs.existsSync(settingPath)) {
    return console.log(`settings.js was not found at ${ settingPath }`);
}

l4nProvider(require(settingPath));

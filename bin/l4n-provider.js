#!/usr/bin/env node
const debug = require('debug')('l4n:provider:cli');
const l4nProvider = require('../');
const fs = require('fs');
const path = require('path');

const settingsFile = process.argv[2];

if (!settingsFile) {
    return console.log('Usage: l4n-provider <settings.js>');
}
const settingsPath = path.resolve(settingsFile);
debug(`settings.js resolved to '${settingsPath}'`);

if (!fs.existsSync(settingsPath)) {
    return console.log(`settings.js was not found at ${settingsPath}`);
}

const settings = require(settingsPath);
l4nProvider(settings);

const core = require('@actions/core');
const { hashString } = require('./hash');

const value = core.getInput('value', { required: true });
const salty = core.getInput('salty', { required: true });

const hashed = hashString(value, salty);
core.setOutput('hashed', hashed);

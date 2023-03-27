const path = require('path');
const { Command } = require('commander');
const { yeomanEnv } = require('../global');

const name = 'configure';

yeomanEnv.register(require.resolve(path.join(__dirname, '../..', 'generators', name.toString())), `mmm:${name}`);

const generator = yeomanEnv.create(`mmm:${name}`, {
	args: {},
});
generator.destinationRoot('.');

const cmd = new Command(name);
cmd.description('Mommos CLI 설정');
cmd.alias('conf');
cmd.action(() => {
	generator.run();
});

module.exports = cmd;

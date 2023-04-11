const path = require('path');
const { Command } = require('commander');
const { yeomanEnv } = require('../global');

const name = 'update';

yeomanEnv.register(require.resolve(path.join(__dirname, '../..', 'generators', name.toString())), `mmm:${name}`);

const generator = yeomanEnv.create(`mmm:${name}`, {
	args: {},
});
generator.destinationRoot('.');

const cmd = new Command(name);
cmd.description('Mommos CLI 버전 업데이트');
cmd.alias('up');
cmd.action(() => {
	generator.run();
});

module.exports = cmd;

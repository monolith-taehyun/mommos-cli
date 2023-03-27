const path = require('path');
const { Command } = require('commander');
const { yeomanEnv } = require('../global');

const name = 'topic';

yeomanEnv.register(require.resolve(path.join(__dirname, '../..', 'generators', name.toString())), `mmm:${name}`);

const generator = yeomanEnv.create(`mmm:${name}`, {
	args: {},
});
generator.destinationRoot('.');

const cmd = new Command(name);
cmd.description('Topic 생성');
cmd.alias('tp');
cmd.action(() => {
	generator.run();
});

module.exports = cmd;

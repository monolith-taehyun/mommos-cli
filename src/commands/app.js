const path = require('path');
const fs = require('fs').promises;
const { Command, Option } = require('commander');
const { yeomanEnv } = require('../global');

const name = 'app';

yeomanEnv.register(require.resolve(path.join(__dirname, '../..', 'generators', name.toString())), `mmm:${name}`);

const generator = yeomanEnv.create(`mmm:${name}`, {
	args: {},
});
generator.destinationRoot('.');

const cmd = new Command(name);
cmd.description('Mommos 기반 Application 생성');
cmd.alias('ap');
cmd.action((options) => {
	generator.run();
});

const createCommand = new Command('create');
createCommand.description('Create Application');
createCommand.addOption(new Option('-n, --name <name>', 'Application name'));
createCommand.action((options) => {
	generator['appName'] = options?.name;
	generator.run();
});
cmd.addCommand(createCommand);

module.exports = cmd;

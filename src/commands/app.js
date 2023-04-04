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

// mmm app create
const createCommandName = `create`;
const createGeneratorName = `${name}-${createCommandName}`;

yeomanEnv.register(
	require.resolve(path.join(__dirname, '../..', 'generators', createGeneratorName)),
	`mmm:${createGeneratorName}`,
);

const createGennertator = yeomanEnv.create(`mmm:${createGeneratorName}`, {
	args: {},
});

createGennertator.destinationRoot('.');

const createCommand = new Command(createCommandName);
createCommand.description('Create Application');
createCommand.addOption(new Option('-n, --name <name>', 'Application name'));
createCommand.alias('c');
createCommand.action((name) => {
	generator['appName'] = options?.name;
	createGennertator.run();
});
cmd.addCommand(createCommand);

module.exports = cmd;

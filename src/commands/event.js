const path = require('path');
const { Command, Argument } = require('commander');
const { yeomanEnv } = require('../global');

const name = 'event';

yeomanEnv.register(require.resolve(path.join(__dirname, '../..', 'generators', name.toString())), `mmm:${name}`);

const generator = yeomanEnv.create(`mmm:${name}`, {
	args: {},
});
generator.destinationRoot('.');

const cmd = new Command(name);
cmd.description('Event 생성');
cmd.alias('ev');
cmd.action(() => {
	generator.run();
});

// mmm event topic
const topicCommandName = `topic`;
const topicGeneratorName = `${name}-${topicCommandName}`;

yeomanEnv.register(
	require.resolve(path.join(__dirname, '../..', 'generators', topicGeneratorName)),
	`mmm:${topicGeneratorName}`,
);

const topicGennertator = yeomanEnv.create(`mmm:${topicGeneratorName}`, {
	args: {},
});

topicGennertator.destinationRoot('.');

const topicCommand = new Command(topicCommandName);
topicCommand.description('create event topic');
topicCommand.alias('tp');
topicCommand.addArgument(new Argument('[name', 'Topic name', ''));
topicCommand.action((name) => {
	topicGennertator['topicName'] = name;
	topicGennertator.run();
});
cmd.addCommand(topicCommand);

module.exports = cmd;

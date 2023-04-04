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
topicCommand.addArgument(new Argument('[name]', 'Topic name', ''));
topicCommand.action((name) => {
	topicGennertator['topicName'] = name;
	topicGennertator.run();
});
cmd.addCommand(topicCommand);

// mmm event mapping
const mappingCommandName = `mapping`;
const mappingGeneratorName = `${name}-${mappingCommandName}`;

yeomanEnv.register(
	require.resolve(path.join(__dirname, '../..', 'generators', mappingGeneratorName)),
	`mmm:${mappingGeneratorName}`,
);

const mappingGennertator = yeomanEnv.create(`mmm:${mappingGeneratorName}`, {
	args: {},
});

mappingGennertator.destinationRoot('.');

const mappingCommand = new Command(mappingCommandName);
mappingCommand.description('create event mapping');
mappingCommand.alias('map');
mappingCommand.action((name) => {
	mappingGennertator.run();
});
cmd.addCommand(mappingCommand);

module.exports = cmd;

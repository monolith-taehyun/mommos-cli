const path = require('path');
const { Command, Argument } = require('commander');
const { yeomanEnv } = require('../global');
const KafkaClient = require('../kafka');

const name = 'kafka';

const cmd = new Command(name);
cmd.description('Kafka 요청');
cmd.alias('k');

const topicCommandName = 'kafka-topic';
yeomanEnv.register(
	require.resolve(path.join(__dirname, '../..', 'generators', topicCommandName)),
	`mmm:${topicCommandName}`,
);

const kafkaTopicGennertator = yeomanEnv.create(`mmm:${topicCommandName}`, {
	args: {},
});
kafkaTopicGennertator.destinationRoot('.');

const topicCommand = new Command('topic');
topicCommand.description('Kafka Topic Command');
topicCommand.addArgument(new Argument('<action>', 'Kafka topic action command', '').choices(['create', 'delete']));

const topicCreateCommand = new Command('create');
topicCreateCommand.description('Kafka Topic Command');
topicCreateCommand.addArgument(new Argument('[name]', 'Topic name', ''));
topicCreateCommand.action((action, name) => {
	kafkaTopicGennertator['topicName'] = name;
	kafkaTopicGennertator.run();
});
topicCommand.addCommand(topicCreateCommand);

const topicListCommand = new Command('list');
topicListCommand.description('List Topics');
topicListCommand.action(async (action, name) => {
	await KafkaClient.listTopics();
});
topicCommand.addCommand(topicListCommand);

cmd.addCommand(topicCommand);

module.exports = cmd;

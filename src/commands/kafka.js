const path = require('path');
const fs = require('fs');
const { Command, Argument } = require('commander');
const chalk = require('chalk');
const { yeomanEnv } = require('../global');
const KafkaClient = require('../kafka');

const getKafkaConnectionData = (dir) => {
	const mmmrc = path.join(dir, '.mmmrc');
	const existsRc = fs.existsSync(mmmrc);
	const rcData = existsRc ? JSON.parse(fs.readFileSync(mmmrc)) : null;

	if (!existsRc || !rcData?.kafka) {
		console.log(
			'현재 디렉토리에 Kafka 접속 정보가 없습니다.',
			chalk.yellow('mmm kafka configure'),
			'명령어로 접속 정보를 추가하세요.',
		);
		process.exit(1);
	}
	return rcData.kafka;
};

const name = 'kafka';

const cmd = new Command(name);
cmd.description('Kafka 요청');
cmd.alias('k');

//----------------------------------------
// mmm kafka configure
//----------------------------------------
const configCommandName = 'configure';
const configGeneratorName = `${name}-${configCommandName}`;
yeomanEnv.register(
	require.resolve(path.join(__dirname, '../..', 'generators', configGeneratorName)),
	`mmm:${configGeneratorName}`,
);
const kafkaConfigGenertator = yeomanEnv.create(`mmm:${configGeneratorName}`, {
	args: {},
});
kafkaConfigGenertator.destinationRoot('.');

const configCommand = new Command(configCommandName);
configCommand.description('Kafka Configure');
configCommand.alias('conf');
configCommand.action(() => {
	kafkaConfigGenertator.run();
});
cmd.addCommand(configCommand);

//----------------------------------------
// mmm kafka topic
//----------------------------------------
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
topicCommand.alias('tp');

//----------------------------------------
// mmm kafka topic create [name]
//----------------------------------------
const createCommandName = 'create';
const createGeneratorName = `${topicCommandName}-${createCommandName}`;
yeomanEnv.register(
	require.resolve(path.join(__dirname, '../..', 'generators', createGeneratorName)),
	`mmm:${createGeneratorName}`,
);
const kafkaTopicCreateGennertator = yeomanEnv.create(`mmm:${createGeneratorName}`, {
	args: {},
});
kafkaTopicCreateGennertator.destinationRoot('.');

const topicCreateCommand = new Command(createCommandName);
topicCreateCommand.description('Kafka Topic Command');
topicCreateCommand.alias('c');
topicCreateCommand.addArgument(new Argument('[name]', 'Topic name', ''));
topicCreateCommand.action((name) => {
	kafkaTopicCreateGennertator['topicName'] = name;
	kafkaTopicCreateGennertator.run();
});
topicCommand.addCommand(topicCreateCommand);

//----------------------------------------
// mmm kafka topic list
//----------------------------------------
const topicListCommand = new Command('list');
topicListCommand.description('List Topics');
topicListCommand.alias('ls');
topicListCommand.action(async () => {
	await new KafkaClient(getKafkaConnectionData('.')).listTopics();
});
topicCommand.addCommand(topicListCommand);

//----------------------------------------
// mmm kafka topic delete [name]
//----------------------------------------
const topicDeleteCommand = new Command('delete');
topicDeleteCommand.description('Delete Topic');
topicDeleteCommand.alias('del');
topicDeleteCommand.addArgument(new Argument('<name>', 'Topic name', ''));
topicDeleteCommand.action(async (name) => {
	await new KafkaClient(getKafkaConnectionData('.')).deleteTopic(name);
});
topicCommand.addCommand(topicDeleteCommand);

cmd.addCommand(topicCommand);

module.exports = cmd;

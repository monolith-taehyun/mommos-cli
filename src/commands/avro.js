const path = require('path');
const { Command, Argument } = require('commander');
const { yeomanEnv } = require('../global');

const name = 'avro';

yeomanEnv.register(require.resolve(path.join(__dirname, '../..', 'generators', name.toString())), `mmm:${name}`);

const generator = yeomanEnv.create(`mmm:${name}`, {
	args: {},
});
generator.destinationRoot('.');

const cmd = new Command(name);
cmd.description('Avro 파일 생성');
cmd.alias('av');
cmd.action(() => {
	generator.run();
});

// mmm avro register
const registerCommandName = `register`;
const registerGeneratorName = `${name}-${registerCommandName}`;

yeomanEnv.register(
	require.resolve(path.join(__dirname, '../..', 'generators', registerGeneratorName)),
	`mmm:${registerGeneratorName}`,
);

const avroRegisterGennertator = yeomanEnv.create(`mmm:${registerGeneratorName}`, {
	args: {},
});

avroRegisterGennertator.destinationRoot('.');

const avroRegisterCommand = new Command(registerCommandName);
avroRegisterCommand.description('Register avro to schema registry');
avroRegisterCommand.alias('reg');
avroRegisterCommand.addArgument(new Argument('<path>', 'Avro file path', ''));
avroRegisterCommand.action((path) => {
	avroRegisterGennertator['avroFilePath'] = path;
	avroRegisterGennertator.run();
});
cmd.addCommand(avroRegisterCommand);

// mmm avro download
const downloadCommandName = `download`;
const downloadGeneratorName = `${name}-${downloadCommandName}`;

yeomanEnv.register(
	require.resolve(path.join(__dirname, '../..', 'generators', downloadGeneratorName)),
	`mmm:${downloadGeneratorName}`,
);

const avroDownloadGennertator = yeomanEnv.create(`mmm:${downloadGeneratorName}`, {
	args: {},
});

avroDownloadGennertator.destinationRoot('.');

const avroDownloadCommand = new Command(downloadCommandName);
avroDownloadCommand.description('Download avro files');
avroDownloadCommand.alias('down');
avroDownloadCommand.action((path) => {
	avroDownloadGennertator.run();
});
cmd.addCommand(avroDownloadCommand);

module.exports = cmd;

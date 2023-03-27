const path = require('path');
const { Command } = require('commander');
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

module.exports = cmd;

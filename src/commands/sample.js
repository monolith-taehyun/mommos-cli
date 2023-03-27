const path = require('path');
const fs = require('fs').promises;
const { Command } = require('commander');
const { yeomanEnv } = require('../global');

const name = 'sample';

yeomanEnv.register(require.resolve(path.join(__dirname, '../..', 'generators', name.toString())), `mmm:${name}`);

const generator = yeomanEnv.create(`mmm:${name}`, {
	args: {},
});
generator.destinationRoot('.');

const cmd = new Command(name);
cmd.description('샘플 텍스트 파일 생성');
cmd.alias('sam');
cmd.action((options) => {
	generator.run();
});

module.exports = cmd;

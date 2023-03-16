#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const env = require('yeoman-environment').createEnv();

program
	.version('0.1.0')
	.description('Command Line Interface of Mommos Application');

const generators = {
	app: {
		name: 'app',
		alias: 'a',
		args: {},
		destinationRoot: '.',
		descripttion: 'Mommos 기반 Application 생성',
	},
	sample: {
		name: 'sample',
		alias: 's',
		args: {},
		destinationRoot: '.',
		descripttion: '샘플 텍스트 파일 생성',
	},
};

Object.entries(generators).forEach(([name, v]) => {
	env.register(
		require.resolve(path.join(__dirname, '..', 'generators', name.toString())),
		`mmm:${name}`,
	);
	v.generator = env.create(`mmm:${name}`, {
		args: v.args,
	});
	v.generator.destinationRoot(v.destinationRoot);

	program
		.command(name)
		.alias(v.alias)
		.description(v.descripttion)
		.action(() => {
			v.generator.run();
		});
});

program.parse(process.argv);

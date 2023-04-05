'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { SchemaRegistry, SchemaType } = require('@kafkajs/confluent-schema-registry');
const { writeJsonWithoutDuplicates } = require('../../src/utils');

class Configure extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.env = opts.env;
	}

	initializing() {
		if (
			this.env._rootGenerator._namespace !== 'mmm:app' &&
			!fs.existsSync(path.resolve(this.destinationPath(), 'build.gradle'))
		) {
			console.error(chalk.redBright('명령어 실행 위치는 Mommos 애플리케이션 root여야 합니다.'));
			process.exit(1);
		}

		this.composeWith('mmm:kafka-configure');
	}

	async prompting() {
		console.log(chalk.yellow('::Schema Registry 설정::'));
		const schemaRegistryAsks = (
			await this.prompt({
				name: 'configureSchemaRegistry',
				type: 'confirm',
				message: 'Schema Registry 정보를 설정하시겠습니까?',
				default: `y`,
			})
		).configureSchemaRegistry
			? [
					{
						name: 'schemaRegistryUrl',
						type: 'input',
						message: 'Schema Registry URL을 입력하세요.',
						default: `http://localhost:8081`,
					},
					{
						name: 'schemaRegistryApiKey',
						type: 'password',
						message: 'Schema Registry API Key를 입력하세요.',
						default: `***`,
					},
					{
						name: 'schemaRegistryApiSecret',
						type: 'password',
						message: 'Schema Registry API Secret을 입력하세요.',
						default: `***`,
					},
			  ]
			: [];

		this.answers = {
			...(await this.prompt(schemaRegistryAsks)),
		};
	}

	writing() {
		const mmmrcPath = path.join(this.destinationPath(), '.mmmrc');
		const config = this.answers;
		writeJsonWithoutDuplicates(mmmrcPath, config);
	}
}

module.exports = Configure;

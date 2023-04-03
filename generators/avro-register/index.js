'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { genVariousCases, getConfigJson } = require('../../src/utils');

const { SchemaRegistry, SchemaType } = require('@kafkajs/confluent-schema-registry');

class AvroRegister extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.env = opts.env;
	}

	async initializing() {
		if (!fs.existsSync(path.resolve(this.destinationPath(), 'build.gradle'))) {
			console.error(chalk.redBright('명령어 실행 위치는 Mommos 애플리케이션 root여야 합니다.'));
			process.exit(1);
		}

		const mmmrc = path.join(this.destinationPath(), '.mmmrc');
		const existsRc = fs.existsSync(mmmrc);
		if (existsRc) {
			this.rcData = JSON.parse(fs.readFileSync(mmmrc));
		}

		if (!existsRc || !this.rcData?.schemaRegistryUrl) {
			this.composeWith('mmm:configure');
		}
	}

	async prompting() {
		console.log(chalk.yellow('::Schema Registry 등록::'));

		await this.spawnCommand('cat', [this.avroFilePath]);
		this.answers = await this.prompt({
			name: 'isRegister',
			type: 'confirm',
			message: `${chalk.yellow(
				'Schema Registry URL:' + this.rcData?.schemaRegistryUrl,
			)}\nAvro 파일을 위 Schema Registry에 등록하시겠습니까?`,
			default: `y`,
		});
	}

	async writing() {
		const _self = this;
		if (this.answers.isRegister) {
			const config = getConfigJson(path.join(this.destinationPath(), '.mmmrc'));
			const registry = new SchemaRegistry({
				host: config?.schemaRegistryUrl,
				auth: {
					username: config?.schemaRegistryApiKey,
					password: config?.schemaRegistryApiSecret,
				},
			});
			try {
				const fileData = fs.readFileSync(this.avroFilePath, 'utf8');
				const avroData = JSON.parse(fileData);
				const result = await registry.register(
					{
						type: SchemaType.AVRO,
						schema: JSON.stringify(avroData),
					},
					{ subject: avroData.name },
				);
				console.log('result', result);
			} catch (err) {
				console.log('schema register err', err);
			}
		}
	}
}

module.exports = AvroRegister;

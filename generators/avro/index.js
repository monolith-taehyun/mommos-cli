'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { genVariousCases, getConfigJson } = require('../../src/utils');

const { SchemaRegistry, SchemaType } = require('@kafkajs/confluent-schema-registry');

class Avro extends Generator {
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
		console.log(chalk.yellow('::Avro 파일 생성::'));

		const initAsks = [
			{
				name: 'namespace',
				type: 'input',
				message: '사용하고자 하는 네임스페이스(패키지)명을 알려주세요.',
				default: `${this.rcData?.package || 'kr.co.monolith.park'}.avro`,
			},
			{
				name: 'avroSchemaPrefix',
				type: 'input',
				message: `사용하고자 하는 Prefix(플랫폼 키 등)를 알려주세요.(예시: 'eda-sgp, eda-cju')`,
				default: `${this.rcData?.prefix || 'eda-sgp'}`,
			},
			{
				name: 'avroType',
				type: 'list',
				message: 'Avro의 유형을 선택하세요.',
				choices: [
					{
						name: 'Command',
						value: 'Command',
					},
					{
						name: 'Get',
						value: 'Get',
					},
					{
						name: 'Event',
						value: 'Event',
					},
					{
						name: 'Topic value',
						value: 'Topic Value',
					},
				],
				default: 0,
			},
			{
				name: 'eventName',
				type: 'input',
				message: `Avro를 사용할 이벤트명을 입력하세요. Event와 Avro는 생략합니다.(예시: 'CreateTeam', 'create team', 'create-team')`,
				default: 'createSample',
			},
		];

		const fieldsAsks = [
			{
				name: 'fieldName',
				type: 'input',
				message: '추가할 필드의 이름을 알려주세요.',
				default: `myField`,
			},
			{
				name: 'fieldType',
				type: 'list',
				message: '추가할 필드의 데이터 타입을 선택하세요.',
				choices: [
					{
						name: `${chalk.yellow('string')}: 문자열 값을 나타냅니다`,
						value: 'string',
					},
					{
						name: `${chalk.yellow('boolean')}: true/false 값을 나타냅니다`,
						value: 'boolean',
					},
					{
						name: `${chalk.yellow('int')}: 32비트 정수 값을 나타냅니다`,
						value: 'int',
					},
					{
						name: `${chalk.yellow('long')}: 64비트 정수 값을 나타냅니다`,
						value: 'long',
					},
					{
						name: `${chalk.yellow('float')}: 단정밀도 부동 소수점 값을 나타냅니다`,
						value: 'float',
					},
					{
						name: `${chalk.yellow('double')}: 배정밀도 부동 소수점 값을 나타냅니다`,
						value: 'double',
					},
					{
						name: `${chalk.yellow('bytes')}: 바이트 배열 값을 나타냅니다`,
						value: 'bytes',
					},
					{
						name: `${chalk.yellow('array')}: 배열 값을 나타냅니다`,
						value: 'array',
					},
					{
						name: `${chalk.yellow('enum')}: 지정된 값 중 하나를 가진 열거형 값을 나타냅니다`,
						value: 'enum',
					},
					{
						name: `${chalk.gray('map')}: 맵 값을 나타냅니다`,
						value: 'map',
					},
					{
						name: `${chalk.gray('union')}: 여러 개의 타입 중 하나를 가질 수 있는 값을 나타냅니다`,
						value: 'union',
					},
					{
						name: `${chalk.gray('fixed')}: 고정 크기 바이트 값을 나타냅니다`,
						value: 'fixed',
					},
					{
						name: `${chalk.gray('record')}: 여러 필드를 가진 레코드 값을 나타냅니다`,
						value: 'record',
					},
					{
						name: `${chalk.yellow('null')}: null 값을 나타냅니다`,
						value: 'null',
					},
				],
				default: 0,
			},
			{
				name: 'isNullable',
				type: 'confirm',
				message: 'null 값을 허용하시겠습니까?',
				default: `y`,
				when: (answers) => answers.fieldType != 'boolean',
			},
			{
				name: 'defaultValue',
				type: 'input',
				message: '기본 값이 있다면 입력하세요.',
			},
		];

		const filedsAnswers = async () => {
			const result = [];
			while (
				(
					await this.prompt({
						name: 'addField',
						type: 'confirm',
						message: '필드를 추가하시겠습니까?',
						default: `y`,
					})
				).addField
			) {
				result.push(await this.prompt(fieldsAsks));
			}
			return result;
		};

		const topicValueAnswers = async () => {
			const result = await this.prompt({
				name: 'makeTopicValueAvro',
				type: 'confirm',
				message: `방금 추가한 Avro를 참조하는 ${chalk.yellow('Topic Value Avro')}를 추가하시겠습니까?`,
				default: `y`,
			});
			return result.makeTopicValueAvro ? result : null;
		};

		this.answers = {
			...(await this.prompt(initAsks)),
			fields: await filedsAnswers(),
			topicValue: await topicValueAnswers(),
		};
	}

	writing() {
		const args = {
			namespace: genVariousCases(this.answers.namespace),
			avroSchemaPrefix: genVariousCases(this.answers.avroSchemaPrefix),
			avroType: genVariousCases(this.answers.avroType),
			eventName: genVariousCases(this.answers.eventName),
			fields: this.answers.fields,
		};

		appBase: {
			this.destinationFile = `src/main/avro/schema-${args.eventName.pascal}${args.avroType.pascal}Avro-v1.avsc`;
			this.valueAvro = {
				fields: args.fields.map((field) => {
					const contents = {
						name: field.fieldName,
						type: field.isNullable ? [field.fieldType, 'null'] : field.fieldType,
					};
					if (field.defaultValue.length > 0) {
						contents.default = field.defaultValue;
					}
					return contents;
				}),
				name: `${args.eventName.pascal}${args.avroType.pascal}Avro`,
				namespace: `${args.namespace.dot}`,
				type: 'record',
			};

			this.fs.writeJSON(this.destinationPath(this.destinationFile), this.valueAvro);
		}

		topicValueAvro: {
			if (this.answers.topicValue?.makeTopicValueAvro) {
				this.topicValueAvro = {
					fields: [
						{
							name: 'event',
							type: 'com.monolith.mommos.event.avro.EventAvro',
						},
						{
							default: null,
							name: 'value',
							type: ['null', `${args.eventName.pascal}${args.avroType.pascal}Avro`],
						},
					],
					name: `${args.eventName.pascal}EventTopicValueAvro`,
					namespace: `${args.namespace.dot}`,
					type: 'record',
				};
				this.topicValueAvroFile = `src/main/avro/schema-${args.avroSchemaPrefix.slug}-${args.eventName.pascal}Event${args.avroType.pascal}Avro-value-v1.avsc`;
				this.fs.writeJSON(this.destinationPath(this.topicValueAvroFile), this.topicValueAvro);
			}
		}
	}

	async install() {
		const _self = this;
		if (
			(
				await this.prompt({
					name: 'isRegister',
					type: 'confirm',
					message: `Avro 파일들을 Schema Registry에 등록할까요?`,
					default: `y`,
				})
			).isRegister
		) {
			const config = getConfigJson(path.join(this.destinationPath(), '.mmmrc'));

			const registry = new SchemaRegistry({
				host: config?.schemaRegistryUrl,
				auth: {
					username: config?.schemaRegistryApiKey,
					password: config?.schemaRegistryApiSecret,
				},
			});

			try {
				const { id: valueAvroSchemaId } = await registry.register(
					{
						type: SchemaType.AVRO,
						schema: JSON.stringify(this.valueAvro),
					},
					{ subject: this.valueAvro.name },
				);
			} catch (err) {
				console.log('schema register err', err);
			}
		}
	}

	async end() {
		console.log(chalk.green('Avro 파일이 생성되었습니다.'));
		if (
			(
				await this.prompt({
					name: 'showGeneratedFiles',
					type: 'confirm',
					message: `생성된 Avro 파일의 내용을 출력할까요?`,
					default: `y`,
				})
			).showGeneratedFiles
		) {
			console.log(`File: ${chalk.yellow(this.destinationFile)}`);
			await this.spawnCommand('cat', [this.destinationFile]);
			console.log(`File: ${chalk.yellow(this.topicValueAvroFile)}`);
			await this.spawnCommand('cat', [this.topicValueAvroFile]);
		}
	}
}

module.exports = Avro;

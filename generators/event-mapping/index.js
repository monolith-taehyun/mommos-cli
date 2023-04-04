'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { SchemaRegistry, SchemaType } = require('@kafkajs/confluent-schema-registry');
const {
	getInnerString,
	toDot,
	toPascal,
	replace,
	genVariousCases,
	writeJsonWithoutDuplicates,
} = require('../../src/utils');

class EventMapping extends Generator {
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
	}

	async prompting() {
		console.log(chalk.yellow('::Event Mapping 생성::'));
		const moduleName = getInnerString(toDot(this.rcData?.appName || ''));
		const topicName = this.rcData?.topicName ? getInnerString(toPascal(this.rcData?.topicName || '')) : null;
		const moduleNamePascal = toPascal(moduleName);
		const asks = (
			await this.prompt({
				name: 'isMakeMappingFile',
				type: 'confirm',
				message: 'Event Mapping 파일을 생성하시겠습니까?',
				default: `y`,
			})
		).isMakeMappingFile
			? [
					{
						name: 'topicName',
						type: 'input',
						message: 'Topic 명을 입력하세요.',
						default: topicName || moduleName,
					},
					{
						name: 'cunsumeEventName',
						type: 'input',
						message: '수신하려는 이벤트명을 입력하세요.',
					},
					{
						name: 'produceEventName',
						type: 'input',
						message: '발행하려는 이벤트명을 입력하세요.',
					},
					{
						name: 'eventHandlerName',
						type: 'input',
						message: 'Event Dispacher 클래스명을 입력하세요.',
						default: `${moduleNamePascal}EventHandler`,
					},
			  ]
			: {};

		this.answers = {
			...(await this.prompt(asks)),
		};
		console.log('this.answers', this.answers);
	}

	writing() {
		const packagePath = replace(this.rcData.package, '.', '/');
		java: {
			this.fs.copyTpl(
				this.templatePath('EventHandler.java'),
				this.destinationPath(`src/main/java/${packagePath}/event/${toPascal(this.answers.eventHandlerName)}.java`),
				{
					topicName: genVariousCases(this.answers.topicName),
					eventHandlerName: genVariousCases(this.answers.eventHandlerName),
					package: genVariousCases(this.rcData.package),
					cunsumeEventName: genVariousCases(this.answers.cunsumeEventName),
					produceEventName: genVariousCases(this.answers.produceEventName),
				},
			);

			this.fs.copyTpl(
				this.templatePath('EventHandlerTest.java'),
				this.destinationPath(`src/test/java/${packagePath}/event/${toPascal(this.answers.eventHandlerName)}Test.java`),
				{
					topicName: genVariousCases(this.answers.topicName),
					eventHandlerName: genVariousCases(this.answers.eventHandlerName),
					package: genVariousCases(this.rcData.package),
					cunsumeEventName: genVariousCases(this.answers.cunsumeEventName),
					produceEventName: genVariousCases(this.answers.produceEventName),
				},
			);
		}

		updateMmmRc: {
			const mmmrcPath = path.join(this.destinationPath(), '.mmmrc');
			const eventMappings = { [this.answers.eventHandlerName]: this.answers };
			writeJsonWithoutDuplicates(mmmrcPath, eventMappings);
		}
	}
}

module.exports = EventMapping;

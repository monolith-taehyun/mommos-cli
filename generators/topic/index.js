'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { SchemaRegistry, SchemaType } = require('@kafkajs/confluent-schema-registry');
const { getInnerString, toDot, toPascal, replace, genVariousCases, writeJsonWithoutDuplicates } = require('../../src/utils');

class Topic extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.env = opts.env;
	}

	initializing() {
		if (!fs.existsSync(path.resolve(this.destinationPath(), 'build.gradle'))) {
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
		console.log(chalk.yellow('::Topic 생성::'));
		const moduleName = getInnerString(toDot(this.rcData?.appName || ''));
		const moduleNamePascal = toPascal(moduleName);
		const topicAsks = (
			await this.prompt({
				name: 'isMakeTopicFile',
				type: 'confirm',
				message: 'Topic 파일을 생성하시겠습니까?',
				default: `y`,
			})
		).isMakeTopicFile
			? [
					{
						name: 'topicName',
						type: 'input',
						message: 'Topic 명을 입력하세요.',
						default: moduleName,
					},
					{
						name: 'isCreateEventDispacher',
						type: 'confirm',
						message: 'Event Dispacher를 생성하시겠습니까?',
						default: `y`,
					},
					{
						name: 'eventDispacherName',
						type: 'input',
						message: 'Event Dispacher 클래스명을 입력하세요.',
						default: `${moduleNamePascal}EventDispacher`,
						when: (answers) => answers.isCreateEventDispacher,
					},
			  ]
			: null;

		this.answers = {
			...(await this.prompt(topicAsks)),
		};
	}

	writing() {
		const packagePath = replace(this.rcData.package, '.', '/');
		const args = {
			topicName: genVariousCases(this.answers.topicName),
			eventDispacherName: genVariousCases(this.answers.eventDispacherName),
			package: genVariousCases(this.rcData.package),
		};
		console.log('args', args);
		java: {
			this.fs.copyTpl(
				this.templatePath('EventDispatcher.java'),
				this.destinationPath(`src/main/java/${packagePath}/kafka/${toPascal(this.answers.eventDispacherName)}.java`),
				args,
			);
		}

		updateMmmRc: {
			const mmmrcPath = path.join(this.destinationPath(), '.mmmrc');
			const config = this.answers;
			writeJsonWithoutDuplicates(mmmrcPath, config);
		}
	}
}

module.exports = Topic;

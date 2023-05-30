'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const KafkaClient = require('../../src/kafka');

/**
 * 카프카 토픽을 생성합니다.
 */
class KafkaTopicCreate extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.env = opts.env;
	}

	async initializing() {
		const mmmrc = path.join(this.destinationPath(), '.mmmrc');
		const existsRc = fs.existsSync(mmmrc);
		if (existsRc) {
			this.rcData = JSON.parse(fs.readFileSync(mmmrc));
		}

		if (!existsRc || !this.rcData?.kafka) {
			console.log(
				'현재 디렉토리에 Kafka 접속 정보가 없습니다.',
				chalk.yellow('mmm kafka configure'),
				'명령어로 접속 정보를 추가하세요.',
			);
			process.exit(1);
		}
	}

	async prompting() {
		if (!this.topicName) {
			this.answers = await this.prompt({
				name: 'topicName',
				type: 'input',
				message: '사용하고자 하는 Topic 명을 알려주세요.',
				default: `${path.basename(this.destinationPath())}-topic`,
			});

			this.topicName = this.answers.topicName;
		}
	}

	async writing() {
		createTopic: {
			// 새로운 토픽 생성
			await new KafkaClient(this.rcData?.kafka).createTopic(this.topicName);
		}
	}
}

module.exports = KafkaTopicCreate;

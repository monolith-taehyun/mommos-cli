'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const KafkaClient = require('../../src/kafka');
const { writeJsonWithoutDuplicates } = require('../../src/utils');

class KafkaConfigure extends Generator {
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
	}

	async prompting() {
		console.log(chalk.yellow('::Kafka 설정 파일 생성::'));
		const kafkaAsks = (
			await this.prompt({
				name: 'configureKafka',
				type: 'confirm',
				message: 'Kafka 접속 정보를 설정하시겠습니까?',
				default: `y`,
			})
		).configureKafka
			? [
					{
						name: 'brocker',
						type: 'input',
						message: 'Kafka Broker의 URL을 입력하세요.',
						default: `localhost:9092`,
					},
					{
						name: 'clusterId',
						type: 'input',
						message: 'Kafka Cluster Id를 입력하세요.',
						default: `XR6H6GPdRFiW7kQQk9VxSQ`,
					},
					{
						name: 'username',
						type: 'password',
						message: 'SASL 인증 [username]을 입력하세요.',
					},
					{
						name: 'password',
						type: 'password',
						message: 'SASL 인증 [password]를 입력하세요.',
					},
			  ]
			: [];

		this.answers = {
			...(await this.prompt(kafkaAsks)),
		};
	}

	writing() {
		const mmmrcPath = path.join(this.destinationPath(), '.mmmrc');
		const config = {
			kafka: this.answers
				? {
						clientId: 'mommos-cli',
						brokers: [this.answers.brocker],
						clusterId: this.answers.clusterId,
				  }
				: null,
		};

		if (config && this.answers.username) {
			config.kafka.ssl = true;
			config.kafka.sasl = {
				mechanism: 'plain',
				username: this.answers.username,
				password: this.answers.password ? this.answers.password : null,
			};
		}

		writeJsonWithoutDuplicates(mmmrcPath, config);
	}
}

module.exports = KafkaConfigure;

'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { genVariousCases, getConfigJson, schemaRegistryApiResponse } = require('../../src/utils');
const { SchemaRegistry, SchemaType } = require('@kafkajs/confluent-schema-registry');

class AvroDownload extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.env = opts.env;
	}

	async initializing() {
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

		const config = getConfigJson(path.join(this.destinationPath(), '.mmmrc'));
		this.registry = new SchemaRegistry({
			host: config?.schemaRegistryUrl,
			auth: {
				username: config?.schemaRegistryApiKey,
				password: config?.schemaRegistryApiSecret,
			},
		});
	}

	async prompting() {
		console.log(chalk.yellow('::Avro 파일 다운로드::'));

		const subjectsRes = await this.registry.api.Subject.all();
		if (subjectsRes?.responseStatus === 200 && subjectsRes?.responseData) {
			const subjects = schemaRegistryApiResponse(subjectsRes).sort();
			this.answers = await this.prompt({
				name: 'subjects',
				type: 'checkbox',
				message: '다운로드할 Avro 파일들을 선택하세요.\n선택한 Avro가 참조하는 Avro가 있다면 함께 다운로드됩니다.\n',
				choices: subjects,
				pageSize: 30,
			});
		}
	}

	async writing() {
		const downloadAvro = async (subject) => {
			const latestSubject = schemaRegistryApiResponse(await this.registry.api.Subject.latestVersion({ subject }));
			if (latestSubject.references) {
				for (let k = 0; k < latestSubject.references.length; k++) {
					const reference = latestSubject.references[k];
					if (reference.subject !== 'EventAvro') {
						await downloadAvro(reference.subject);
					}
				}
			}
			this.destinationFile = `src/main/avro/schema-${latestSubject.subject}-v${latestSubject.version}.avsc`;
			this.fs.writeJSON(this.destinationPath(this.destinationFile), JSON.parse(latestSubject.schema));
		};

		if (this.answers?.subjects.length > 0) {
			for (let i = 0; i < this.answers.subjects.length; i++) {
				const subject = this.answers.subjects[i];
				await downloadAvro(subject);
			}
		}
	}
}

module.exports = AvroDownload;

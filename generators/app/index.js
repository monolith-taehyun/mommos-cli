'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { genVariousCases, replace } = require('../../src/utils');

class App extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.env = opts.env;
	}

	async prompting() {
		console.log(chalk.yellow('::Mommos Application 생성::'));
		const _self = this;
		const asks = [
			{
				name: 'appName',
				type: 'input',
				message: '애플리케이션명(디렉토리명): ',
				default: path.basename(this.destinationPath()),
			},
			{
				name: 'package',
				type: 'input',
				message: '사용하고자 하는 네임스페이스(패키지)명을 알려주세요.',
				default: `kr.co.monolith.park`,
			},
		];

		this.answers = await this.prompt(asks);
		this.category = genVariousCases(this.answers.appName);
	}

	async git() {
		const templatesDir = path.join(__dirname, 'templates');
		if (!fs.existsSync(templatesDir)) {
			await this.spawnCommand('git', [
				'clone',
				'-b',
				'templates',
				'--single-branch',
				'https://github.com/monolith-taehyun/mommos-cli.git',
				templatesDir,
			]);
		}
	}

	writing() {
		appBase: {
			this.fs.copyTpl(this.templatePath('app'), this.destinationPath(), {
				appName: genVariousCases(this.answers.appName),
			});
		}
		appMain: {
			this.fs.copyTpl(
				this.templatePath('app-main/Application.java'),
				this.destinationPath(
					`src/main/java/${replace(
						this.answers.package,
						'.',
						'/',
					)}/Application.java`,
				),
				{
					appName: genVariousCases(this.answers.appName),
					package: genVariousCases(this.answers.package),
				},
			);
			this.fs.copyTpl(
				this.templatePath('app-main/ApplicationTests.java'),
				this.destinationPath(
					`src/test/java/${replace(
						this.answers.package,
						'.',
						'/',
					)}/ApplicationTest.java`,
				),
				{
					appName: genVariousCases(this.answers.appName),
					package: genVariousCases(this.answers.package),
				},
			);
		}
	}

	install() {}

	end() {
		console.log(chalk.gray('애플리케이션 소스가 생성되었습니다.'));
	}
}

module.exports = App;

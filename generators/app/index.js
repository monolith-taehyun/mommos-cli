'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { genVariousCases } = require('../../src/utils');

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
	}

	install() {}

	end() {
		console.log(chalk.gray('애플리케이션 소스가 생성되었습니다.'));
	}
}

module.exports = App;

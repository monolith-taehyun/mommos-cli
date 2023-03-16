'use strict';

const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { genVariousCases } = require('../../src/utils');

class Sample extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.env = opts.env;
	}

	async prompting() {
		console.log(chalk.yellow('::Sample 생성::'));
		const _self = this;
		const asks = [
			{
				name: 'text',
				type: 'input',
				message: '문자열을 입력하세요.: ',
				default: 'Lorem ipsum dolor sit amet',
			},
		];
		this.answers = await this.prompt(asks);
	}

	writing() {
		appBase: {
			this.fs.copyTpl(this.templatePath(), this.destinationPath(), {
				text: genVariousCases(this.answers.text),
			});
		}
	}

	install() {}

	end() {
		console.log(chalk.gray('Sample CLI를 종료합니다.'));
	}
}

module.exports = Sample;

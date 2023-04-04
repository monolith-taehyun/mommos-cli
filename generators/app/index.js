'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');

class App extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.env = opts.env;
	}

	initializing() {
		if (fs.existsSync(path.resolve(this.destinationPath(), 'build.gradle'))) {
			console.error(chalk.redBright('이미 다른 프로젝트가 존재합니다. 빈 디렉토리 내에서 실행해 주세요.'));
			process.exit(1);
		}
		this.composeWith('mmm:app-create');
	}
}

module.exports = App;

'use strict';

const path = require('path');
const fs = require('fs');
const rp = require('request-promise-native');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { isLatestVersion } = require('../../src/utils');
const packageJson = require('../../package.json');

class Update extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.env = opts.env;
	}

	async initializing() {
		const currentVersion = packageJson.version;
		const options = {
			url: 'https://api.github.com/repos/monolith-taehyun/mommos-cli/releases/latest',
			headers: {
				'User-Agent': 'request',
			},
		};

		const res = await rp(options);
		const data = JSON.parse(res);
		const lastRelease = data.tag_name;
		this.isUpdatable = !isLatestVersion(currentVersion, lastRelease);
		if (this.isUpdatable) {
			this.updateTarballUrl = data.tarball_url;
			this.updateZipballUrl = data.zipball_url;
		}
	}

	async prompting() {
		if (!this.isUpdatable) {
			console.log('이미 최신버전이 설치되어 있습니다.');
			process.exit(1);
		}

		this.answers = await this.prompt({
			name: 'executeUpdate',
			type: 'confirm',
			message: '업데이트 가능한 최신 버전이 있습니다. 업데이트 하시겠습니까?',
			default: `y`,
		});
	}

	writing() {
		if (this.answers?.executeUpdate) {
			this.spawnCommand('npm', ['install', '-g', this.updateTarballUrl]);
		}
	}
}

module.exports = Update;

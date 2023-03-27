'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const KafkaClient = require('../../src/kafka');

class KafkaTopic extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.env = opts.env;
	}

	async writing() {
		createTopic: {
			// 새로운 토픽 생성
			await KafkaClient.createTopic('new-topic');
		}
	}
}

module.exports = KafkaTopic;

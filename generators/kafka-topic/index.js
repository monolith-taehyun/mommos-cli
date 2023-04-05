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

	initializing() {
		this.composeWith('mmm:kafka-topic-create');
	}
}

module.exports = KafkaTopic;

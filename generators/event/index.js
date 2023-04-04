'use strict';

const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const chalk = require('chalk');

class Event extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.env = opts.env;
	}

	async initializing() {
		await this.composeWith('mmm:event-topic');
		await this.composeWith('mmm:event-mapping');
	}
}

module.exports = Event;

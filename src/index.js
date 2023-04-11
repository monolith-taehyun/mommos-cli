#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const { Option } = require('commander');
const env = require('yeoman-environment').createEnv();
const { app, update, configure, event, avro, kafka, sample } = require('./commands');
const packageJson = require('../package.json');

program.version(packageJson.version).description('Command Line Interface of Mommos Application');

program.addCommand(app);
program.addCommand(update);
program.addCommand(configure);
program.addCommand(event);
program.addCommand(avro);
program.addCommand(kafka);
program.addCommand(sample);

program.parse(process.argv);

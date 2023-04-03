#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const { Option } = require('commander');
const env = require('yeoman-environment').createEnv();
const { app, configure, event, avro, kafka, sample } = require('./commands');

program.version('0.1.0').description('Command Line Interface of Mommos Application');

program.addCommand(app);
program.addCommand(configure);
program.addCommand(event);
program.addCommand(avro);
program.addCommand(kafka);
program.addCommand(sample);

program.parse(process.argv);

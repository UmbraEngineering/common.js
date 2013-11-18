#!/usr/bin/env node

var path      = require('path');
var program   = require('commander');
var commonjs  = require('../lib/index');

program
	.version('0.0.3')
	.option('-s, --src <src>', 'Source directory')
	.option('-d, --dest <dest>', 'Destination directory')
	.option('--client [client]', 'Output a common.js client script', '%')
	.option('-v, --verbose', 'Verbose output')
	.option('-q, --quiet', 'Quite running mode (no output)')
	.parse(process.argv);

program.output = 1;
if (program.verbose) {
	program.output = 2;
}
if (program.quiet) {
	program.output = 0;
}

program.src = path.resolve(process.cwd(), program.src);
program.dest = path.resolve(process.cwd(), program.dest);

commonjs.build(program, function(err) {
	if (err && program.output) {
		console.error(' -', err);
	}

	if (program.client) {
		if (program.client === '%') {
			program.client = program.dest + '/common.js';
		}
		commonjs.outputClientTo(path.resolve(process.cwd(), program.client));
	}
});

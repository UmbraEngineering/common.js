#!/usr/bin/env node

var program   = require('commander');
var commonjs  = require('../lib/index');
var pkg       = require('pkg').read(module);

program
	.version(pkg.version())
	.option('-s, --src [src]', 'Source directory')
	.option('-d, --dest [dest]', 'Destination directory')
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

commonjs.build(program, function(err) {
	if (err && program.output) {
		console.error(' -', err);
	}
});

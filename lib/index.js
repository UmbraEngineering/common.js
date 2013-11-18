
var fs          = require('fs');
var path        = require('path');
var async       = require('async');
var wrench      = require('wrench');
var wrapModule  = require('./wrap-module');

// 
// Build a CommonJS project
// 
// @param opts {
//   src,
//   dest,
//   output
// }
// 
exports.build = function(opts, callback) {
	async.series([
		function(next) {
			fs.exists(opts.src, function(exists) {
				if (! exists) {
					return next('Source directory does not exist');
				}
				next();
			});
		},
		function(next) {
			fs.exists(opts.dest, function(exists) {
				if (exists) {
					if (opts.output) {
						console.log(' + Destination already exists, deleting directory');
					}
					wrench.rmdirSyncRecursive(opts.dest);
				}
				wrench.mkdirSyncRecursive(opts.dest, 0777);
				next();
			});
		},
		function(next) {
			if (opts.output) {
				console.log(' + Copying JavaScript files to destination directory');
			}
			wrench.copyDirSyncRecursive(opts.src, opts.dest, {
				whitelist: true,
				filter: /\.js$/
			});
			next();
		},
		function(next) {
			if (opts.output) {
				console.log(' + Processing JavaScript files...');
			}

			try {
				var files = wrench.readdirSyncRecursive(opts.dest);
			} catch (err) {
				return next(err);
			}

			files.forEach(function(file) {
				if (opts.output > 1) {
					console.log('   > Processing file "' + file + '"');
				}
				var filepath = path.join(opts.dest, file);
				var source = fs.readFileSync(filepath, 'utf8');
				fs.writeFileSync(filepath, wrapModule('/' + file, source));
			});

			next();
		}
	],
	callback);
};

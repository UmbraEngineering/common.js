
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
	var keptFiles = { };

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
					if (opts.keepFiles) {
						opts.keepFiles.forEach(function(file) {
							if (opts.output > 1) {
								console.log('   - Keeping file "' + file + '"');
							}
							keptFiles[file] = fs.readFileSync(path.join(opts.dest, file));
						});
					}
					wrench.rmdirSyncRecursive(opts.dest);
				}
				next();
			});
		},
		function(next) {
			if (opts.output) {
				console.log(' + Copying JavaScript files to destination directory');
			}
			var isJsFile = /.+\.js$/;
			wrench.copyDirSyncRecursive(opts.src, opts.dest, {
				include: function(file, dir) {
					var stats = fs.lstatSync(dir + '/' + file);
					return stats.isDirectory() || isJsFile.test(file);
				}
			});

			if (opts.keepFiles && opts.keepFiles.length) {
				if (opts.output) {
					console.log(' + Restoring kept files...');
				}
				Object.keys(keptFiles).forEach(function(file) {
					if (opts.output > 1) {
						console.log('   - Restoring kept file "' + file + '"');
					}
					fs.writeFileSync(path.join(opts.dest, file), keptFiles[file]);
				});
			}

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
				if (file.slice(-3) !== '.js') {return;}
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

exports.outputClientTo = function(filepath, callback) {
	var srcFile = __dirname + '/../client/common.js';
	
	if (! callback) {
		return fs.writeFileSync(filepath, fs.readFileSync(srcFile, 'utf8'));
	}

	fs.readFile(srcFile, 'utf8', function(err, src) {
		if (err) {
			return callback(err);
		}

		fs.writeFile(filepath, src, callback);
	});
};

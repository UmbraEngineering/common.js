
var path = require('path');

// 
// Wraps a module in the template code and returns a processed module
// 
// @param {file} path relative to the JS source directory
// @param {src} the module's source code
// @param {opts} the options given to the main preprocessor call
// 
module.exports = function(file, src) {
	return ';' + [
		'require.__modules[path] = (function() {',
			'var module = {',
				'loaded: true,',
				'exports: { },',
				'filename: "' + file + '"',
			'};',
			'var exports = module.exports;',
			'var _require = require;',
			'var __filename = "' + file + '";',
			'var __dirname = "' + path.dirname(file) + '";',
			'var moduleSource = function() {',
				'var require = function(module) {',
					'return _require(module, "");',
				'};',
				'__module__();',
				'return module.exports',
			'};',
			'moduleSource.loaded = false;',
			'moduleSource.filename = "' + file + '";',
			'\n',
			'/* ==  Begin source for module ' + file + '  == */',
			'function __module__() {', '\n', src, '\n', '}',
			'/* ==  End source for module ' + file + '  == */',
		'}());'
	].join('') + ';';
};

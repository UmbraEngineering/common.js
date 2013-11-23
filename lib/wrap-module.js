
var path = require('path');

// 
// Wraps a module in the template code and returns a processed module
// 
// @param {file} path relative to the JS source directory (should begin with a "/")
// @param {src} the module's source code
// @param {opts} the options given to the main preprocessor call
// 
module.exports = function(file, src) {
	return ';' + [
		'require._modules["' + file + '"] = (function() {',
			'var __filename = "' + file + '";',
			'var __dirname = "' + path.dirname(file) + '";',
			'var module = {',
				'loaded: false,',
				'exports: { },',
				'filename: __filename,',
				'dirname: __dirname,',
				'require: null,',
				'call: function() {',
					'module.loaded = true;',
					'module.call = function() { };',
					'__module__();',
				'},',
				'parent: null,',
				'children: [ ]',
			'};',
			'var process = {',
				'title: "browser",',
				'nextTick: function(func) {',
					'setTimeout(func, 0);',
				'}',
			'};',
			'var require = module.require = window.require._bind(module);',
			'var exports = module.exports;', '\n',
			'/* ==  Begin source for module ' + file + '  == */',
			'var __module__ = function() {', '\n', src, '\n', '};',
			'/* ==  End source for module ' + file + '  == */',
			'return module;',
		'}());'
	].join(' ') + ';';
};

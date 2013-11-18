# CommonJS For The Browser

A CommonJS preprocessor that builds you CommonJS style app into code the browser can use.

## Install

```bash
$ npm install common.js
```

## Usage

#### Step 1: Write your JavaScript

###### foo.js

```javascript
module.exports = function() {
	console.log('foo');
};
```

###### bar.js

```javascript
var foo = require('foo');

exports.doTheThing = function() {
	foo();
};
```

#### Step 2: Build you code using commonjs-preprocessor

```bash
$ commonjs --src ./path/to/javascripts --dest ./path/to/js --client
```

#### Step 3: Include the modules into your app and use them

```html
<script src="js/common.js"></script>
<script src="js/foo.js"></script>
<script src="js/bar.js"></script>
<script>
	var bar = require('bar');

	bar.doTheThing();
</script>
```

## Lazy-loading extra scripts

```javascript
require.load('/foo', '/bar', '/baz').then(function() {
	var foo = require('foo');
	var bar = require('bar');
	var baz = require('baz');

	foo.doStuffWith(bar.foo(), baz.foo());
});
```




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
$ commonjs --src ./path/to/javascripts --dest ./path/to/compiled-javascripts
```

#### Step 3: Include the modules into your app and use them

```html
<script src="common.js"></script>
<script src="compiled-javascripts/foo.js"></script>
<script src="compiled-javascripts/bar.js"></script>
<script>
	var bar = require('bar');

	bar.doTheThing();
</script>
```


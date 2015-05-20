[![Build Status](https://travis-ci.org/pranavjha/chai-a11y.svg)](https://travis-ci.org/pranavjha/chai-a11y)
[![Code Climate](https://codeclimate.com/github/pranavjha/chai-a11y/badges/gpa.svg)](https://codeclimate.com/github/pranavjha/chai-a11y)

[![Dependency Status](https://david-dm.org/pranavjha/chai-a11y.svg)](https://david-dm.org/pranavjha/chai-a11y)
[![devDependency Status](https://david-dm.org/pranavjha/chai-a11y/dev-status.svg)](https://david-dm.org/pranavjha/chai-a11y#info=devDependencies)
[![peerDependency Status](https://david-dm.org/pranavjha/chai-a11y/peer-status.svg)](https://david-dm.org/pranavjha/chai-a11y#info=peerDependencies)


# chai-a11y

> accessibility testing plugin for chai


## How to use

Can be used with the `should`, `expect` or `assert` interfaces.

``` javascript

// 1. testing an HTML string for accessibility
var htmlString = '<div id="id">Demo</div>';
return expect(htmlString).to.be.accessible(options);

// 2. testing a jQuery element for accessibility
var jqElement = $('<div id="id">Demo</div>'); // or $('.abacus')
return expect(jqElement).to.be.accessible(options);

// 3. testing a DOM element for accessibility
var domElement = document.getElementById('abacus');
return expect(domElement).to.be.accessible(options);

```


## Configuration Options passed

An options object can be passed to the plugin assertion. This object has the following keys:

 - `ignore` is an array or string

   - If it is a string, it represents an
   [accessibility rule](https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules) name to ignore

   - If it is an array, the array elements can be a String or another Array

   - If the array element is another array, it should have 2 elements: a rule name and a query selector string
   representing the parts of the page to be ignored for that audit rule.

   - If the array element is a string, it represents the rule name to ignore.

 - `width` is the width of the phantomJS browser to run the tests on. This option is honoured only for server side tests

 - `height` is the height of the phantomJS browser to run the tests on. This option is honoured only for server side
 tests

 - `port` is the port on which the http server serving the html should start. This option is honoured only for server
 side tests


## Installation and Setup

### NodeJS

Do an `npm install chai-a11y` to get up and running. Then:


```javascript

var chai = require('chai');
var chaiA11y = require('chai-a11y');

chai.use(chaiA11y);

```


### AMD / RequireJS

Chai A11y supports being used as an [AMD](http://requirejs.org/) module, registering itself anonymously (just like
Chai). So, assuming you have configured your loader to map the Chai and Chai a11y files to the respective module IDs
`"chai"` and `"chai-a11y"`, you can use them as follows:

```javascript

define([
  'chai',
  'chai-a11y'
], function (chai, chaiA11y) {
  'use strict';
  chai.use(chaiA11y);
  var expect = chai.expect;
  // ... write your its here
});

```

When using AMD / RequireJS style code, the `jquery` dependency must be fulfilled by [jQuery](https://jquery.com/).


### Lasso JS / Browserify

For [Lasso JS](http://raptorjs.org/) and [Browserify](http://browserify.org/), usage will be similar to when using in a
NodeJS environment.


### `<script ... >` tag

If you include Chai A11y directly with a `<script>` tag, after the one for Chai itself, then it will
automatically plug in to Chai and be ready for use:

```html
<script src="chai.js"></script>
<script src="chai-a11y/lib/index.js"></script>
```

### Optional Dependency

`chai-a11y` plugin relies on
[accessibility-developer-tools](https://github.com/GoogleChrome/accessibility-developer-tools).

The plugin will look for the file [axs_testing.js]
(https://raw.github.com/GoogleChrome/accessibility-developer-tools/stable/dist/js/axs_testing.js) on the browser and if
it is not present, will try loading it form the remote url. So, if there is no internet access in the test environment,
it is recommended that a local copy of the file be served in the test runner. This is not required for NodeJS
environment.
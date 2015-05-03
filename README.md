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
return expect(htmlString).to.be.accessible();

// 2. testing a jQuery element for accessibility
var jqElement = $('<div id="id">Demo</div>'); // or $('.abacus')
return expect(jqElement).to.be.accessible();

// 3. testing a DOM element for accessibility
var domElement = document.getElementById('abacus');
return expect(domElement).to.be.accessible();

```


## Configuration Options

**TODO**

## Installation and Setup

### NodeJS

Do an `npm install chai-a11y` to get up and running. Then:


```javascript

var chai = require('chai');
var chaiA11y = require('chai-a11y');

chai.use(chaiA11y);

```


### AMD / RequireJS

Chai A11y supports being used as an [AMD][amd] module, registering itself anonymously (just like Chai). So, assuming
you have configured your loader to map the Chai and Chai a11y files to the respective module IDs `"chai"` and
`"chai-a11y"`, you can use them as follows:

```javascript

define(function (require, exports, module) {
    var chai = require("chai");
    var chaiA11y = require("chai-a11y");

    chai.use(chaiA11y);
});

```

When using AMD / RequireJS style code, the `jquery` dependency must be fulfilled by [jQuery](https://jquery.com/).


### RaptorJS / Browserify

For [RaptorJS](http://raptorjs.org/) and [Browserify](http://browserify.org/), usage will be similar to when using in a
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
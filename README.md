# trench

[![Build Status](https://travis-ci.org/montyanderson/trench.svg?branch=master)](https://travis-ci.org/montyanderson/trench)

Simplistic, promise-based web framework for node.

## features

* Supports new [ES6 features](https://github.com/lukehoban/es6features) such as [Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) and [Sets](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Set).
* Prioritises speed and simplicity over a large feature-set or extensive options.


## usage

* Requires Node 6.0+

``` javascript
const Trench = require("trench");

const app = new Trench();

app.get("/", (req, res) => {
	res.end("<h1>Hello, World!</h1>");
});

app.listen(8080);
```

# trench

[![Build Status](https://travis-ci.org/montyanderson/trench.svg?branch=master)](https://travis-ci.org/montyanderson/trench)

:neckbeard: Simplistic, promise-based web framework for node.

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

### api

#### new Trench()

Returns a new app instance.

``` javascript
const app = new Trench();
```

#### Trench#use(function)

Specifices a middleware function to be used.

``` javascript
app.use((req, res) => {
	res.locals.startTime = Date.now();
});
```

#### Trench.static(root)

Returns a middleware function for serving static files.

``` javascript
app.use(Trench.static(__dirname + "/static"));
```

#### Trench#get(path, [ function, [ function, [ function ]]])

Specifices a GET route for the given path.

``` javascript
app.get("/", (req, res) => {
	res.locals.name = "Monty";
}, (req, res) => {
	res.end(`Hi, ${res.locals.name}!`);
});
```

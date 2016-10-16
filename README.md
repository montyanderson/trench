# trench
Simplistic, promise-based web framework for node.

## usage

``` javascript
const Trench = require("trench");

const app = new Trench();

app.get("/", (req, res) => {
	res.end("<h1>Hello, World!</h1>");
});

app.listen(8080);
```

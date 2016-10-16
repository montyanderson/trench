const Trench = require("./");

const app = new Trench();

app.get("/", (req, res) => {
	res.end("<h1>Hello, World!</h1>");
});

app.listen(8080);

const Trench = require("./");

const app = new Trench();

app.use(Trench.bodyParser());

app.get("/", (req, res) => {
	const body = `
<form method="post">
	<input name="foo" value="bar">
	<input type="submit">
</form>
	`.trim();

	res.end(body);
});

app.post("/", (req, res) => {
	res.end(JSON.stringify(req.body || "no body : ("));
});


app.listen(8080);

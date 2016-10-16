const Trench = require("../");
const assert = require("assert");
const request = require("supertest");

describe("Trench", () => {
	const app = new Trench();

	app.use((req, res) => {
		return new Promise(resolve => {
			setTimeout(() => {
				res.locals.greeting = "Hello";
				resolve();
			}, 1000);
		});
	});

	app.get("/", (req, res) => {
		res.locals.who = "World";
	}, (req, res) => {
		res.end(`${res.locals.greeting}, ${res.locals.who}`);
	});

	const server = app.server();

	describe("app", () => {
		it("should be an instance of Trench", () => {
			assert(app instanceof Trench);
		});

		it("should return 'Hello, World'", (done) => {
			request(server)
				.get("/")
				.expect(200, "Hello, World")
				.end(done);
		});

		it("should return 404", (done) => {
			request(server)
				.get("/nothinghere")
				.expect(404)
				.end(done);
		});
	});
});

"use strict";
const http = require("http");
const url = require("url");

class Trench {
	constructor() {
		this.router = {
			globals: [],
			endpoints: {}
		};
	}

	use(func) {
		if(typeof func == "function") {
			this.router.globals.push(func);
		}
	}

	get(path) {
		this.router.endpoints[path] = {
			method: "GET",
			functions: Array.prototype.slice.call(arguments, 1)
		};
	}

	handler() {
		return (req, res) => {
			Object.assign(req, url.parse(req.url));

			res.locals = {};

			const path = this.router.endpoints[req.path];
			let p = Promise.resolve();

			if(path) {
				this.router.globals.forEach(f => {
					p = p.then(() => f(req, res));
				});

				path.functions.forEach(f => {
					console.log(f);
					p = p.then(() => f(req, res));
				});
			} else {
				res.writeHead(404);
				res.end();
			}
		};
	}

	server() {
		return http.createServer(this.handler());
	}

	listen(port = 8080) {
		this.server().listen(port);
	}
};

module.exports = Trench;

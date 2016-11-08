"use strict";
const http = require("http");
const url = require("url");
const querystring = require("querystring");

class Trench {
	constructor() {
		this.router = {
			globals: [
				(req, res) => {
					res.setHeader("Content-Type", "text/html");
				}
			],
			endpoints: {}
		};

		http.METHODS.forEach(method => {
			this.router.endpoints[method] = {};
		});
	}

	use(func) {
		if(typeof func == "function") {
			this.router.globals.push(func);
		}
	}

	handler() {
		return (req, res) => {
			Object.assign(req, url.parse(req.url));

			res.locals = {};

			const reqEnd = req.end;
			let ended = false;

			req.end = function() {
				ended = true;
				reqEnd.apply(this, arguments);
			};

			if(!this.router.endpoints[req.method]) {
				req.writeHead(500);
				res.end("500 Method not supported.");
			}

			const path = this.router.endpoints[req.method][req.path];
			let p = Promise.resolve();
			let route = [].concat(this.router.globals);

			if(path) {
				route = route.concat(path.functions);
			}

			route.forEach(f => {
				p = p.then(() => !ended && f(req, res));
			});

			if(!path) {
				p = p.then(() => {
					res.writeHead(404);
					res.end("404 Not Found");
				});
			}

			p.catch(error => {
				console.log(error);
				res.writeHead(500);
				res.end("500 Internal Server Error");
			});
		};
	}

	server() {
		return http.createServer(this.handler());
	}

	listen(port = 8080) {
		this.server().listen(port);
	}
};

http.METHODS.forEach(method => {
	Trench.prototype[method.toLowerCase()] =
	Trench.prototype[method] = function(path) {
		this.router.endpoints[method][path] = {
			method,
			functions: Array.prototype.slice.call(arguments, 1)
		};
	};
});

Trench.static = require("./lib/static");
Trench.bodyParser = require("./lib/bodyParser");

module.exports = Trench;

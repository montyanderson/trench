"use strict";
const http = require("http");
const url = require("url");
const send = require("send");
const querystring = require("querystring");

class Trench {
	constructor() {
		this.router = {
			globals: [],
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

	static static(root) {
		if(!root) throw new TypeError("root path required");

		return (req, res) => {
			return new Promise((resolve, reject) => {
				let path = req.path;
				const stream = send(req, path, { root });

				stream.on("error", resolve);
				stream.on("finish", resolve);
				stream.pipe(res);
			});
		};
	}

	static bodyParser() {
		return (req, res) => {
			if(req.method != "POST") return;

			return new Promise((resolve, reject) => {
				let data = "";

				req.on("data", chunk => {
					 data += chunk;

					 if(Buffer.byteLength(data) > 20000) {
						 const error = new Error("Post body size exceedes 200k bytes.");
						 reject(error);
						 throw error;
					 }
				});

				req.on("end", () => {
					console.log("yo!");

					try {
						req.body = querystring.parse(data);
						resolve();
					} catch(error) {
						reject(error);
						throw error;
					}
				});
			});
		};
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

module.exports = Trench;

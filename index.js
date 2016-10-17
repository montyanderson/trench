"use strict";
const http = require("http");
const url = require("url");
const send = require("send");

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

			const reqEnd = req.end;
			let ended = false;

			req.end = function() {
				ended = true;
				reqEnd.apply(req, arguments);
			};

			const path = this.router.endpoints[req.path];
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
					res.end();
				});
			}

			p.catch(err => console.log(err));
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
};

module.exports = Trench;

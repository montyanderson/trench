const send = require("send");

module.exports = (root) => {
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
};

const querystring = require("querystring");

module.exports = () => {
	return (req, res) => {
		if(["POST", "PUT"].indexOf(req.method) > -1) {
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
					try {
						req.body = querystring.parse(data);
						resolve();
					} catch(error) {
						reject(error);
						throw error;
					}
				});
			});
		} else {
			req.body = {};
		}
	};
};

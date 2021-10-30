const { loadTemplate, layout } = require('./util/template'),
	staticFilesController = require('./controllers/staticFilesController');

const controllers = {};

const defaultController = async (req, res) => {
	try {
		const notFound = await loadTemplate('404');
		res.writeHead(404, { 'Content-Type': 'text/html' });
		res.end(await layout(notFound));
	} catch (err) {
		res.statusCode = 500;
		res.end(`Error >>> ${err}`);
	}
};

const matchController = (method, url) => {
	if (method === 'GET' && url.startsWith('/static/')) {
		return staticFilesController;
	}

	const methods = controllers[url] || {};
	const controller = methods[method];

	return controller ? controller : defaultController;
};

const registerController = (method, url, controller) => {
	let methods = controllers[url];

	if (methods === undefined) {
		methods = {};
		controllers[url] = methods;
	}

	controllers[url][method] = controller;
};

module.exports = {
	matchController,
	registerController,
	get: (...params) => registerController('GET', ...params),
	post: (...params) => registerController('POST', ...params),
	delete: (...params) => registerController('DELETE', ...params),
};

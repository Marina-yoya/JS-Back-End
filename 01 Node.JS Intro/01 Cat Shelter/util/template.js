const fs = require('fs/promises');

const loadTemplate = async (file) => {
	try {
		const template = await fs.readFile(`./views/${file}.html`);
		return template.toString();
	} catch (err) {
		return `Error >>> ${err}`;
	}
};

const render = async (templateName, body) => {
	let template = await loadTemplate(templateName);
	template = template.replace(new RegExp('{{body}}', 'g'), body);

	return template;
};

const layout = (body) => render('layout', body);

module.exports = {
	loadTemplate,
	render,
	layout,
};

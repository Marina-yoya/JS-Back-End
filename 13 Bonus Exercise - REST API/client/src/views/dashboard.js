import { getFurniture } from '../api/data.js';
import { itemTemplate } from './common/item.js';
import { html } from '../../node_modules/lit-html/lit-html.js';

const template = (data) => html`
	<div class="row space-top">
		<div class="col-md-12">
			<h1>Welcome to our Furniture System</h1>
			<p>Select furniture from the catalog to view it's details.</p>
		</div>
	</div>
	<div class="row space-top">${data.map(itemTemplate)}</div>
`;

export async function dashboardPage(ctx) {
	try {
		const data = await getFurniture();
		ctx.render(template(data || []));
	} catch (err) {
		console.log(err);
		alert(err.message);
		console.error(err.message);
		return;
	}
}

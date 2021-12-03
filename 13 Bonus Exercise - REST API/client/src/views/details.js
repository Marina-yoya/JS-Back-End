import { getItemById, deleteRecord } from '../api/data.js';
import { html } from '../../node_modules/lit-html/lit-html.js';

const template = (item, isOwner, onDelete) => html`
	<div class="row space-top">
		<div class="col-md-12">
			<h1>Furniture Details</h1>
		</div>
	</div>
	<div class="row space-top">
		<div class="col-md-4">
			<div class="card text-white bg-primary">
				<div class="card-body">
					<img src=${item.img} />
				</div>
			</div>
		</div>
		<div class="col-md-4">
			<p>Type: <span>${item.type}</span></p>
			<p>Description: <span>${item.description}</span></p>
			<p>Price: <span>${item.price}</span></p>
			<p>Material: <span>${item.material}</span></p>
			${isOwner
				? html`
						<div>
							<a href=${`/edit/${item._id}`} class="btn btn-info">Edit</a>
							<a @click=${onDelete} href="javascript:void(0)" class="btn btn-red">Delete</a>
						</div>
				  `
				: null}
		</div>
	</div>
`;

export async function detailsPage(ctx) {
	try {
		const id = ctx.params.id;
		const item = await getItemById(id);
		const userId = sessionStorage.getItem('userId');

		ctx.render(template(item, item.owner == userId, onDelete));

		async function onDelete() {
			try {
				if (confirm('Are you sure you want to delete this item?')) {
					await deleteRecord(item._id);
					ctx.page.redirect('/');
				}
			} catch (err) {
				alert(err.message);
				console.error(err.message);
				return;
			}
		}
	} catch (err) {
		alert(err.message);
		console.error(err.message);
		return;
	}
}

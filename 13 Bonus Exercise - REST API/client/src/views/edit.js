import { getItemById, editRecord } from '../api/data.js';
import { html } from '../../node_modules/lit-html/lit-html.js';

const template = (onSubmit, item, errMessage) => html`
	<div class="row space-top">
		<div class="col-md-12">
			<h1>Edit Furniture</h1>
			<p>Please fill all fields.</p>
		</div>
	</div>
	<form @submit=${onSubmit}>
		<div class="row space-top">
			<div class="col-md-4">
				${errMessage
					? html`
							<div class="form-group">
								<p>${errMessage}</p>
							</div>
					  `
					: null}

				<div class="form-group">
					<label class="form-control-label" for="new-make">Type</label>
					<input class="form-control" id="new-make" type="text" name="type" .value=${item.type} />
				</div>
				<div class="form-group">
					<label class="form-control-label" for="new-description">Description</label>
					<input class="form-control" id="new-description" type="text" name="description" .value=${item.description} />
				</div>
			</div>
			<div class="col-md-4">
				<div class="form-group">
					<label class="form-control-label" for="new-price">Price</label>
					<input class="form-control" id="new-price" type="number" name="price" .value=${item.price} />
				</div>
				<div class="form-group">
					<label class="form-control-label" for="new-image">Image</label>
					<input class="form-control" id="new-image" type="text" name="img" .value=${item.img} />
				</div>
				<div class="form-group">
					<label class="form-control-label" for="new-material">Material (optional)</label>
					<input class="form-control" id="new-material" type="text" name="material" .value=${item.material} />
				</div>
				<input type="submit" class="btn btn-info" value="Edit" />
			</div>
		</div>
	</form>
`;

export async function editPage(ctx) {
	try {
		const id = ctx.params.id;
		const item = await getItemById(id);
		ctx.render(template(onSubmit, item));

		async function onSubmit(event) {
			try {
				event.preventDefault();
				const formData = new FormData(event.target);

				// I know, that's far from clever way to absorb the data from the
				// form as they aren't sanitized but security is not a big factor on this example of an API Service.
				const data = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v.trim() }), {});

				if (
					Object
						.entries(data)
						.filter(([k, v]) => k != 'material')
						.some(([k, v]) => v == '')
				) return ctx.render(template(onSubmit, item, 'Please fill all mandatory fields!'));

				data.price = Number(data.price);
				await editRecord(item._id, data);

				ctx.page.redirect('/');
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

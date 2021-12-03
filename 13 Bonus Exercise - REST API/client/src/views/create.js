import { createRecord } from '../api/data.js';
import { html } from '../../node_modules/lit-html/lit-html.js';

const template = (onSubmit, errMessage) => html`
	<div class="row space-top">
		<div class="col-md-12">
			<h1>Create New Furniture</h1>
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
					<input class="form-control valid" id="new-make" type="text" name="type" />
				</div>
				<div class="form-group">
					<label class="form-control-label" for="new-description">Description</label>
					<input class="form-control" id="new-description" type="text" name="description" />
				</div>
			</div>
			<div class="col-md-4">
				<div class="form-group">
					<label class="form-control-label" for="new-price">Price</label>
					<input class="form-control" id="new-price" type="number" name="price" />
				</div>
				<div class="form-group">
					<label class="form-control-label" for="new-image">Image</label>
					<input class="form-control" id="new-image" type="text" name="img" />
				</div>
				<div class="form-group">
					<label class="form-control-label" for="new-material">Material (optional)</label>
					<input class="form-control" id="new-material" type="text" name="material" />
				</div>
				<input type="submit" class="btn btn-primary" value="Create" />
			</div>
		</div>
	</form>
`;

export async function createPage(ctx) {
	ctx.render(template(onSubmit));

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
			) return ctx.render(template(onSubmit, 'Please fill all mandatory fields!'));

			data.price = Number(data.price);
			await createRecord(data);

			ctx.page.redirect('/');
		} catch (err) {
			if (err.message === 'Sign in first.') {
				ctx.page.redirect('/login');
				return;
			}

			alert(err.message);
			console.error(err.message);
			return;
		}
	}
}

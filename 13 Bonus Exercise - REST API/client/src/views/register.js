import { register } from '../api/data.js';
import validate from '../utils/emailValidator.js';
import { html } from '../../node_modules/lit-html/lit-html.js';

const template = (onSubmit, errMessage, invalidEmail, invalidPass, invalidRe) => html`
	<div class="row space-top">
		<div class="col-md-12">
			<h1>Register New User</h1>
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
					<label class="form-control-label" for="email">Email</label>
					<input class=${'form-control' + (invalidEmail ? ' is-invalid' : '')} id="email" type="text" name="email" />
				</div>
				<div class="form-group">
					<label class="form-control-label" for="password">Password</label>
					<input
						class=${'form-control' + (invalidPass ? ' is-invalid' : '')}
						id="password"
						type="password"
						name="password"
					/>
				</div>
				<div class="form-group">
					<label class="form-control-label" for="rePass">Repeat Password</label>
					<input class=${'form-control' + (invalidRe ? ' is-invalid' : '')} id="rePass" type="password" name="rePass" />
				</div>
				<input type="submit" class="btn btn-primary" value="Register" />
			</div>
		</div>
	</form>
`;

export async function registerPage(ctx) {
	ctx.render(template(onSubmit));

	async function onSubmit(event) {
		try {
			event.preventDefault();
			const formData = new FormData(event.target);

			const email = formData.get('email').trim();
			const repass = formData.get('rePass').trim();
			const password = formData.get('password').trim();

			if (validate(email) === false) {
				return ctx.render(template(onSubmit, "Make sure you're using a valid email address.", true));
			}
			if ([email, password, repass].map(Boolean).includes(false)) {
				return ctx.render(template(onSubmit, 'All fields are required!', email === '', password === '', repass === ''));
			}
			if (password != repass) {
				return ctx.render(template(onSubmit, "Passwords don't match!", false, true, true));
			}

			await register(email, password);

			ctx.setUserNav();
			ctx.page.redirect('/');
		} catch (err) {
			if (err.message === 'Already authorized.') {
				ctx.page.redirect('/');
				return;
			}

			alert(err.message);
			console.error(err.message);
			return;
		}
	}
}

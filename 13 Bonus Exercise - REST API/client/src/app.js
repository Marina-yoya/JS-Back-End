import { logout } from './api/data.js';
import { editPage } from './views/edit.js';
import { loginPage } from './views/login.js';
import { createPage } from './views/create.js';
import { myPage } from './views/myFurniture.js';
import page from '../node_modules/page/page.mjs';
import { detailsPage } from './views/details.js';
import { registerPage } from './views/register.js';
import { dashboardPage } from './views/dashboard.js';
import { render } from '../node_modules/lit-html/lit-html.js';

const main = document.querySelector('.container');

page('/', decorateContext, dashboardPage);
page('/login', decorateContext, loginPage);
page('/create', decorateContext, createPage);
page('/edit/:id', decorateContext, editPage);
page('/my-furniture', decorateContext, myPage);
page('/register', decorateContext, registerPage);
page('/details/:id', decorateContext, detailsPage);

document.getElementById('logoutBtn').addEventListener('click', async () => {
	try {
		await logout();
		setUserNav();
		page.redirect('/');
	} catch (err) {
		alert(err.message);
		console.error(err.message);
		return;
	}
});

setUserNav();

// Start application
page.start();

function decorateContext(ctx, next) {
	ctx.render = (content) => render(content, main);
	ctx.try = ctx.setUserNav = setUserNav;
	next();
}

export default function setUserNav() {
	const userId = sessionStorage.getItem('userId');
	if (userId != null) {
		document.getElementById('user').style.display = 'inline-block';
		document.getElementById('guest').style.display = 'none';
	} else {
		document.getElementById('user').style.display = 'none';
		document.getElementById('guest').style.display = 'inline-block';
	}
}

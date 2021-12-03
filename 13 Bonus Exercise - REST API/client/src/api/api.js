import setUserNav from '../app.js';
import page from '../../node_modules/page/page.mjs';

export const settings = { host: '' };

async function request(url, options) {
	try {
		const response = await fetch(url, options);

		if (response.ok == false) {
			const error = await response.json();
			throw new Error(error.message);
		}

		try {
			const data = await response.json();
			return data;
		} catch (err) {
			return response;
		}
	} catch (err) {
		if (err.message === 'Invalid access token.' || err.message === 'Access token is expired.') {
			alert("Oops something went wrong, we'll fix it now!");
			page.redirect('/login');

			sessionStorage.removeItem('email');
			sessionStorage.removeItem('userId');
			sessionStorage.removeItem('authToken');

			setUserNav();
			return;
		}

		throw err;
	}
}

function getOptions(method = 'get', body) {
	const options = {
		method,
		headers: {},
	};

	const token = sessionStorage.getItem('authToken');
	if (token) options.headers['X-Authorization'] = token;

	if (body) {
		options.body = JSON.stringify(body);
		options.headers['Content-Type'] = 'application/json';
	}

	return options;
}

export async function get(url) {
	return await request(url, getOptions());
}

export async function post(url, data) {
	return await request(url, getOptions('post', data));
}

export async function put(url, data) {
	return await request(url, getOptions('put', data));
}

export async function del(url) {
	return await request(url, getOptions('delete'));
}

export async function login(email, password) {
	const result = await post(settings.host + '/users/login', { email, password });

	sessionStorage.setItem('userId', result._id);
	sessionStorage.setItem('email', result.email);
	sessionStorage.setItem('authToken', result.accessToken);

	return result;
}

export async function register(email, password) {
	const result = await post(settings.host + '/users/register', { email, password });

	sessionStorage.setItem('userId', result._id);
	sessionStorage.setItem('email', result.email);
	sessionStorage.setItem('authToken', result.accessToken);

	return result;
}

export async function logout() {
	const result = await get(settings.host + '/users/logout');

	sessionStorage.removeItem('email');
	sessionStorage.removeItem('userId');
	sessionStorage.removeItem('authToken');

	return result;
}
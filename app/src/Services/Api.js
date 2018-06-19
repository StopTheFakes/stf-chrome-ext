import * as qs from 'query-string';

const BASE_URL = 'http://stf.glissmedia.ru/api/';

/* global fetch */

const get = (url, params = null, token = null) =>
	fetch(`${BASE_URL}${url}?${qs.stringify(params || {})}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(token ? {'Authorization': `Bearer ${token}`} : {})
		}
	})
		.then(resp => resp.json());

const post = (url, data = {}, params = {}, token = null, method = 'POST') => {
	let file = false;
	let formData = new FormData();
	let append = (name, val) => {
		formData.append(name, val);
		if (val instanceof File) {
			file = true;
		}
	};
	Object.keys(data).forEach(key => {
		if (data[key] instanceof Array) {
			data[key].forEach(val => {
				append(key + '[]', val);
			});
		} else {
			append(key, data[key]);
		}
	});
	return fetch(`${BASE_URL}${url}?${qs.stringify(params)}`, {
		method,
		headers: {
			...(file ? {} : {'Content-Type': 'application/json'}),
			...(token ? {'Authorization': `Bearer ${token}`} : {})
		},
		body: file ? formData : JSON.stringify(data)
	})
		.then(resp => resp.json());
};

const del = (url, data = {}, params = {}, token = null) => post(url, data, params, token, 'DELETE');
const put = (url, data = {}, params = {}, token = null) => post(url, data, params, token, 'PUT');


export const login = (email, password) => post('login', {email, password});

export const takenApplications = token => get('take', null, token);

export const allApplications = token => get('request', null, token);


export const application = (id, token) => get(`request/${id}`, null, token);
import * as qs from 'query-string';

import { setToken } from './Auth';

const BASE_URL = 'http://stf.glissmedia.ru/api/v1/';

/* global fetch */

const process = resp => {
	if (resp.status === 401) {
		setToken(null);
		return Promise.resolve({});
	}
	return resp.json();
};

const get = (url, params = null, token = null) =>
	fetch(`${BASE_URL}${url}?${qs.stringify(params || {})}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(token ? {'Authorization': `Bearer ${token}`} : {})
		}
	})
		.then(process);

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
		.then(process);
};

export const login = (email, password) => post('login', {email, password});
export const takenApplications = token => get('request/taken', null, token);
export const application = (id, token) => get(`request/${id}/taken`, null, token);
export const sendSignal = (id, data, token) => post(`request/${id}`, data, {}, token);
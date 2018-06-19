
import { setAuthToken } from 'Services/Store';


export const init = () => setAuthToken(localStorage.getItem('token'));


export const setToken = token => {
	if (token === null) {
		localStorage.removeItem('token');
	} else {
		localStorage.setItem('token', token);
	}
	setAuthToken(token);
};
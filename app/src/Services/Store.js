
import { createStore } from 'redux';
import { Provider } from 'react-redux';


const SET_AUTH_TOKEN = 1;
const SET_TAKEN_REQUESTS = 2;
const SET_MODE = 3;
const SET_CURRENT_ITEM = 4;


const reducer = (state, action) => {
	if (!state) {
		state = {
			authToken: null,
			takenRequests: [],
			heading: '',
			mode: '',
			currentItem: null,
		};
	}
	switch (action.type) {
		case SET_AUTH_TOKEN:
			return {...state, authToken: action.token};
		case SET_TAKEN_REQUESTS:
			return {...state, takenRequests: action.list};
		case SET_MODE:
			return {...state, mode: action.mode};
		case SET_CURRENT_ITEM:
			return {...state, currentItem: action.item};
	}
	return state;
};


export const setAuthToken = token => service.Store.dispatch({ type: SET_AUTH_TOKEN, token });


export const setTakenRequests = list => service.Store.dispatch({ type: SET_TAKEN_REQUESTS, list });


export const setMode = mode => service.Store.dispatch({ type: SET_MODE, mode });


export const setCurrentItem = item => service.Store.dispatch({ type: SET_CURRENT_ITEM, item });


const service = {
	Provider,
	Store: createStore(reducer)
};

export default service;
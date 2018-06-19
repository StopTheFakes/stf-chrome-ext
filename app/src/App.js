
import React from 'react';

import ReactDOM from 'react-dom';

import App from 'Components/App';

import StoreService from 'Services/Store';

import { init as authInit } from 'Services/Auth';

authInit();

ReactDOM.render(
	<StoreService.Provider store={StoreService.Store}>
		<App />
	</StoreService.Provider>
	, document.querySelector("#app"));
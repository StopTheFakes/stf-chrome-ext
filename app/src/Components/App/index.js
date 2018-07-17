import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import LoginComponent from 'Components/Login';
import ApplicationsListComponent from 'Components/ApplicationsList';
import ApplicationViewComponent from 'Components/ApplicationView';
import MenuComponent from 'Components/Menu';

import './index.styl';


class App extends Component {

	constructor(props, context){
		super(props, context);
		this.state = {
		};
	}


	handle() {
		chrome.tabs.captureVisibleTab(null, {}, img => this.setState({ img }));
	}


	render() {
		let { token, mode } = this.props;
		if (!token) {
			return <LoginComponent />;
		}
		console.log(mode);
		switch (mode) {
			case 'application-view': return <ApplicationViewComponent />;
			case 'applications-list': return <ApplicationsListComponent />;
			case 'menu': return <MenuComponent />;
		}
		return <ApplicationsListComponent />;
	}
}


App.propTypes = {
	token: PropTypes.any,
	mode: PropTypes.any,
};


export default connect(state => ({
	token: state.authToken,
	mode: state.mode,
}))(App);
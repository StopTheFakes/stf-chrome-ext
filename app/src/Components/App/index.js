import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import LoginComponent from 'Components/Login';
import ApplicationsListComponent from 'Components/ApplicationsList';
import ApplicationViewComponent from 'Components/ApplicationView';

import './index.styl';


const styles = () => ({});


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
		let p = this.props;
		if (!p.token) {
			return <LoginComponent />;
		}
		switch (p.mode) {
			case 'application-view': return <ApplicationViewComponent />;
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
}))(withStyles(styles)(App));

import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { setMode, setCurrentItem } from 'Services/Store';

import './index.styl';


class ApplicationsList extends Component {

	componentDidMount() {
		chrome.storage.local.get(['currentItem'], result => {
			let { currentItem } = result;
			if (currentItem) {
				setMode('application-view');
				setCurrentItem(currentItem);
			}
		});
	}


	render() {
		let { children } = this.props;
		return (
			<div className="main-outer">
				{children}
				<div className="main-outer__bottom-nav">
					<button className="main-outer__bottom-nav-menu" onClick={() => {
						setMode('menu');
						setCurrentItem(null);
						chrome.storage.local.set({ currentItem: null });
					}} />
					<button className="main-outer__bottom-nav-list" onClick={() => {
						setMode('applications-list');
						setCurrentItem(null);
						chrome.storage.local.set({ currentItem: null });
					}} />
				</div>
			</div>
		);
	}
}


ApplicationsList.propTypes = {
	token: PropTypes.any,
	currentItem: PropTypes.any,
};


export default connect(state => ({
	token: state.authToken,
	currentItem: state.currentItem,
}))(ApplicationsList);
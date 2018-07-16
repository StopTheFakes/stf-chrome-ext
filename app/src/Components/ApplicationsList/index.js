
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import OuterComponent from 'Components/Outer';

import { takenApplications } from 'Services/Api';
import { setTakenRequests, setMode, setCurrentItem } from 'Services/Store';

import './index.styl';


const handleSelectItem = item => {
	setMode('application-view');
	setCurrentItem(item);
	chrome.storage.local.set({ currentItem: item });
};


class ApplicationsList extends Component {

	constructor(props, context){
		super(props, context);
		this.state = {
		};
	}


	componentDidMount() {
		let { token } = this.props;
		takenApplications(token).then(data => {
			console.log(data);
			setTakenRequests(data.data);
		});
	}


	render() {
		let { takenRequests } = this.props;
		takenRequests = takenRequests || [];
		return (
			<OuterComponent>
				<div className="app-item">
					<div className="app-item__head">
						<div className="app-item__head-city">USA, 4 cities</div>
						<div className="app-item__head-date">22/11/2017</div>
					</div>
					<div className="app-item__body">
						<div className="app-item__body-head">Illegal use of Alex Smith's copyright material (pictures, videos, audios, etc.)</div>
						<div className="app-item__body-time">24:45</div>
						<button className="app-item__body-send-signal">Send signal</button>
					</div>
				</div>
			</OuterComponent>
		);
	}
}


ApplicationsList.propTypes = {
	token: PropTypes.any,
	takenRequests: PropTypes.any,
};


export default connect(state => ({
	token: state.authToken,
	takenRequests: state.takenRequests
}))(ApplicationsList);

import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import OuterComponent from 'Components/Outer';

import { takenApplications } from 'Services/Api';
import { setTakenRequests, setMode, setCurrentItem } from 'Services/Store';

import moment from 'moment';

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
			setTakenRequests([
				{
					id: 1,
					claim_id: 1,
					requestor_id: 2,
					title: 'Product1',
					cost: 88.25,
					created: '2018-06-09 14:32:28'
				}
			]);
		});
	}


	render() {
		let { takenRequests = [] } = this.props;
		return (
			<OuterComponent>
				{takenRequests.map(r =>
					<div className="app-item">
						<div className="app-item__head">
							<div className="app-item__head-city">USA, 4 cities</div>
							<div className="app-item__head-date">{moment(r.created).format('DD/MM/YYYY')}</div>
						</div>
						<div className="app-item__body">
							<div className="app-item__body-head">{r.title}</div>
							<div className="app-item__body-time">24:45</div>
							<button className="app-item__body-send-signal" onClick={() => handleSelectItem(r)}>Send signal</button>
						</div>
					</div>
				)}
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
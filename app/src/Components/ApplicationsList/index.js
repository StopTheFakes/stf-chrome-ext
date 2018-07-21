
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import Countdown from 'react-countdown-now';

import { connect } from 'react-redux';

import OuterComponent from 'Components/Outer';

import { takenApplications } from 'Services/Api';
import { setTakenRequests, setMode, setCurrentItem } from 'Services/Store';

import moment from 'moment';

import './index.styl';


const handleSelectItem = item => {
	chrome.storage.local.set({ currentItem: item }, () => {
		setCurrentItem(item);
		setMode('application-view');
	});
};


class ApplicationsList extends Component {

	componentDidMount() {
		takenApplications(this.props.token).then(data => setTakenRequests(data.data));
	}


	render() {
		let { takenRequests = [] } = this.props;
		return (
			<OuterComponent>
				{takenRequests.map(r =>
					<div className="app-item">
						<div className="app-item__head">
							<div className="app-item__head-city">{r.country}, {r.cities} cities</div>
							<div className="app-item__head-date">{moment(r.created).format('DD/MM/YYYY')}</div>
						</div>
						<div className="app-item__body">
							<div className="app-item__body-head">{r.title}</div>
							<Countdown
								date={moment(r.expires)}
								renderer={({ days, hours, minutes }) => {
									hours = ((parseInt(days) || 0) * 24) + (parseInt(hours) || 0);
									return (<div className="app-item__body-time">{hours}:{minutes}</div>);
								}}
							/>
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
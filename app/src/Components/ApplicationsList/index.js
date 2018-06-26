
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import OuterComponent from 'Components/Outer';

import { takenApplications } from 'Services/Api';
import { setTakenRequests, setHeading, setMode, setCurrentItem } from 'Services/Store';


const styles = () => ({});

const handleSelectItem = item => {
	setMode('application-view');
	setCurrentItem(item);
};


class ApplicationsList extends Component {

	constructor(props, context){
		super(props, context);
		this.state = {
		};
	}


	componentDidMount() {
		let { token } = this.props;
		takenApplications(token).then(data => setTakenRequests(data.data));
		setHeading('Requests list');
	}


	render() {
		let { takenRequests } = this.props;
		takenRequests = takenRequests || [];
		return (
			<OuterComponent>
				<List component="nav">
					{takenRequests.map(item =>
						<ListItem button onClick={() => handleSelectItem(item)}>
							<ListItemText
								primary={item.title}
								secondary={`Cost: ${item.screenshot_cost} (Jan 9, 2014)`}
							/>
						</ListItem>
					)}
				</List>
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
}))(withStyles(styles)(ApplicationsList));

import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import OuterComponent from 'Components/Outer';

import { setToken } from 'Services/Auth';

import './index.styl';


class MenuView extends Component {

	render() {
		return (
			<OuterComponent>
				<div className="menu-outer">
					<button className="menu-outer__exit" onClick={() => setToken(null)}>Exit</button>
				</div>
			</OuterComponent>
		);
	}

}


MenuView.propTypes = {
	token: PropTypes.any,
};


export default connect(state => ({
	token: state.authToken,
}))(MenuView);
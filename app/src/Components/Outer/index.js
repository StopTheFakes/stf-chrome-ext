
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { setToken } from 'Services/Auth';

import { setMode, setCurrentItem } from 'Services/Store';

import './index.styl';


class ApplicationsList extends Component {

	constructor(props, context){
		super(props, context);
		this.state = {
			anchorEl: false
		};
	}


	componentDidMount() {
		chrome.storage.local.get(['currentItem'], result => {
			let { currentItem } = result;
			setMode(currentItem ? 'application-view' : null);
			setCurrentItem(currentItem);
		});
	}


	handleIconCLick(target) {
		let { currentItem } = this.props;
		if (currentItem) {
			setMode(null);
			setCurrentItem(null);
			chrome.storage.local.set({ currentItem: null });
		} else {
			this.setState({anchorEl: target});
		}
	}


	render() {
		let { children } = this.props;
		return (
			<div className="main-outer">
				{children}
			</div>
		);
		/*let { classes, children, heading, currentItem } = this.props;
		let { anchorEl } = this.state;
		return (
			<Card className={classes.card}>
				<div className={classes.root}>
					<AppBar>
						<Toolbar>
							<IconButton
								className={classes.menuButton}
								color="inherit"
								aria-label="Menu"
								onClick={e => this.handleIconCLick(e.target)}
							>
								{!!currentItem ? <ArrowBack /> : <MenuIcon />}
							</IconButton>
							<Typography variant="title" color="inherit" className={classes.flex}>
								{heading}
							</Typography>
							<IconButton aria-haspopup="true" color="inherit">
								<AccountCircle />
							</IconButton>
							<Typography variant="subheading" color="inherit">
								Tester
							</Typography>
							<Menu
								anchorEl={anchorEl}
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								open={!!anchorEl}
								onClose={() => this.setState({anchorEl: null})}
							>
								<MenuItem onClick={() => this.setState({anchorEl: null})}>Requests list</MenuItem>
								<MenuItem onClick={() => setToken(null)}>Logout</MenuItem>
								<MenuItem onClick={() => chrome.tabs.create({url: 'http://stf.glissmedia.ru/'})}>View Requests</MenuItem>
							</Menu>
						</Toolbar>
					</AppBar>
				</div>
				<CardContent className={classes.contentOuter}>
					{children}
				</CardContent>
			</Card>
		);*/
	}
}


ApplicationsList.propTypes = {
	token: PropTypes.any,
	heading: PropTypes.any,
	currentItem: PropTypes.any,
};


export default connect(state => ({
	token: state.authToken,
	heading: state.heading,
	currentItem: state.currentItem,
}))(ApplicationsList);
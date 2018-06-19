
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBack from '@material-ui/icons/ArrowBack';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { setToken } from 'Services/Auth';

import { setMode, setCurrentItem } from 'Services/Store';


const styles = () => ({
	card: {
		maxWidth: 500,
		minWidth: 500,
		minHeight: 300,
		maxHeight: 600,
		overflow: 'auto'
	},
	root: {
		flexGrow: 1,
	},
	flex: {
		flex: 1,
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
	contentOuter: {
		paddingTop: 70
	}
});


class ApplicationsList extends Component {

	constructor(props, context){
		super(props, context);
		this.state = {
			anchorEl: false
		};
	}


	handleIconCLick(target) {
		let { currentItem } = this.props;
		if (currentItem) {
			setMode(null);
			setCurrentItem(null);
		} else {
			this.setState({anchorEl: target});
		}
	}


	render() {
		let { classes, children, heading, currentItem } = this.props;
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
							</Menu>
						</Toolbar>
					</AppBar>
				</div>
				<CardContent className={classes.contentOuter}>
					{children}
				</CardContent>
			</Card>
		);
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
}))(withStyles(styles)(ApplicationsList));
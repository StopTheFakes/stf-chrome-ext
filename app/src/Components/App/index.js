import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

import Card        from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography  from '@material-ui/core/Typography';
import Button      from '@material-ui/core/Button';
import TextField   from '@material-ui/core/TextField';

import './index.styl';


const styles = theme => ({
	card: {
		maxWidth: 400,
		minWidth: 300,
	},
	input: {
		marginBottom: 15
	},
	actions: {
		paddingBottom: 20
	}
});


class App extends Component {

	constructor(props, context){
		super(props, context);
		this.state = {
			img: null
		};
	}


	handle() {
		chrome.tabs.captureVisibleTab(null, {}, img => this.setState({ img }));
	}


	render() {
		const { classes } = this.props;
		return (
			<Card className={classes.card}>
				<CardContent>
					<Typography color="textSecondary" align="center" variant="title">Login</Typography>
					<TextField fullWidth label="Login" className={classes.input} />
					<TextField fullWidth label="Password" type="password" className={classes.input} />
				</CardContent>
				<CardActions className={classes.actions}>
					<Button fullWidth color="primary" variant="contained" onClick={this.handle.bind(this)}>Login</Button>
				</CardActions>
				{this.state.img &&
					<img src={this.state.img} alt="" style={{width: '100%'}} />
				}
			</Card>
		);
	}
}

export default withStyles(styles)(App);
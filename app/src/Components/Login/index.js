
import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

import Card        from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography  from '@material-ui/core/Typography';
import Button      from '@material-ui/core/Button';
import TextField   from '@material-ui/core/TextField';

import { login } from 'Services/Api';

import { setToken } from 'Services/Auth';


const styles = () => ({
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


class Login extends Component {
	constructor(props, context){
		super(props, context);
		this.state = {
			email: '',
			password: '',

			emailError: null,
			passwordError: null
		};
	}


	handleLogin() {
		let s = {email: '', password: '', ...this.state};
		let email = s.email.trim();
		let password = s.password.trim();
		if (email === '' || password === '') {
			this.setState({
				emailError: email === '' ? 'Enter email' : null,
				passwordError: password === '' ? 'Enter password' : null,
			});
			return;
		}
		this.setState({ emailError: null, passwordError: null });
		login(email, password).then(data => {
			if (data.success && data.token) {
				setToken(data.token);
			} else {
				this.setState({ passwordError: 'Пользователь не найден' });
			}
		});
	}


	render() {
		let { classes } = this.props;
		let { email, emailError, password, passwordError } = this.state;
		return (
			<Card className={classes.card}>
				<CardContent>
					<Typography color="textSecondary" align="center" variant="title">Login</Typography>
					<TextField
						fullWidth
						label="E-mail"
						className={classes.input}
						value={email}
						onChange={e => this.setState({email: e.target.value})}
						helperText={emailError}
						error={!!emailError}
					/>
					<TextField
						fullWidth
						label="Password"
						type="password"
						className={classes.input}
						value={password}
						onChange={e => this.setState({password: e.target.value})}
						helperText={passwordError}
						error={!!passwordError}
					/>
				</CardContent>
				<CardActions className={classes.actions}>
					<Button
						fullWidth
						color="primary"
						variant="contained"
						onClick={this.handleLogin.bind(this)}
					>Login</Button>
				</CardActions>
			</Card>
		);
	}
}


export default withStyles(styles)(Login);

import React, { Component } from 'react';


import { login } from 'Services/Api';

import { setToken } from 'Services/Auth';

import '../common.styl';
import './index.styl';


const openLink = e => chrome.tabs.create({url: e.target.href});


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
			if (data.token) {
				setToken(data.token);
			} else {
				this.setState({ passwordError: 'Пользователь не найден' });
			}
		});
	}


	handleKeyPress(e) {
		if (e.charCode === 13) {
			this.handleLogin();
		}
	}


	render() {
		let { email, emailError, password, passwordError } = this.state;
		return (
			<div className="login__outer">
				<div className="login__form">
					<label className={`login__input email ${emailError ? 'error' : ''}`}>
						<input
							type="text"
							placeholder="E-mail"
							value={email}
							onChange={e => this.setState({email: e.target.value})}
							onKeyPress={this.handleKeyPress.bind(this)}
						/>
						{!!emailError && <span className="login__input-err-box">{emailError}</span>}
					</label>
					<label className={`login__input password ${passwordError ? 'error' : ''}`}>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={e => this.setState({password: e.target.value})}
							onKeyPress={this.handleKeyPress.bind(this)}
						/>
						{!!passwordError && <span className="login__input-err-box">{passwordError}</span>}
					</label>
				</div>
				<button className="login__button" onClick={this.handleLogin.bind(this)}>Sign in</button>
				<div className="login__links">
					<a href="http://stf.glissmedia.ru/" onClick={openLink}>Register</a>
					<span> / </span>
					<a href="http://stf.glissmedia.ru/" onClick={openLink}>Remember password</a>
				</div>
			</div>
		);
	}
}


export default Login;
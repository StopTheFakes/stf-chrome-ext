
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import OuterComponent from 'Components/Outer';

import { sendSignal } from 'Services/Api';
import { setMode, setCurrentItem } from 'Services/Store';

import './index.styl';


const handleBack = fn => {
	chrome.storage.local.set({ currentItem: null }, () => {
		fn && fn();
		setCurrentItem(null);
		setMode('applications-list');
	});
};

const urltoFile = (url, filename, mimeType) => {
	mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
	return fetch(url)
			.then(res => res.arrayBuffer())
			.then(buf => new File([ buf ], filename, { type: mimeType }));
};


class ApplicationView extends Component {

	constructor(props, context){
		super(props, context);
		this.state = {
			screenshots: [],
			currentScreenshot: null,
			minScreenshots: 5,
			maxScreenshots: 5,
			isSendSignal: false,
			offenderEmail: '',
			offenderEmailSrc: '',
			information: '',
		};
	}


	componentDidMount() {
		this.reloadScreenshots();
	}


	componentDidUpdate() {
		this.reloadScreenshots();
	}


	reloadScreenshots() {
		let { item } = this.props;
		if (item) {
			chrome.storage.local.get(['screenshots'], result => {
				let { screenshots = {} } = result;
				this.setState({ screenshots: (screenshots[item.id] || []).filter(i => !!i) });
			});
		}
	}


	makeScreenshot() {
		let { screenshots, maxScreenshots } = this.state;
		if (screenshots.length < maxScreenshots) {
			chrome.tabs.captureVisibleTab(null, {}, img => {
				screenshots.push({ id: screenshots.length, img });
				this.updateScreenshots(screenshots);
			});
		}
	}


	removeScreen() {
		let { screenshots, currentScreenshot } = this.state;
		if (currentScreenshot !== null) {
			screenshots.splice(currentScreenshot, 1);
			screenshots = screenshots.map((s, i) => ({...s, id: i}));
			this.updateScreenshots(screenshots);
			this.setState({currentScreenshot: null})
		}
	}


	updateScreenshots(newScreenshots) {
		let { item } = this.props;
		this.setState({screenshots: [...newScreenshots]});
		chrome.storage.local.get(['screenshots'], result => {
			let { screenshots = {} } = result;
			screenshots[item.id] = newScreenshots;
			chrome.storage.local.set({ screenshots });
		});
	}


	checkoutToSendSignal() {
		let { screenshots, minScreenshots } = this.state;
		if (screenshots.length >= minScreenshots) {
			this.setState({isSendSignal: true});
		}
	}


	sendSignal() {
		let { token, item } = this.props;
		let { screenshots, offenderEmail, offenderEmailSrc, information } = this.state;
		if (information.length >= 30) {
			let data = {
				url: '',
				information,
				offenderEmail,
				offenderEmailSrc,
				offenderUrl: '',
				location: '',
				screenshots: []
			};
			(new Promise(res => {
				chrome.tabs.query({active: true, currentWindow: true}, tabs => {
					res(tabs[0].url);
				});
			}))
				.then(url => {
					data.url = url;
					return Promise.all(screenshots.map((s, i) => urltoFile(s.img, `screen-${i}.png`)));
				})
				.then(list => {
					list.forEach(f => data.screenshots.push(f));
					return sendSignal(item.claim_id, data, token);
					/*return (new Promise(res => {
						chrome.tabs.query({active: true, currentWindow: true}, tabs => {
							chrome.tabs.sendMessage(tabs[0].id, { command: 'request-geo' }, response => {
								if (response && response.coords) {
									data.location = response.coords.latitude + ',' + response.coords.longitude;
								}
								res();
							});
						});
					}));*/
				})
				//.then(() => sendSignal(item.claim_id, data, token))
				.then(data => {
					if (data && data.success) {
						chrome.storage.local.get(['screenshots'], result => {
							let { screenshots = {} } = result;
							delete screenshots[item.id];
							chrome.storage.local.set({ screenshots });
							handleBack(() => this.setState({isSendSignal: false}));
						});
					}
				});
		}
	}


	render() {
		let { isSendSignal } = this.state;
		return isSendSignal ? this.renderSendSignalView() : this.renderMakeScreenshotsView();
	}


	renderSendSignalView() {
		let { offenderEmail, offenderEmailSrc, information } = this.state;
		return (
			<OuterComponent>
				<div className="send-signal">
					<div className="send-signal__card">
						<div className="send-signal__card-head">
							<div
								className="send-signal__card-head-back"
								onClick={() => this.setState({isSendSignal: false})}
							>Back</div>
						</div>
						<div className="send-signal__card-body">
							<div className="send-signal__card-label">
								<strong>Enter the offender's email if you know it.</strong>
								<input
									type="text"
									value={offenderEmail}
									className="send-signal__card-input email"
									placeholder="E-mail"
									onChange={e => this.setState({offenderEmail: e.target.value})}
								/>
							</div>
						</div>
					</div>
					{offenderEmail !== '' &&
						<div className="send-signal__card gray">
							<div className="send-signal__card-body">
								<div className="send-signal__card-label">
									<span>Where did you find out about the offender's email?</span>
									<input
										type="text"
										value={offenderEmailSrc}
										onChange={e => this.setState({offenderEmailSrc: e.target.value})}
										className="send-signal__card-input"
									/>
								</div>
							</div>
						</div>
					}
					<div className="send-signal__card">
						<div className="send-signal__card-body">
							<div className="send-signal__card-label">
								<span>Add the address and other information relevant to the right holder</span>
								<textarea
									className="send-signal__card-textarea"
									placeholder="No less than 30 signs!"
									value={information}
									onChange={e => this.setState({information: e.target.value})}
								/>
							</div>
							<button
								className={`send-signal__send-button ${information.length >= 30 ? 'active' : ''}`}
								onClick={this.sendSignal.bind(this)}
							>Send signal</button>
						</div>
					</div>
				</div>
			</OuterComponent>
		);
	}


	renderMakeScreenshotsView() {
		let { screenshots, currentScreenshot, minScreenshots, maxScreenshots } = this.state;
		let len = screenshots.length;
		return (
			<div className="signal-outer">
				<div className="signal-outer__screenshots">
					<div className="signal-outer__screenshots-list">
						{screenshots.map(s =>
							<div
								key={s.id}
								className="signal-outer__screenshot-small"
								style={{backgroundImage: `url(${s.img})`}}
								onClick={() => this.setState({currentScreenshot: s.id})}
							/>
						)}
					</div>
					{currentScreenshot !== null && !!screenshots[currentScreenshot] &&
					<div className="signal-outer__screenshot-current">
						<img src={screenshots[currentScreenshot].img} />
						<button className="signal-outer__screenshot-current-remove" onClick={this.removeScreen.bind(this)} />
					</div>
					}
				</div>
				<div className="signal-outer__send">
					<button
						className={`signal-outer__send-button ${len >= minScreenshots ? 'active' : ''}`}
						onClick={this.checkoutToSendSignal.bind(this)}
					>Send signal</button>
				</div>
				<div className="signal-outer__nav">
					<button className="signal-outer__nav-back" onClick={handleBack}>Back</button>
					<button
						className={`signal-outer__nav-screenshot ${len >= maxScreenshots ? 'inactive' : ''}`}
						onClick={this.makeScreenshot.bind(this)}
					/>
				</div>
			</div>
		);
	}
}


ApplicationView.propTypes = {
	token: PropTypes.any,
	item: PropTypes.any,
};


export default connect(state => ({
	token: state.authToken,
	item: state.currentItem,
}))(ApplicationView);

import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import OuterComponent from 'Components/Outer';

import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBox from '@material-ui/icons/CheckBox';
import Delete from '@material-ui/icons/Delete';
import ScreenShare from '@material-ui/icons/ScreenShare';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import TextField from '@material-ui/core/TextField';

import { setHeading } from 'Services/Store';
import { application, sendSignal } from 'Services/Api';


const styles = theme => ({
	card: {
		maxWidth: 400,
	},
	actions: {
		display: 'flex',
	},
	avatar: {
		width: 50
	},
	text: {
		marginBottom: 20
	},
	icon: {
		color: 'rgba(255, 255, 255, 0.8)',
	},
	input: {
		color: 'rgba(255, 255, 255, 1)',
	}
});


class ApplicationView extends Component {

	constructor(props, context){
		super(props, context);
		this.state = {
			item: null,
			screenshots: []
		};
	}


	componentDidMount() {
		let { currentItem, token } = this.props;
		setHeading('Loading...');
		application(currentItem.id, token)
			.then(item => {
				this.setState({ item });
				setHeading(item.title);
				chrome.storage.local.get(['screenshots'], result => {
					let { screenshots = {} } = result;
					this.setState({ screenshots: (screenshots[item.id] || []).filter(i => !!i) });
				});
			});
	}


	makeScreenshot() {
		let { screenshots } = this.state;
		chrome.tabs.captureVisibleTab(null, {}, img => {
			screenshots.push({ id: screenshots.length, img, desc: '' });
			this.updateScreenshots(screenshots);
		});
	}


	setScreenDesc(id, desc) {
		let { screenshots } = this.state;
		if (screenshots[id]) {
			screenshots[id].desc = desc;
			this.updateScreenshots(screenshots);
		}
	}


	removeScreen(id) {
		let { screenshots } = this.state;
		screenshots.splice(id, 1);
		screenshots = screenshots.map((s, i) => ({...s, id: i}));
		this.updateScreenshots(screenshots);
	}


	updateScreenshots(newScreenshots) {
		let { item } = this.state;
		this.setState({screenshots: [...newScreenshots]});
		chrome.storage.local.get(['screenshots'], result => {
			let { screenshots = {} } = result;
			console.log(screenshots);
			screenshots[item.id] = newScreenshots;
			chrome.storage.local.set({ screenshots });
		});
	}


	sendSignal() {
		let { token } = this.props;
		let { item, screenshots } = this.state;
		let data = {
			description: null,
			url: null,
			email: null,
			email_title: null,
			address: null,
			image: screenshots.map(i => ({img: i.img, desc: i.desc})),
			video: null,
			status: null
		};
		sendSignal(item.id, data, token)
			.then(data => console.log(data));
	}


	render() {
		let { classes } = this.props;
		let { item, screenshots } = this.state;
		item = {
			country_id: 0,
			city_id: 0,
			category: '',
			accepted: [],
			usage_rights: '',
			screenshot_cost: '',
			description: '',
			recommendation: '',
			...(item || {})
		};
		return (
			<OuterComponent>
				<CardHeader
					avatar={
						<img src="http://stf.glissmedia.ru/img/icons/active-circle.svg" className={classes.avatar} alt=""/>
					}
					title={item.title}
					subheader={`Country: ${item.country_id}${item.city_id ? `, ${item.city_id}` : ''}`}
				/>

				<CardContent>

					<List component="nav">
						<ListItem>
							<ListItemIcon>
								<CheckBox />
							</ListItemIcon>
							<ListItemText inset primary={`Topic: ${item.category}`} />
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<CheckBox />
							</ListItemIcon>
							<ListItemText inset primary={`Accepted: ${item.accepted.join(', ')}`} />
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<CheckBox />
							</ListItemIcon>
							<ListItemText inset primary={`Usage rights: ${item.usage_rights}`} />
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<CheckBox />
							</ListItemIcon>
							<ListItemText inset primary={`Cost: ${item.screenshot_cost} STF`} />
						</ListItem>
					</List>

					<Typography variant="subheading">Description</Typography>
					<Typography component="p" className={classes.text}>{item.description}</Typography>

					<Typography variant="subheading">Tips</Typography>
					<Typography component="p" className={classes.text}>{item.recommendation}</Typography>

					<GridList cols="1">
						{screenshots.map(s =>
							<GridListTile key={s.id} cols="1">
								<img src={s.img} />
								<GridListTileBar
									title={
										<TextField
											fullWidth
											label="Description"
											InputProps={{
												classes: {
													root: classes.input,
													input: classes.input,
												},
											}}
											InputLabelProps={{
												className: classes.input,
											}}
											value={s.desc}
											onChange={e => this.setScreenDesc(s.id, e.target.value)}
										/>
									}
									actionIcon={
										<IconButton className={classes.icon} onClick={() => this.removeScreen(s.id)}>
											<Delete />
										</IconButton>
									}
								/>
							</GridListTile>
						)}
					</GridList>

				</CardContent>

				<CardActions className={classes.actions} disableActionSpacing>
					<IconButton aria-label="Make screenshot" onClick={this.makeScreenshot.bind(this)}>
						<ScreenShare />
					</IconButton>
					<IconButton aria-label="Make screenshot" onClick={this.sendSignal.bind(this)}>
						<SendIcon />
					</IconButton>
				</CardActions>

			</OuterComponent>
		);
	}
}


ApplicationView.propTypes = {
	token: PropTypes.any,
	currentItem: PropTypes.any,
};


export default connect(state => ({
	token: state.authToken,
	currentItem: state.currentItem,
}))(withStyles(styles)(ApplicationView));

import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import OuterComponent from 'Components/Outer';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import red from '@material-ui/core/colors/red';
import classnames from 'classnames';

import { setHeading } from 'Services/Store';
import { application } from 'Services/Api';


const styles = theme => ({
	card: {
		maxWidth: 400,
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	actions: {
		display: 'flex',
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
		marginLeft: 'auto',
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	avatar: {
		backgroundColor: red[500],
	},
});


class ApplicationView extends Component {

	constructor(props, context){
		super(props, context);
		this.state = {
			item: null,
			expanded: false
		};
	}
// {"id":1,"user_id":"1","title":"Testing Request (editable)","type":"online","country_id":"1","category":"Automobile","object":[4,1,2],"description":"Sometimes you may need to create more advanced where clauses such as \"where exists\" clauses or nested parameter groupings. The Laravel query builder can handle these as well. To get started, let's look at an example of grouping constraints within parenthesis","picture_method":"0","picture_cost":"74.61","video_method":"0","video_cost":"42.43","accepted":["wholesale","stationary_who","distance_who","catalogue","corporate","personal"],"usage_rights":"Adidas","rights":null,"recommendation":"Sometimes you may need to create more advanced where clauses such as \"where exists\" clauses or nested parameter groupings.","confirmation":"1","status":"1","created_at":"2018-02-27 10:14:39","updated_at":"2018-02-27 14:08:37","screenshot_method":"1","screenshot_cost":"28.15","current":"0","city_id":null}

	componentDidMount() {
		setHeading('Loading...');
		application(this.props.currentItem.id, this.props.token)
			.then(item => {
				this.setState({ item });
				setHeading(item.title);
			});
	}


	render() {
		let { classes } = this.props;
		return (
			<OuterComponent>
					<CardHeader
						avatar={
							<Avatar aria-label="Recipe" className={classes.avatar}>
								R
							</Avatar>
						}
						action={
							<IconButton>
								<MoreVertIcon />
							</IconButton>
						}
						title="Shrimp and Chorizo Paella"
						subheader="September 14, 2016"
					/>
					<CardMedia
						className={classes.media}
						image="https://material-ui.com/static/images/cards/paella.jpg"
						title="Contemplative Reptile"
					/>
					<CardContent>
						<Typography component="p">
							This impressive paella is a perfect party dish and a fun meal to cook together with
							your guests. Add 1 cup of frozen peas along with the mussels, if you like.
						</Typography>
					</CardContent>
					<CardActions className={classes.actions} disableActionSpacing>
						<IconButton aria-label="Add to favorites">
							<FavoriteIcon />
						</IconButton>
						<IconButton aria-label="Share">
							<ShareIcon />
						</IconButton>
						<IconButton
							className={classnames(classes.expand, {
								[classes.expandOpen]: this.state.expanded,
							})}
							onClick={() => this.setState({ expanded: !this.state.expanded })}
							aria-expanded={this.state.expanded}
							aria-label="Show more"
						>
							<ExpandMoreIcon />
						</IconButton>
					</CardActions>
					<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
						<CardContent>
							<Typography paragraph variant="body2">
								Method:
							</Typography>
							<Typography paragraph>
								Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
								minutes.
							</Typography>
							<Typography paragraph>
								Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
								heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
								browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving
								chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion,
								salt and pepper, and cook, stirring often until thickened and fragrant, about 10
								minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
							</Typography>
							<Typography paragraph>
								Add rice and stir very gently to distribute. Top with artichokes and peppers, and
								cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes.
								Reduce heat to medium-low, add reserved shrimp and mussels, tucking them down into
								the rice, and cook again without stirring, until mussels have opened and rice is
								just tender, 5 to 7 minutes more. (Discard any mussels that don’t open.)
							</Typography>
							<Typography>
								Set aside off of the heat to let rest for 10 minutes, and then serve.
							</Typography>
						</CardContent>
					</Collapse>
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
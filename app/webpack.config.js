"use strict";

const { DefinePlugin } = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { resolve } = require("path");

const ENV = process.env.NODE_ENV || 'development';

const DIST_PATH = 'src';

const isDevelopment = ENV === 'development';

module.exports = {
	devtool: "source-map",

	watch: isDevelopment,

	entry: {
		app: resolve(__dirname, DIST_PATH, 'App.js')
	},

	mode: ENV,

	output: {
		path:          resolve(__dirname, '../ext/dist/'),
		filename:      '[name].bundle.js',
		chunkFilename: '[name].chunk-1.js',
		publicPath:    'dist/'
	},

	module: {
		rules: [
			{
				test: /.jsx?$/,
				include: [ resolve(DIST_PATH) ],
				loader: 'babel-loader'
			},
			{
				test: /.styl$/,
				include: [resolve(DIST_PATH)],
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader",
						options: {
							minimize: !isDevelopment
						}
					},
					{
						loader: "stylus-loader"
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader",
						options: {
							minimize: !isDevelopment
						}
					},
				]
			},
			{
				test: /\.(jpe?g|png|gif|svg|eot|woff|ttf|woff2)/,
				loader: 'file-loader'
			}
		]
	},

	resolve: {
		modules: ['node_modules', resolve(DIST_PATH)]
	},

	plugins: [
		new DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(ENV)
			}
		}),
		...(isDevelopment ? [] : [ new UglifyJsPlugin() ])
]

};
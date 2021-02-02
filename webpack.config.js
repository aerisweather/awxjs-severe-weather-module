const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const PACKAGE = require('./package.json');
const MODULE_NAME = PACKAGE.moduleName || 'SampleModule';
const IS_PROD = (process.env.NODE_ENV === 'production');

const banner = (`
${PACKAGE.name} - ${PACKAGE.version}
(c) ${new Date().getFullYear()} ${PACKAGE.author}
License: ${PACKAGE.license}
${PACKAGE.homepage}
`);

// setup environment configuration
const env = dotenv.config().parsed;
env.NODE_ENV = JSON.stringify('production');
const envKeys = Object.keys(env).reduce((prev, next) => {
	prev[`process.env.${next}`] = JSON.stringify(env[next]);
	return prev;
}, {});

const getPlugins = () => {
	let plugins = [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			inject: true,
			title: 'Aeris JS - Map Module',
			template: 'public/template.html',
			alwaysWriteToDisk: true,
			aeris: {
				clientId: env.AERIS_CLIENT_ID,
				clientSecret: env.AERIS_CLIENT_SECRET
			}
		}),
		new HtmlWebpackHarddiskPlugin({
			outputPath: path.resolve(__dirname, 'public')
		})
	];

	if (IS_PROD) {
		plugins.push(new webpack.DefinePlugin(envKeys));
		plugins.push(new webpack.HashedModuleIdsPlugin());
		plugins.push(new webpack.BannerPlugin({
			banner: banner
		}));
	} else {
		plugins.push(new BundleAnalyzerPlugin());
	}

	return plugins;
};

module.exports = () => {
	const outputFileName = PACKAGE.name.replace(/-module$/, '');
	return {
		mode: IS_PROD ? 'production' : 'development',
		entry: './src/index.ts',
		output: {
			path: path.join(__dirname, 'dist'),
			publicPath: './dist/',
			filename: IS_PROD ? `${outputFileName}.min.js` : `${outputFileName}.js`,
			chunkFilename: '[name].js',
			library: [MODULE_NAME],
			libraryExport: 'default',
			libraryTarget: 'umd',
			umdNamedDefine: true,
			globalObject: 'this'
		},
		resolve: {
			extensions: ['.js', '.jsx', '.ts', '.tsx']
		},
		module: {
			rules: [{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},{
				test: /\.tsx?$/,
				use: [{
					loader: 'babel-loader'
				},{
					loader: 'ts-loader'
				}],
				exclude: /node_modules/
			}]
		},
		optimization: {
			minimizer: [
				new TerserPlugin({
					extractComments: false,
					exclude: /\/public/,
				})
			],
			splitChunks: {
				automaticNameDelimiter: '-'
			},
			runtimeChunk: false
		},
		plugins: getPlugins(),
		devtool: IS_PROD ? 'source-map' : 'inline-source-map',
		devServer: {
			contentBase: path.join(__dirname, 'public'),
			open: true,
			publicPath: '/dist/',
			stats: 'errors-only'
		}
	};
};

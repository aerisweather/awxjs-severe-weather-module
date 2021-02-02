module.exports = {
	presets: [
		['@babel/preset-env', {
			targets: {
				browsers: [
					'> 0.25%',
					'not dead',
					'not ie < 11'
				]
			},
			corejs: { version: 3 }
		}]
	],
	plugins: [
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-transform-runtime',
		'add-module-exports'
	]
};

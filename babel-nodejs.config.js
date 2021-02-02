module.exports = {
	presets: [
		['@babel/preset-env', {
			modules: 'commonjs',
			targets: {
				node: 8
			},
			useBuiltIns: false,
			debug: true
		}]
	],
	plugins: [
		'add-module-exports'
	]
};

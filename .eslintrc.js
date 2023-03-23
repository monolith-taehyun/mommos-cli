module.exports = {
	env: {
		browser: false,
		es6: true,
		node: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
  rules: {
    no-unused-labels: 'warn',
  },
};

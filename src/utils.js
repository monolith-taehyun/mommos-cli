const to = require('to-case');
const fileReader = require('html-wiring');
const ucfirst = require('ucfirst');

function genVariousCases(input) {
	return {
		input: input,
		slug: to.slug(input),
		pascal: to.pascal(input),
		camel: to.camel(input),
		capital: to.capital(input),
		dot: to.dot(input),
		constant: to.constant(input),
		sentence: to.sentence(input),
		snake: to.snake(input),
		space: to.space(input),
		title: to.title(input),
	};
}

module.exports = { genVariousCases };

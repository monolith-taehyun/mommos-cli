const fs = require('fs');
const to = require('to-case');
// const fileReader = require('html-wiring');
// const ucfirst = require('ucfirst');

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

function toDot(input) {
	return to.dot(input);
}

function toPascal(input) {
	return to.pascal(input);
}

function replace(input, regex, replacement) {
	return input.replaceAll(regex, replacement);
}

function getInnerString(str) {
	const firstDotIndex = str.indexOf('.');
	const lastDotIndex = str.lastIndexOf('.');
	if (firstDotIndex === -1 || lastDotIndex === -1 || firstDotIndex === lastDotIndex) {
		// 문자열에 "."가 없거나, "."가 한 개만 있거나, 첫번째와 마지막 "." 사이에 문자열이 없을 경우
		return '';
	}
	return str.substring(firstDotIndex + 1, lastDotIndex);
}

function getConfigJson(configFile) {
	if (fs.existsSync(configFile) === false) {
		return {};
	}
	const mmmrc = fs.readFileSync(configFile, 'utf8');
	const config = JSON.parse(mmmrc);
	return config;
}

function writeJsonWithoutDuplicates(filePath, data) {
	if (fs.existsSync(filePath) === false) {
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
	} else {
		const fileData = fs.readFileSync(filePath, 'utf8');
		const existsData = JSON.parse(fileData);
		const mergedData = {
			...existsData,
			...data,
		};
		fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2));
	}
}

function schemaRegistryApiResponse(result) {
	return JSON.parse(result.responseData);
}

function isLatestVersion(currentVersion, latestVersion) {
	const current = currentVersion.replace(/^v/, '').split('.').map(Number);
	const latest = latestVersion.replace(/^v/, '').split('.').map(Number);

	for (let i = 0; i < 3; i++) {
		if (latest[i] > current[i]) {
			return false;
		} else if (latest[i] < current[i]) {
			return true;
		}
	}

	return true;
}

module.exports = {
	genVariousCases,
	toDot,
	toPascal,
	replace,
	getInnerString,
	getConfigJson,
	writeJsonWithoutDuplicates,
	schemaRegistryApiResponse,
	isLatestVersion,
};

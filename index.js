#! /usr/bin/env node

var symbols = require('log-symbols'),
	request = require('request'),
	open    = require('open'),
	pkg     = require('./package.json'),
	userArgs, input, path;

userArgs = process.argv.slice(2);
input = userArgs[0];

if (!input || userArgs.indexOf('--help') !== -1) {
	help();
	return;
}

if (userArgs.length === 2 && userArgs[1] == '-r') {
	if ( ! input.match(/[a-zA-Z](?:\.)[a-zA-Z]/)) {
		console.log("Invalid domain name");
		return;
	}
	else {
		console.log("Opening browser to register " + input);
		setTimeout(function() {
			open('https://domainr.com/api/register?domain='+input);
		}, 1000);
		return;
	}
}

path = 'https://domainr.com/api/json/search?q='+input+'&client_id=is-available';

search();

function search() {
	request(path, function (error, response, body) {
		var results = JSON.parse(body);
		results = results.results;

		for (var i = results.length - 1; i >= 0; i--) {
			var available, completeDomain, domain = results[i];

			switch (domain.availability) {
				case 'tld':
					available = symbols.info;
					break;
				case 'unavailable':
					available = symbols.error;
					break;
				case 'taken':
					available = symbols.error;
					break;
				case 'available':
					available = symbols.success;
					break;
			}

			completeDomain = domain.domain + domain.path + ' ' + available;
			console.log(completeDomain);
		};
	});
}

function help() {
	console.log([
		'',
		'  ' + pkg.description,
		'',
		'  Search',
		'  ------ ',
		'    isav tearawaytrousers',
		'',
		'        tearawaytrousers.io ' + symbols.success,
		'        tearawaytrousers.com ' + symbols.error,
		'',
		'  Register a domain',
		'  ----------------- ',
		'    isav tearawaytrousers.io -r',
		'',
		'        Opening browser to register tearawaytrousers.io',
		''
	].join('\n'));
}


var fs = require('fs');
var path = require('path');

var pull = require('./');
var host = process.argv[2];
var outputFile = process.argv[3]
		? path.resolve(process.argv[3])
		: (process.cwd() + '/products.json');

pull(host,
	function(err, masterHash) {
		console.log('All categories scraped!');
		fs.writeFileSync(outputFile, JSON.stringify(masterHash));
		console.log('Wrote to disk.');
	},
	5, 
	function(type) {
		console.log('Downloading: ' + type);
	},
	function(type) {
		console.log('Finished: ' + type);
	}
);

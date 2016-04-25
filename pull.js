var fs = require('fs');
var request = require('request-json');
var async = require('async');

var API = request.createClient('https://' + process.argv[2] + '.com');


API.get('/collections.json', function(err, res, body) {
	var collectionHandles = body.collections.map(function(collection) {
		return collection.handle;
	});
	var masterHash = {};
	var q = async.queue(function(task, callback) {
	    console.log('Downloading ' + task);
	    KPAPI.get('/collections/' + task + '/products.json', function(err, res, body) {
	    	masterHash[task] = body;
	    	callback();
	    });
	}, 5);
	collectionHandles.forEach(function(handle) {
		q.push(handle);
	});
	// assign a callback
	q.drain = function() {
	    console.log('All categories scraped!');
	    fs.writeFileSync(__dirname + '/products.json', JSON.stringify(masterHash));
	    console.log('Wrote to disk.');
	};
});

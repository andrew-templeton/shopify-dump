var request = require('request-json');
var async = require('async');

module.exports = function(domain, callback, concurrency, pre, post) {
	var API = request.createClient('https://' + domain);
	API.get('/collections.json?limit=10000', function(err, res, body) {
		if (err) {
			return callback(err);
		}console.log(body.collections.length);
		var collectionHandles = body.collections.map(function(collection) {
			return collection.handle;
		});
		var masterHash = {};
		var q = async.queue(function(task, callback) {
			if (typeof pre == 'function') {
				pre(task);
			}
			API.get('/collections/' + task + '/products.json?limit=10000', function(err, res, body) {
				masterHash[task] = body;
				if (typeof post == 'function') {
					post(task);
				}
				callback();
			});
		}, concurrency || 5);
		collectionHandles.forEach(function(handle) {
			q.push(handle);
		});
		// assign a callback
		q.drain = function() {
			callback(null, masterHash);
		};
	});
};

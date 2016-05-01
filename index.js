var request = require('request-json');
var async = require('async');
var flatten = require('./flatten');

module.exports = function(domain, callback, opts) {
	opts = opts || {};
	var API = request.createClient('https://' + domain);
	API.get('/collections.json?limit=10000', function(err, res, collectionsBody) {
		if (err) {
			return callback(err);
		}
		var collections = collectionsBody.collections;
		var collectionHandles = collections.map(function(collection) {
			return collection.handle;
		});
		var masterHash = {};
		var q = async.queue(function(task, callback) {
			if (typeof opts.pre == 'function') {
				opts.pre(task);
			}
			API.get('/collections/' + task + '/products.json?limit=10000', function(err, res, body) {
				masterHash[task] = body;
				if (typeof opts.post == 'function') {
					opts.post(task);
				}
				callback();
			});
		}, Math.max(parseInt(opts.concurrency || 5) || 0, 5));
		collectionHandles.forEach(function(handle) {
			q.push(handle);
		});
		// assign a callback
		q.drain = function() {
			callback(null, {
				collections: collections,
				products: opts.flatten ? flatten(masterHash) : masterHash
			});
		};
	});
};

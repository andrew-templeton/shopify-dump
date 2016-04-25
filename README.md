

### Usage

`$ node pull kickpleat.com`

or, programmatically,

```
var shopifyDump = require('shopify-dump');
shopifyDump(
	process.argv[2], // Host of Shopify domain
	function(err, masterHash) { // callback to execute with hash of products
		console.log('All categories scraped!');
		fs.writeFileSync(__dirname + '/products.json', JSON.stringify(masterHash));
		console.log('Wrote to disk.');
	},
	5, // optional: concurrency, defaults to 5
	function(type) { //  optional: Pre-download of type (string handle of collection)
		console.log('Downloading: ' + type);
	},
	function(type) { //  optional: Post-download of type (string handle of collection)
		console.log('Finished: ' + type);
	}
);
```
var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');
var async = require('async');
// Instantiate a Mocha instance.
var mocha = new Mocha();


var testDir = path.resolve(__dirname)

// Add each .js file to the mocha instance

	
	
	function OuterFunction(list) {
	// some id

  async.map(list, function (product, done) {
    // for each product, update its DB entry
	   mocha.addFile(
			path.join(testDir, 'Singletestcases.js')
		);
   // Run the tests.
  setTimeout(function(){
	  var start = new Date().getTime();

mocha.reporter('list').run(function(failures){
	if(failures)
	{
		console.log(failures+' Tests failed in ' + ((new Date().getTime() - start) / 1000) + ' seconds.')
	}
	else
	{
		console.log('Tests ran successfully in ' + ((new Date().getTime() - start) / 1000) + ' seconds.');
	}

	process.exitCode = failures ? -1 : 0;  // exit with non-zero status if there were failures
	});
	}, 3000);
  }, function (err, result) {
    // all finished
    console.log('database calls done');
  });
}
var arr = new Array(2);
console.log(arr.length);
OuterFunction(arr)
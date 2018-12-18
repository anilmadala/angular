//Here is how you run mocha in code, single instance single thread.

    var mocha = require('mocha');
    var path = require('path');
	
	var testQuiet = null;
	var exit = false;
	
    //Instantiate a Mocha instance.
    var mocha = new mocha({
      userColors: false,
      reporter: 'list'
    });	
	
    var testFile = path.resolve(__dirname) + '/concurrent-test.js';

    // Add each .js file to the mocha instance
	
    mocha.addFile(testFile);

    // bail on error
	
    mocha.bail();

    var output = [];
    var originalWrite = process.stdout.write;
	
    if (testQuiet) {
      process.stdout.write = function(str) {
        output.push(str);
      };
    }
	
    // Run the tests
    var n = 3;
    var notice = setInterval(function(){
      console.log('Waiting for app to start in ' + n + ' seconds');
      n -= 1;
      if (n == 0) clearInterval(notice);
    }, 1000);
    
    setTimeout(function(){
      var start = new Date().getTime();
      console.log('Starting unit tests. at time: '+start);
      mocha.run(function(failures){
        // log
		
        if (testQuiet) process.stdout.write = originalWrite;
        // deal
        if (failures) {
			exit = true;
			
          console.log('Tests failed in ' + ((new Date().getTime() - start) / 1000) + ' seconds.');
          if (!output.length > 0) {
            for (var i = 0, j = output.length; i < j; i ++) {
              console.log(output[i].toString());
            }
          }
          if (exit) {
            console.log('Stopping application');
            process.exit(1);
          }
        } else {
          console.log('Tests ran successfully in ' + ((new Date().getTime() - start) / 1000) + ' seconds.');
          if (exit) {
            console.log('Stopping application');
            process.exit(0);
          }
        }
        process.on('exit', function () {
			
			console.log(failures);
          return process.exit(failures);  // exit with non-zero status if there were failures
        });
      });
    }, 4000);


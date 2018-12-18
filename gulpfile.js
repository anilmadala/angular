/*  	var gulp = require('gulp');
	var mochaStream = require('spawn-mocha-parallel').mochaStream;
	var mocha = mochaStream({concurrency: 10});
 
	gulp.task('test', function() {
		gulp.src('test/login.js', {read: false}) 
			.pipe(mocha)
			.on('error', console.error)
	});  */ 
	
	var gulp = require('gulp');
	var mocha = require('gulp-mocha');
		
	var wimp = require('gulp-wimp');
	
	gulp.task('default', function() {
	 gulp.src(['mocha-tests/new-test.js'], { read: false })
		 .pipe(mocha({
		  reporter: 'spec',
		  globals: {
			should: require('should')
		  }
		})) 
	});  

	
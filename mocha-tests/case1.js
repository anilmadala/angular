var http = require('http');

var request = require('supertest');
var app 	= require('../server');  
var assert 	= require('assert');
var chai = require('chai');
var Cookies;

global.expect = chai.expect; 


var payloadSize = 102400;

http.globalAgent.maxSockets = 100000;


try {			
			describe('Tests for patient details API', function() {   			
				//API for reports which are displayed as card view on dashboard page
				
				/*it('should fetch the report template for the given form type', function (done) {
					this.timeout(60000);
					var req = request(app).get('/api/getversions/dfr');					
					req.cookies = Cookies;
					  req
					  .set('Accept', 'application/json')					 					 
					  .send({'formid': 'dfr'})					  
					  //.expect('Content-Type', 'application/json')
					  .expect(200)
					  .end(function (err, res) {				  
							if(!err)
							{
								counter += 1;
								if ((counter/5) % chunkSize == 0 || debug) {
									//console.log(res.statusCode)
									console.log(counter, Date.now() - now);
								} else if (counter == tx) {
									//process.exit(code=0);
								}								
								//console.log(res.text);
							}
							else
							{
								console.log("Got error: " + err.message);
							}							
							done(err);
					  });
				});*/
				
				
				it('WILL RETURN PATIENT`S DETAILS ON PATIENT`S ID AND SECTION TYPE', function (done) {this.timeout(20000);var req = request(app).get('/api/patients/577f83f9c16a3c140b758d1e/basicinformation');req.cookies = Cookies;req.set('Accept','application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) { console.log(res.text); done(err);});});


					
			});
			
            } catch(e) {}
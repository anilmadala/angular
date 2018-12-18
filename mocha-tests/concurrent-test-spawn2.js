var http = require('http');

var request = require('supertest');
var app 	= require('../server');  
var assert 	= require('assert');
var chai = require('chai');
var Cookies;

const { spawn } = require('child_process');
var ls;


global.expect = chai.expect; 


var payloadSize = 102400;

http.globalAgent.maxSockets = 100000;

var data = "";
for (var i = 0; i < payloadSize; i++) 
    data += "A";

var counter = 0;
var tx = 100;//10000
var interval = 10; //ms
var chunkSize = 1;//200
var debug = false;
var now = Date.now();

	/*describe('Tests for report related APIs', function() {        
		it('It should successfully log in', function (done) {
			this.timeout(20000);//Put timeout of 2000 as this API times out for a lesser value
			request(app)
			  .post('/api/session')
			  .set('Accept','application/json')
			  .send({ 'practicename': 'ratefast', 'username': 'siteadmin', 'password': 'Admin@123' })
			  .expect('Content-Type', /json/)
			  .expect(200)
			  .end(function (err, res) {					
					 Cookies = res.headers['set-cookie']
						.map(function(r){
					  return r.replace("; path=/; httponly","") 
					}).join("; ");
					//assert(401 == res.status);
					//assert(4 == res.statusType);
					done(err);
			  });
		});				
	});*/		

for (var j = 0; j < tx / chunkSize; j++) {	    		
	setTimeout(function(){

        //for (var i = 0; i < chunkSize; i++) {
			
			ls = spawn('case1.js');
			
            
        //}
    }, j * interval);
};

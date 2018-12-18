var http = require('http');

var request = require('supertest');
var app 	= require('../server');  
var assert 	= require('assert');
var chai = require('chai');
var Cookies;

global.expect = chai.expect; 

	describe('Tests for report related APIs', function() {        
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

		//API for reports which are displayed as card view on dashboard page		
		it('It should fetch the reports for the given patient id and injury id value', function (done) {
			this.timeout(20000);
			var req = request(app).get('/api/patients/5b866463b1af7d1b6472e1a5/basicinformation');
			req.cookies = Cookies;
			  req
			  .set('Accept', 'application/json')					 
			  .send({ 'patientid': '5b866463b1af7d1b6472e1a5' })
			  //.expect('Content-Type', /json/)
			  .expect(200)
			  .end(function (err, res) {				  
					if(err)					
						console.log("Got error: " + err.message);					
					done(err);
			  });
		});		
			
	});
            

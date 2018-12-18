var http = require('http');

var request = require('supertest');
var app 	= require('../server');  
var assert 	= require('assert');
var chai = require('chai');
var Cookies;


global.expect = chai.expect; 


var payloadSize = 102400;

http.globalAgent.maxSockets = 100000;

var data = "";
for (var i = 0; i < payloadSize; i++) 
    data += "A";

var counter = 0;
var tx = 1;//10000
var interval = 1; //ms
var chunkSize = 1;//200
var debug = false;
var now = Date.now();

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
	});		

for (var j = 0; j < tx / chunkSize; j++) {	    		
	setTimeout(function(){

        for (var i = 0; i < chunkSize; i++) {
			
            try {			
			describe('Tests for patient details API', function() {   			
				//API for reports which are displayed as card view on dashboard page				
				it('changes the status of selected injury from archive to current for a given injury', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/injuries/archiveStatus');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({ injid: '58e33c43b844ae21a027f434',
				  currentId: '5b8f5f1a8db2bd13e08dbb19',
				  sectionname: 'employer',
				  injurydata:
				   { company: 'fdg',
					 natureofbusiness: '',
					 othernatureofbusiness: '',
					 emp_telephone: '9861238307',
					 emp_extension: '',
					 emp_fax: '3234254356',
					 status: 'archive',
					 updateddate: '2018-09-05T05:30:40.898Z',
					 updatedby: 'shridhar',
					 _id: '5b8f5f1a8db2bd13e08dbb19',
					 id: '5b8f5f1a8db2bd13e08dbb19' } } )
				.expect('Content-Type', 'text/html; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					done(err);
					});
				});	
				
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
		
			});
			
            } catch(e) {}
        }
    }, j * interval);
};

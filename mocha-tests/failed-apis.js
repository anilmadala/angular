var http = require('http');

var request = require('supertest');
var app 	= require('../server');  
var assert 	= require('assert');
var chai = require('chai');
var Cookies;


global.expect = chai.expect; 

http.globalAgent.maxSockets = 100000;


var counter = 0;
var tx = 1;//10000
var interval = 10; //ms
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
			describe('Tests for failed APIs', function() {   	
			
				it('It should throw error if closereportlog', function (done) {
					this.timeout(20000);
					var req = request(app).get('/api/log/submitedreportcloselog/5b978eeca130b12698759d72');
					req.cookies = Cookies;
					  req
					  .set('Accept', 'application/json')
					  .send({ 'reportid': '5b8a681893c6642e1c6e6e18' })
					  .expect('Content-Type', /json/)
					  .expect(200)
					  .end(function (err, res) {						 
							done(err);
					});
				});
		
				it('Opened report log', function (done) {
						this.timeout(20000);
						var req = request(app).get('/api/log/reportopenlog/5b978eeca130b12698759d72');
						req.cookies = Cookies;
						req
						.set('Accept','application/json; charset=utf-8')
						.expect('Content-Type', 'application/json; charset=utf-8')
						.expect(200)
						.end(function (err, res) {							
							done(err);
						});
				});	
				
				it('It sould returns error or success on patient`s injury deletion', function (done) {
					//this.timeout(40000);
					var req = request(app).post('/api/injuries/deleteInjury');
					req.cookies = Cookies;
					req
					.set('Accept','application/json; charset=utf-8')
					.send({ injid: '5b978ee1a130b12698759d61' })
					.expect('Content-Type', 'application/json; charset=utf-8')
					.expect(200)
					.end(function (err, res) {						
						done(err);
					});
				});
				
				it('change the status of injury ', function (done) {
					this.timeout(20000);
					var req = request(app).post('/api/injuries/archiveStatus');
					req.cookies = Cookies;
					req
					.set('Accept','application/json; charset=utf-8')
					.send(
							/*{ injid: '5b978ee1a130b12698759d61',
								currentId: '5b978ee1a130b12698759d61',
								sectionname: 'employer',
								injurydata:
							    { 
									 company: 'fdg',
									 natureofbusiness: '',
									 othernatureofbusiness: '',
									 emp_telephone: '9861238307',
									 emp_extension: '',
									 emp_fax: '3234254356',
									 status: 'archive',
									 updateddate: '2018-09-06T07:26:26.743Z',
									 updatedby: 'shridhar',
									 _id: '5b978ee1a130b12698759d61',
									 id: '5b978ee1a130b12698759d61' 
								} 
							}*/
							{ 	"injid":"5b8a681493c6642e1c6e6e07",
								"currentId":"5b8a681493c6642e1c6e6e0d",
								"sectionname":"employer",
								"injurydata":
									{
									"status":"current",
									"company":"",
									"updateddate":"2018-09-11T11:58:14.023Z",
									"othernatureofbusiness":"",
									"natureofbusiness":"",
									"emp_telephone":"",
									"emp_extension":"",
									"emp_fax":"",
									"updatedby":"siteadmin",
									"_id":"5b8a681493c6642e1c6e6e0d",
									"id":"5b8a681493c6642e1c6e6e0d"
									}
							}
						)
					.expect('Content-Type', 'text/plain')
					.expect(200)
					.end(function (err, res) {						
						console.log(res.text);
						done(err);
					});
				});
								
			});
			
            } catch(e) {}
        }
    }, j * interval);
};
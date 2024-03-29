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
var tx = 100;//10000
var interval = 250; //ms
var chunkSize = 20;//200
var debug = false;
var now = Date.now();

var post_options = {
      host: 'localhost',
      port: '8080',
      path: '/',
      agent: false,
      method: 'POST',
      headers: {
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(data)
      }
};

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
			
			describe('Tests for report related APIs', function() {   			
				//API for reports which are displayed as card view on dashboard page		
				it('It should fetch the reports for the given patient id and injury id value', function (done) {
					this.timeout(20000);
					var req = request(app).get('/api/getreportcardview/5b3dd6539d435316908bc28d/5b77e6368aaa952920e1d36b');
					req.cookies = Cookies;
					  req
					  .set('Accept', 'application/json')
					  .send({ 'patientid': '5b3dd6539d435316908bc28d','injuryid':'5b77e6368aaa952920e1d36b' })
					  .expect('Content-Type', /json/)
					  .expect(200)
					  .end(function (err, res) {				  
							if(!err)
							{
								counter += 1;
								if ((counter/5) % chunkSize == 0 || debug) {
									//console.log(res.statusCode)
									console.log(counter, Date.now() - now);
								} else if (counter == tx) {
									process.exit(code=0);
								}
							}
							else
							{
								console.log("Got error: " + err.message);
							}
							done(err);
					  });
				});	
			});	
			
            } catch(e) {}
        }
    }, j * interval);
};

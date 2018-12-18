var request = require('supertest'),
app	= require('../server'),
assert 	= require('assert'),
chai = require('chai');
var Cookies;

global.expect = chai.expect; 

    describe('----- anil patient  ------', function() {
		
		 it('Display login page on browser', function(done) {
				request(app)
				.get('/login')
                .expect(200)
                .end(function(err, res) {					                  
                    done(err);
                });
			});
			
			it('login', function (done) {
				this.timeout(20000);
					request(app)
					.post('/api/session')
					.set('Accept','application/json')
					.send({ 'practicename': 'ratefast', 'username': 'siteadmin', 'password': 'Admin@123' })
					.set('Cookie', ['practicename = ratefast'])
					.expect('Content-Type', /json/)
					.expect(200) .expect(function(res) {
						
					  })
					.end(function (err, res) {
						console.log('passed');
						Cookies = res.headers['set-cookie']
						.map(function(r){
					  return r.replace("; path=/; httponly","") 
					}).join("; ");
						//assert(401 == res.status);
						//assert(4 == res.statusType);
						done(err);
					})
			});									
	
		it('It should fetch the reports for the given patient id and injury id value', function (done) {
                                        this.timeout(20000);
                                        var req = request(app).get('/api/patients/5b866463b1af7d1b6472e1a5/basicinformation');
                                        req.cookies = Cookies;
                                          req
                                          .set('Accept', 'application/json; charset = utf-8;')                                         
                                          .send({ 'patientid': '5b866463b1af7d1b6472e1a5' })
                                          .expect('Content-Type', /json/)
                                          .expect(200)
                                          .end(function (err, res) {                                  
                                                        if(!err)
                                                        {
                                                                //console.log(res.text);
                                                        }
                                                        else
                                                        {
                                                                console.log("Got error: " + err.message);
                                                        }
                                                        done(err);
                                          });
                                });        
			
		
			
	});
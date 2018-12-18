var request = require('supertest'),
  app 		= require('../server');
var assert 	= require('assert');
var Cookies;
/**#############################Login session  and session management #################################### **/

/**
 * Test no 1: Testing login session API
 */
describe('Functional Test <Sessions>:', function () {
	/**
    * Case 1 : practice name is incorrect
    */
  it('should throw 401 as practice name is incorrect', function (done) {
    request(app)
      .post('/api/session')
      .set('Accept','application/json')
      .send({ 'practicename': 'ratefasts', 'username': 'siteadmin', 'password': 'siteadmin' })
      .expect('Content-Type', /json/)
      .end(function (err, res) {
			assert(401 == res.status);
			assert(4 == res.statusType);
			done();
      });
  });
  

 /**
  * Case 2 : username is incorrect
  */
  it('should throw 401 as username is incorrect', function (done) {
    request(app)
      .post('/api/session')
      .set('Accept','application/json')
      .send({ 'practicename': 'ratefast', 'username': 'siteadmins', 'password': 'siteadmin' })
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
    	  	assert(401 == res.status);
			assert(4 == res.statusType);
			done();
      });
  });

  /**
   * Case 3 : password  is incorrect
   */
  it('should throw 401 as password is incorrect', function (done) {
    request(app)
      .post('/api/session')
      .set('Accept','application/json')
      .send({ 'practicename': 'ratefast', 'username': 'siteadmin', 'password': 'siteadmink' })
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
    	  	assert(401 == res.status);
			assert(4 == res.statusType);
			done();
      });
  });
  
  
  /**
   * Case 4 : practice name is incorrect
   */
 it('should throw 401 as practicename parameter name  is misspelled', function (done) {
   request(app)
     .post('/api/session')
     .set('Accept','application/json')
     .send({ 'practicenames': 'ratefasts', 'username': 'siteadmin', 'password': 'siteadmin' })
     .expect('Content-Type', /json/)
     .end(function (err, res) {
			assert(401 == res.status);
			assert(4 == res.statusType);
			done();
     });
 });
 /**
  * Case 5 : practice name is incorrect
  */
it('should throw 401 as username parameter name  is misspelled', function (done) {
  request(app)
    .post('/api/session')
    .set('Accept','application/json')
    .send({ 'practicenames': 'ratefasts', 'usernamed': 'siteadmin', 'password': 'siteadmin' })
    .expect('Content-Type', /json/)
    .end(function (err, res) {
			assert(401 == res.status);
			assert(4 == res.statusType);
			done();
    });
});
/**
 * Case 6 : practice name is incorrect
 */
it('should throw 401 as password parameter name is misspelled', function (done) {
 request(app)
   .post('/api/session')
   .set('Accept','application/json')
   .send({ 'practicename': 'ratefasts', 'username': 'siteadmin', 'passwordss': 'siteadmin' })
   .expect('Content-Type', /json/)
   .end(function (err, res) {
			assert(401 == res.status);
			assert(4 == res.statusType);
			done();
   });
});

  /**
   * Case 7 : All details are correct
   */
   it('should create user session for valid user', function (done) {
    request(app)
      .post('/api/session')
      .set('Accept','application/json')
      .send({ 'practicename': 'ratefast', 'username': 'siteadmin', 'password': 'siteadmin' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
    	  	
			assert(200 == res.status);
			assert(2 == res.statusType);
			// Save the cookie to use it later to retrieve the session
	        Cookies = res.headers['set-cookie']
	            .map(function(r){
              return r.replace("; path=/; httponly","") 
            }).join("; ");
	        done();
      });
  });
   /**
    *  Case 8 :API to test if login was sucessfull or not
    */
  it('should fetch patient list', function (done) {  
	var req = request(app).post('/api/getpr4ClosedReports');
    req.cookies = Cookies;
    req.set('Accept','application/json')
      .expect('Content-Type', /json/)
	  .send({"pageController":"page","pagenum":1,"state":"CA","stateController":"state","statusController":"status"})
      .expect(200)
      .end(function (err, res) {
		done();
      }); 
  });
});
/**#############################Test case 2 #################################### **/

/**
 * Test no 2: Password reset, forgot password
 */
describe('Functional Test <Password reset>:', function () {
  /**
   * Case 1 : Get userquestion by email email address doesnt exits
   */
   it('should should return user secret question', function (done) {
    request(app)
      .post('/api/session/checkcredentails')
      .set('Accept','application/json')
      .send({ 'practicename': 'ratefast', 'email': 'siteadmin@test.com',  'username': 'siteadmin' ,'password': 'siteadmin','securityquestion':'rugby','answer':'rugby'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
			
    	  assert(200 == res.status);
			assert(2 == res.statusType);
	        done();
      });
  });   
   /**
    * Case 1 : Get userquestion by email email address doesnt exits
    */
    it('should should return user secret question', function (done) {
     request(app)
       .post('/api/session/checkcredentails')
       .set('Accept','application/json')
       .send({ 'practicename': 'ratefast', 'email': 'siteadmin@gmail.com',  'username': 'siteadmin' ,'password': 'siteadmin','securityquestion':'rugby','answer':'rugby'})
       .expect('Content-Type', /json/)
       .expect(200)
       .end(function (err, res) { 			
     	  assert(200 == res.status);
 			assert(2 == res.statusType);
 	        done();
       });
   });  
    /**
     * Case 1 : Get userquestion by email email address doesnt exits
     */
     it('should should return user secret question', function (done) {
      request(app)
        .post('/api/session/checkcredentails')
        .set('Accept','application/json')
        .send({ 'practicename': 'ratefast', 'email': 'siteadmin@test.com',  'username': 'siteadmins' ,'password': 'siteadmin','securityquestion':'rugby','answer':'rugby'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
  			
      	  assert(200 == res.status);
  			assert(2 == res.statusType);
  	        done();
        });
    });  
     /**
      * Case 1 : Get userquestion by email email address doesnt exits
      */
      it('should should return user secret question', function (done) {
       request(app)
         .post('/api/session/checkcredentails')
         .set('Accept','application/json')
         .send({ 'practicename': 'ratefast', 'email': 'siteadmin@test.com',  'username': 'siteadmin' ,'password': 'siteadmins','securityquestion':'rugby','answer':'rugby'})
         .expect('Content-Type', /json/)
         .expect(200)
         .end(function (err, res) {
   			 
       	  assert(200 == res.status);
   			assert(2 == res.statusType);
   	        done();
         });
     }); 
      /**
       * Case 1 : Get userquestion by email email address doesnt exits
       */
       it('should should return user secret question', function (done) {
        request(app)
          .post('/api/session/checkcredentails')
          .set('Accept','application/json')
          .send({ 'practicename': 'ratefast', 'email': 'siteadmin@test.com',  'username': 'siteadmin' ,'password': 'siteadmin','securityquestion':'rugbys','answer':'rugby'})
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
    			 
        	  assert(200 == res.status);
    			assert(2 == res.statusType);
    	        done();
          });
      }); 
       /**
        * Case 1 : Get userquestion by email email address doesnt exits
        */
        it('should should return user secret question', function (done) {
         request(app)
           .post('/api/session/checkcredentails')
           .set('Accept','application/json')
           .send({ 'practicename': 'ratefast', 'email': 'siteadmin@test.com',  'username': 'siteadmin' ,'password': 'siteadmin','securityquestion':'rugby','answer':'rugbys'})
           .expect('Content-Type', /json/)
           .expect(200)
           .end(function (err, res) {
     			 
         	  assert(200 == res.status);
     			assert(2 == res.statusType);
     	        done();
           });
       });
        
       //forgot password functionality
        /**
         * Case 1 : Get userquestion by email email address doesnt exits
         */
         it('should send email to forgot password', function (done) {
          request(app)
            .post('/api/session/forgotpassword')
            .set('Accept','application/json')
            .send({ 'practicename': 'ratefast', 'email': 'siteadmin@test.com',  'password': 'siteadmin'})
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
      			 
      			assert(200 == res.status);
      			assert(2 == res.statusType);
      	        done();
            });
        }); 
         /**
          * Case 1 : Get userquestion by email email address doesnt exits
          */
          it('should send email to forgot password', function (done) {
           request(app)
             .post('/api/session/forgotpassword')
             .set('Accept','application/json')
             .send({ 'practicename': 'ratefasts', 'email': 'siteadmin@test.com',  'password': 'siteadmin'})
             .expect('Content-Type', /json/)
             .expect(200)
             .end(function (err, res) {
       			 
           	  assert(200 == res.status);
       			assert(2 == res.statusType);
       	        done();
             });
         }); 
          /**
           * Case 1 : Get userquestion by email email address doesnt exits
           */
           it('should send email to forgot password', function (done) {
            request(app)
              .post('/api/session/forgotpassword')
              .set('Accept','application/json')
              .send({ 'practicename': 'ratefast', 'email': 'siteadmisn@test.com',  'password': 'siteadmin'})
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function (err, res) {
        			 
            	  assert(200 == res.status);
        			assert(2 == res.statusType);
        	        done();
              });
          }); 
           /**
            * Case 1 : Get userquestion by email email address doesnt exits
            */
            it('should send email to forgot password', function (done) {
             request(app)
               .post('/api/session/forgotpassword')
               .set('Accept','application/json')
               .send({ 'practicename': 'ratefast', 'email': 'siteadmin@test.com',  'password': 'siteadmins'})
               .expect('Content-Type', /json/)
               .expect(200)
               .end(function (err, res) {
         			 
             	  assert(200 == res.status);
         			assert(2 == res.statusType);
         	        done();
               });
           }); 
            /**
             * Case 1 : Get userquestion by email email address doesnt exits
             */
             it('should send email to forgot password', function (done) {
              request(app)
                .post('/api/session/forgotpassword')
                .set('Accept','application/json')
                .send({ 'practicenamse': 'ratefast', 'email': 'siteadmin@test.com',  'password': 'siteadmin'})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
          			 
              	  assert(200 == res.status);
          			assert(2 == res.statusType);
          	        done();
                });
            }); 
             /**
              * Case 1 : Get userquestion by email email address doesnt exits
              */
              it('should send email to forgot password', function (done) {
               request(app)
                 .post('/api/session/forgotpassword')
                 .set('Accept','application/json')
                 .send({ 'practicename': 'ratefast', 'emails': 'siteadmin@test.com',  'password': 'siteadmin'})
                 .expect('Content-Type', /json/)
                 .expect(200)
                 .end(function (err, res) {
           			 
               	  assert(200 == res.status);
           			assert(2 == res.statusType);
           	        done();
                 });
             }); 
              /**
               * Case 1 : Get userquestion by email email address doesnt exits
               */
               it('should send email to forgot password', function (done) {
                request(app)
                  .post('/api/session/forgotpassword')
                  .set('Accept','application/json')
                  .send({ 'practicename': 'ratefast', 'email': 'siteadmin@test.com',  'passwords': 'siteadmin'})
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function (err, res) {
            			 
                	  assert(200 == res.status);
            			assert(2 == res.statusType);
            	        done();
                  });
              }); 
});


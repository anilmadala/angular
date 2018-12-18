var request = require('supertest')
    , app = require('../server')
    , assert = require('assert')
    , chai = require('chai');
var http = require('http');
var async = require('async');
var Cookies;

var i = 0;
global.expect = chai.expect;

		
			function OuterFunction(list) {
				var start = new Date().getTime();
				async.map(list, function (product, done) {
	 
            try {
                describe('ALL TEST CASES WILL RUN HERE CONCURENTLY \n\n', function () {
                    it('It should throw 401 as practice name is incorrect else throw 200 \n', function (done) {
                        this.timeout(20000);
                        request(app).post('/api/session').set('Accept', 'application/json').send({
                            'practicename': 'lmwconsulting'
                            , 'username': 'lmwsuperadm'
                            , 'password': 'Admin@1234'
                        }).set('Cookie', ['practicename = lmwconsulting']).expect('Content-Type', /json/).expect(200).expect(function (res) {}).end(function (err, res) {
                            Cookies = res.headers['set-cookie'].map(function (r) {
                                return r.replace("; path=/; httponly", "")
                            }).join("; ");
                            done(err);
                        })
                    });
					
                    it('RETURN RECNTLY USED 5 PATIENTS \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/patients/recent/page/1/CA');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
					
                    it('RETURN LIST OF USERS \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/users/search');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            pagenum: 1
                            , pageController: 'page'
                        }).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('UPDATE USERS DETAILS ON USER ID \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).put('/api/users/update/5ba6d4a1e3c8251da83453e9');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            id: '5ba6d4a1e3c8251da83453e9'
                            , data: {
                                _id: '5ba6d4a1e3c8251da83453e9'
                                , firstname: 'unesh'
                                , lastname: 'kamble'
                                , email: 'man.oj@gmail.com'
                                , username: 'unu'
                                , userextension: '4343434'
                                , userphonenumber: '1111111111'
                                , usernpinumber: '222220000'
                                , practice: [{
                                    name: 'shridharprac'
                                    , role: 'admin level4'
                                    , rolename: 'admin'
                                    , level: 'level4'
                                    , status: 'active'
                                    , _id: '5ba6d4a1e3c8251da83453e9'
                                    , stampapproval: 'off'
                                    , athena_username: ''
                                    , athena_practicename: ''
                                    , athena_practiceid: 0
                                    , createddate: '2016-10-12T09:47:22.043Z'
                                }]
                                , speciality: []
                                , profession: ['md', 'pharm']
                                , licensenumber: 's222222222'
                                , Otherprofessiontext: ''
                            }
                        }).expect('Content-Type', 'text/plain').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
					/*
                    it('UPDATE / RESET USER`S PASSWROD \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/users/resetpassword');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            id: '55b1d779a4c0a0100900001f'
                            , data: {
                                _id: '55b1d779a4c0a0100900001f'
                                , firstname: 'shridhar'
                                , lastname: 'gadhave'
                                , email: 'anilmadalabca@gmail.com'
                                , username: 'shridhar'
                                , userextension: '4455566'
                                , userphonenumber: '9988776655'
                                , usernpinumber: '1230000000'
                                , practice: [{
                                    name: 'shridharprac'
                                    , role: 'superadmin'
                                    , rolename: 'superadmin'
                                    , level: 'level4'
                                    , status: 'active'
                                    , _id: '55b1d779a4c0a01009000021'
                                    , stampapproval: 'off'
                                    , athena_username: ''
                                    , athena_practicename: ''
                                    , athena_practiceid: 0
                                    , createddate: '2016-10-12T09:47:22.043Z'
                                }]
                                , speciality: [
												{
							"name" : "", 
							"boardcertified" : false, 
							"_id" : '55b1d779a4c0a01009000020'
							}]
                                , profession: ['dc']
                                , licensenumber: 'MD234234'
                                , Otherprofessiontext: ''
                            }
                        }).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                           
						   done(err);
                        });
                    });
					*/
                    /* it('SEND INVITATION FOR USER \n', function (done) {
						
						var emailid = 'abcdef119879'+i+'@gmail.com';
                        this.timeout(20000);
                        var req = request(app).post('/api/users/inviteusers');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
								'name': 'mangesh p'
                            , 'emailId': emailid
                            , 'role': 'admin'
                            , 'level': '4'
                            , 'id': 0
                            , 'isVerifyemail': true
                            , 'firstname': 'xxxxx'
                            , 'lastname': 'xxxxxx'
                            , 'verifyemailId': emailid
                        }).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        })
						i += 1;
                    }); */
                    it('UPDATES THE PRACTICE DETAILS \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).put('/api/practicesUpdate/534bb9597200d50200000004');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            _id: '534bb9597200d50200000004'
                            , __v: 0
                            , billingcalculatoromfs: 'on'
                            , cimprofileid: '36347617'
                            , dfrcharge: ''
                            , dfrfreereport: ''
                            , editionama: 'AMA Guides 5th Edition'
                            , merchantid: '1437718393412'
                            , paymentprofileid: '32876398'
                            , pid: '42'
                            , pr2charge: ''
                            , pr2freereport: ''
                            , pr4charge: ''
                            , pr4freereport: ''
                            , practicename: 'shridharprac'
                            , pricingtype: 'defaultpricing'
                            , salesperson: '52f35b9c226f1c093cacbda3'
                            , irsnumber: null
                            , isAthena: false
                            , athena_practicename: ''
                            , athena_practiceid: 0
                            , report_autosave: true
                            , kickstart_page: {
                                email_recipient: ''
                                , email_content: {
                                    email_body: "<p>Hi,</p><p>Your information has successfully been submitted. You will be contacted within three business days. If you have a question, please call 707.483.4346 or email jamd@rate-fast.com</p><p>The RateFast Team</p>"
                                    , email_subject: 'Your work injury information has been received!'
                                }
                                , successpage: {
                                    message: ''
                                    , title: ''
                                }
                                , footer: ''
                                , sub_title: ''
                                , title: ''
                            }
                            , logout_warning_seconds: 10
                            , session_timeout: {
                                enable: true
                                , rater2: 900
                                , rater1: 900
                                , siteadmin: 900
                                , superadmin: 900
                                , admin_level4: 1200
                                , admin_level3: 1200
                                , admin_level2: 1200
                                , admin_level1: 1200
                                , nonadmin_level4: 1800
                                , nonadmin_level3: 1800
                                , nonadmin_level2: 1800
                                , nonadmin_level1: 1800
                            }
                            , enable_ws_docx_footer_pr4: true
                            , enable_ws_docx_footer_pr2: true
                            , enable_ws_docx_footer_dfr: true
                            , enable_ws_docx_header_pr4: true
                            , enable_ws_docx_header_pr2: true
                            , enable_ws_docx_header_dfr: true
                            , enable_report_docx_footer_pr4: true
                            , enable_report_docx_footer_pr2: true
                            , enable_report_docx_footer_dfr: true
                            , enable_report_docx_header_pr4: true
                            , enable_report_docx_header_pr2: true
                            , enable_report_docx_header_dfr: true
                            , enable_docx_footer: true
                            , enable_docx_header: true
                            , kickstart_url: ''
                            , enable_kickstart: true
                            , practicename2: 'shree441'
                            , faxnumber: '0000003333'
                            , userextension: ''
                            , userphonenumber: ''
                            , stampapproval: 'never'
                            , usercount: 1
                            , createdon: '2015-07-24T06:13:13.258Z'
                            , status: 'active'
                            , practiceaddress: [{
                                    street: 'loc1street'
                                    , country: 'US'
                                    , city: 'loc1city'
                                    , state: 'ID'
                                    , zipcode: '5555555555'
                                    , location: 'loc1'
                                    , phonenumber: '1222222222'
                                    , extension: '2333333'
                                    , faxnumber: '3444444444'
                                    , county: 'loc1country'
                                    , _id: '58e3720bb844ae21a027f464'
                                }
                                , {
                                    street: 'loc2street02'
                                    , country: 'US'
                                    , city: 'loc2city02'
                                    , state: 'KS'
                                    , zipcode: '4333333000'
                                    , location: 'loc2'
                                    , phonenumber: '0000001110'
                                    , extension: '0000220'
                                    , faxnumber: '0000003330'
                                    , county: 'loc2country02'
                                    , _id: '58e374cbb844ae21a027f46b'
                                }
                                , {
                                    street: 'loc3street0'
                                    , country: 'US'
                                    , city: 'loc3city0'
                                    , state: 'ID'
                                    , zipcode: '2222221111'
                                    , location: 'loc3'
                                    , phonenumber: '0000001110'
                                    , extension: '0000220'
                                    , faxnumber: '0000003330'
                                    , county: 'loc3county0'
                                    , _id: '58e4890576372530d0c1f7fd'
                                }]
                            , rfadetails: {
                                firstname: 'rfafirstnewsd'
                                , lastname: 'rfalastsd'
                                , email: 'sorry015@gmail.com'
                            }
                            , billingaddress: {
                                billingaddres: 'Enim suscipit molestiae quas velit dolore volupta'
                                , county: 'Voluptatum voluptatibus reiciendis'
                                , city: 'Quaerat consequatur aut laborum O'
                                , zipcode: '23423-4234'
                                , billingemail: 'hitehada@hotmail.com'
                                , phonenumber: '0000001111'
                                , state: 'AZ'
                                , Billingextension: '0000222'
                            }
                        }).expect('Content-Type', 'text/plain').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('RETURN RECORD OF CC CHARGE REPORT ON FILTER OF STARTING DATE AND EDN DATE \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/ccchargereport/getdetails');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            startdate: '2018-02-28T18:30:00.000Z'
                            , enddate: '2018-08-30T18:30:00.000Z'
                            , practicename: 'shridharprac'
                        }).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('CREATE / ADD NEW PATIENT`S RECORD \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/patients/create');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            "address": [
                                {
                                    "addressline1": 'address line 1 sample data for testing'
                                    , "addressline2": 'address line 2 sample data for testing'
                                    , "city": "HTH"
                                    , "state": "403532d2bb4d2c943455fefc00aaa494"
                                    , "zipcode": "hv373737"
                                    , "status": "current"
                                    , "updateddate": "2015-03-16"
                                    , "updatedby": "praveen"
									, }
								]
                            , "basicinformation": [
                                {
                                    "firstname": "13bd45d6cb82a6cbb777745e48b68640"
                                    , "middlename": "b32e30233e4b93c5fa8c0228a589aae6"
                                    , "lastname": "973cbc9ce60f0f472f227807cda9e0d3"
                                    , "gender": 'Male'
                                    , "dateofbirth": "0e134b6e9cc98276a9719289d1e60d5df6e4744d46f7b6bd13fed3760fba6c32"
                                    , "dateofdeath": "2579bfd53a11fd20a5388ba7e99e2a9e8b609b1662d08c63712342318358d64c"
                                    , "socialsecurityno": "a95edb4d7b56279bbb77706825ba554b"
                                    , "employeehandedness": "e0b3d556c6e88ca3247dba7c12ce05fd"
                                    , "status": "current"
                                    , "updateddate": "2015-03-16"
                                    , "updatedby": "praveen"
									, }
								]
                            , "contactinformation": [
                                {
                                    "email": null
                                    , "homephone": null
                                    , "cellphone": null
                                    , "workphone": null
                                    , "phonenumberselect": "8264247e5a3640d8a5f7f4ca309982d1"
                                    , "phonenumberselectsecond": "8264247e5a3640d8a5f7f4ca309982d1"
                                    , "phonenumberselectthird": "8264247e5a3640d8a5f7f4ca309982d1"
                                    , "voicemailthirdradio": "ed2c0979e8653fc2fefb0a2521bb683d"
                                    , "voicemailsecondradio": "ed2c0979e8653fc2fefb0a2521bb683d"
                                    , "voicemailradio": "ed2c0979e8653fc2fefb0a2521bb683d"
                                    , "extension": null
                                    , "preferredcommunication": "8264247e5a3640d8a5f7f4ca309982d1"
                                    , "preferredcommunicationother": null
                                    , "status": "current"
                                    , "updateddate": "2015-03-16"
                                    , "updatedby": "praveen"
									, }
								]
                            , "createdby": "praveen"
                            , "createddate": "2015-03-16"
                            , "demographics": [
                                {
                                    "preferredlanguage": "8264247e5a3640d8a5f7f4ca309982d1"
                                    , "preferredlanguageother": null
                                    , "ethnicity": "8264247e5a3640d8a5f7f4ca309982d1"
                                    , "ethnicityother": null
                                    , "race": "8264247e5a3640d8a5f7f4ca309982d1"
                                    , "raceother": null
                                    , "status": "current"
                                    , "updateddate": "2015-03-16"
                                    , "updatedby": "praveen"
									}
								]
                            , "emergencycontactinfo": [
                                {
                                    "relationship": "8264247e5a3640d8a5f7f4ca309982d1"
                                    , "firstname": null
                                    , "lastname": null
                                    , "email": null
                                    , "homephone": null
                                    , "cellphone": null
                                    , "workphone": null
                                    , "extension": null
                                    , "status": "current"
                                    , "updateddate": "2015-03-16"
                                    , "updatedby": "praveen"
                                    , "address": [
                                        {
                                            "addressline1": null
                                            , "addressline2": null
                                            , "city": null
                                            , "state": "403532d2bb4d2c943455fefc00aaa494"
                                            , "zipcode": null
											, }
										]
									}
								]
                            , "injury": [

								]
                            , "occupation": [
                                {
                                    "currentoccupation": "8264247e5a3640d8a5f7f4ca309982d1"
                                    , "currentoccupationother": null
                                    , "status": "current"
                                    , "updateddate": "2015-03-16"
                                    , "updatedby": "praveen"
									, }
								]
                            , "patientrecordno": "RF-0210176"
                            , "practicename": "rishabhpractice"
                            , "state": "CA"
                        }).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('UPDATE PATIENT`S DETAILS \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/patients/update');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            patientid: '5a1834e6135ae23a880bc0e1'
                            , category: 'basicinformation'
                            , categorynewdata: {
                                firstname: 'Rajan'
                                , middlename: 'N'
                                , lastname: 'Pathak'
                                , gender: 'Male'
                                , dateofbirth: '1982-02-09T18:30:00.000Z'
                                , dateofdeath: null
                                , socialsecurityno: '120978452'
                                , employeehandedness: 'Right'
                                , status: 'current'
                                , updateddate: '2018-08-21T05:03:36.479Z'
                                , updatedby: 'shridhar'
                                , _id: '5b7b9d97371aae0d181f71c5'
                                , id: '5b7b9d97371aae0d181f71c5'
                            }
                        }).expect('Content-Type', 'text/html; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
					

					
                    it('GET LIST OF UNSIGNED REPORTS \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/unsignedReports/lmwconsulting/CA');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            'practicename': 'lmwconsulting'
                            , 'selectedstatecode': 'CA'
                        }).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL CHECK WHETHER USERNAME IS UNIQUE OR NOT \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/users/uniquename/shridhar');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL RETURN USER`S DETAILS ON USERNAME AND USERLEVEL \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/getdataapi/lmwsuperadm/Superadmin');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL RETURN CURRENT USER`S DETAILS ON USERID \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/currentuserdata/5ba6d4a1e3c8251da83453e9');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    /* it('WILL RETURN INVITED USER DETAILS \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/getinviteuserinfo/55b1d779a4c0a0100900001f/shridharprac');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'text/html; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    }); */
                    it('WILL RETURN CLINIC DETAILS ON PRACTICE NAME \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/getdataclinic/lmwconsulting');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL RETURN `stampapproval` FIELD FROM COLLECTION ON PRACTICE NAME \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/getstampofapproval/lmwconsulting');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL CHECK WHETHER PRACTICE NAME IS UNIQUE OR NOT \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/practice/uniquepractice/lmwconsulting');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL RETURN PRACTICE DETAILS ON PRACTICE NAME \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/practicesByName/lmwconsulting');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    /* it('WILL ACTIVATE PRACTICE ACCOUNT \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/practices/activation/535f9816ef9cdf982600005a');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    }); */
                    it('WILL RETURN PATIENT`S DETAILS ON PATIENT`S ID \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/patientdata/5506cde15489e8ac100000d2');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL UPDATE REPORT STAUS `Open` \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/updatereportstatus/5baf5f1080bc242fe8f1c97a');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'text/html; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL RETURN PATIENTS REPORTS DETAILS ON PRACTICE NAME ON STATECODE \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/getdfrdiscovery/lmwconsulting/CA');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL RETURN PATIENT`S REPORT DETAILS ON PRACTICE NAME AND FORMTYPE \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/submittedReportcount/lmwconsulting/dfr');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL UPDATE REPORT STATUS AS `delete` ON CONDITION REPORT STATUS IS `open` , PRACTICENAME AND _ID \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/deletereport/5baf5f1080bc242fe8f1c97a');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL RETURN PATIENT`S DETAILS ON PATIENT`S ID AND SECTION TYPE \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/patients/5a1834e6135ae23a880bc0e1/basicinformation');   // 5b7b9d96371aae0d181f71bc this id has large amount of archive data
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL RETURN INJURY DETAILS ON INJURI ID \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/selectinjuriespatientdata/5a183500135ae23a880bc0ec');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
					
					it('WILL RETURN OPENED REPORTS LOG \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/log/reportopenlog/5baf5f1080bc242fe8f1c97a');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {

                            done(err);
                        });
                    });
					
					it('WILL RETURN SUBMITED CLOSED REPORTS LOG \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).get('/api/log/submitedreportcloselog/5baf5f1080bc242fe8f1c97a');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL RETURN REPORT`S DETAILS ON REPORT`S STATUS AND REPORT`S TYPE \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/getReportlistpost');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            pagenum: 1
                            , pageController: 'page'
                            , formType: 'dfr'
                            , statusId: 'archive'
                        }).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
					
					it('WILL DELETE INJURY ON INJURI ID \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/injuries/deleteInjury');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({injid:'54e7111fd05a897027000029'}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
					
					
					
					
                    it('WILL RETURN USERNAME ON PRACTIECENAME AND EMAIL \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/session/forgotusername');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            practicename: 'lmwconsulting'
                            , email: 'manojgrey11223@gmail.com'
                            , password: 'Adm!n@1234'
                        }).expect('Content-Type', 'text/plain').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
					
					it('WILL RETURN List of practices \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/practices/search');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({pagenum: 1}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    it('WILL RETURN USER DETAILS ON PASSED USER DETAILS \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/session/checkcredentails');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            practicename: 'lmwconsulting'
                            , email: 'manojgrey11223@gmail.com'
                            , password: 'Adm!n@1234'
                            , username: 'siteadmin'
                            , securityquestion: '53143dfa226f1c0e1cd9a8e5'
                            , answer: 'Rugby'
                        }).expect('Content-Type', 'text/plain').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
					
                    it('FOR FORGOT PASSWORD   ///   only for superadmin role \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/session/forgotpassword');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            practicename: 'lmwconsulting'
                            , email: 'manojgrey11223@gmail.com'
                            , password: 'Admin@1234'
                        }).expect('Content-Type', 'text/plain').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
                    /* it('VERIIYING SECURITY QUESTION`S ANSWER \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/session/verifyanswer');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            practicename: 'shridharprac'
                            , email: 'mhatremayur2520@gmail.com'
                            , password: 'Admin@321'
                            , username: 'shridhar'
                            , question: '53143e1a226f1c0e1cd9a8e6'
                            , answer: 'b'
                        }).expect('Content-Type', 'text/plain').expect(200).end(function (err, res) {
                            done(err);
                        });
                    }); */
                    /* it('RESEND INVITATION \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).post('/api/users/resendinviteusers');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            firstname: 'xxxxx xxx xxxxx'
                            , resendPracticename: 'shridharprac'
                        }).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end(function (err, res) {
                            done(err);
                        });
                    }); */
                    it('UPDATE PRACTICE STAMPAPPROVAL \n', function (done) {
                        this.timeout(20000);
                        var req = request(app).put('/api/practicesStampUpdate/55b1d779a4c0a0100900001d');
                        req.cookies = Cookies;
                        req.set('Accept', 'application/json; charset=utf-8').send({
                            stampapproval: 'publish'
                            , _id: '55b1d779a4c0a0100900001d'
                        }).expect('Content-Type', 'text/plain').expect(200).end(function (err, res) {
                            done(err);
                        });
                    });
					
					
					/* ANIL TEST CASES */
				
		it(' it is used for  patients injury creation \n', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/patients/createinjuries');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({
							"injurydata":{
							"insurance":[
							{
							"status":"current",
							"insurance_claimsadministrator":"",
							"insurance_claimsnumber":"",
							"insuranceaddressline1":"",
							"insuranceaddressline2":"",
							"insurancecity":"",
							"insurancestate":"",
							"insurancezipcode":"",
							"updateddate":1535522395867,
							"updatedby":"shridhar"
							}
							],
							"claimsadjuster":[
							{
							"status":"current",
							"updateddate":1535522395867,
							"updatedby":"shridhar",
							"claimsadjuster_firstname":"",
							"claimsadjuster_lastname":"",
							"claimsadjuster_email":"",
							"claimsadjuster_telephoneno":"",
							"claimsadjuster_extension":"",
							"claimsadjuster_fax":"",
							"claimsadjuster_address":"",
							"claimsadjuster_city":"",
							"claimsadjuster_state":"",
							"claimsadjuster_zipcode":"",
							"claimsadjuster_company":""
							}
							],
							"billreview":[
							{
							"status":"current",
							"updateddate":1535522395867,
							"updatedby":"shridhar",
							"billreview_firstname":"",
							"billreview_lastname":"",
							"billreview_email":"",
							"billreview_telephoneno":"",
							"billreview_extension":"",
							"billreview_fax":"",
							"billreview_address":"",
							"billreview_city":"",
							"billreview_state":"",
							"billreview_zipcode":"",
							"billreview_company":""
							}
							],
							"utilizationreview":[
							{
							"status":"current",
							"updateddate":1535522395867,
							"updatedby":"shridhar",
							"utilizationreview_firstname":"",
							"utilizationreview_lastname":"",
							"utilizationreview_email":"",
							"utilizationreview_telephoneno":"",
							"utilizationreview_extension":"",
							"utilizationreview_fax":"",
							"utilizationreview_address":"",
							"utilizationreview_city":"",
							"utilizationreview_state":"",
							"utilizationreview_zipcode":"",
							"utilizationreview_company":""
							}
							],
							"applicantattorney":[
							{
							"status":"current",
							"updateddate":1535522395867,
							"updatedby":"shridhar",
							"applicantattorney_firstname":"",
							"applicantattorney_lastname":"",
							"applicantattorney_email":"",
							"applicantattorney_telephoneno":"",
							" applicantattorney_extension":"",
							"applicantattorney_fax":"",
							"applicantattorney_address":"",
							"applicantattorney_city":"",
							"applicantattorney_state":"",
							"applicantattorney_zipcode":"",
							"applicantattorney_company":""
							}
							],
							"defenseattorney":[
							{
							"status":"current",
							"updateddate":1535522395867,
							"updatedby":"shridhar",
							"defenseattorney_fi rstname":"",
							"defenseattorney_lastname":"",
							"defenseattorney_email":"",
							"defenseattorney_telephoneno":"",
							"defenseattorney_extension":"",
							"defenseattorney_fax":"",
							"defenseattorney_address":"",
							"defenseattorney_city":"",
							"defenseattorney_state":"",
							"defenseattorney_zipcode":"",
							"defenseattorney_company":""
							}
							],
							"rncasemanager":[
							{
							"status":"current",
							"updateddate":1535522395867,
							"updatedby":"shridhar",
							"rncasemanag er_firstname":"",
							"rncasemanager_lastname":"",
							"rncasemanager_email":"",
							"rncasemanager_telephoneno":"",
							"rncasemanager_extension":"",
							"rncasemanager_fax":"",
							"rncasemanager_address":"",
							"rncasemanager_city":"",
							"rncasemanager_state":"",
							"rncasemanager_zipcode":"",
							"rncasemanager_company":""
							}
							],
							"locationaddressinjury":[
							{
							"status":"current",
							"updateddate":1535522395867,
							"updatedby":"shridhar",
							"location_address1":"",
							"location_address2":"",
							"location_zipcode":"",
							"location_city":"",
							"location_state":""
							}
							],
							"acceptedbodyparts":[
							{
							"injuredbodypart":[
							],
							"status":"current",
							"updated date":1535522395867,
							"updatedby":"shridhar"
							}
							],
							"employer":[
							{
							"status":"current",
							"company":"",
							"updateddate":1535522395867,
							"othernatureofbusiness":"",
							"natureofbusine ss":"",
							"emp_telephone":"",
							"emp_extension":"",
							"emp_fax":"",
							"updatedby":"shridhar"
							}
							],
							"employment":[
							{
							"status":"current",
							"updateddate":1535522395867,
							"durationofempl oyement":"",
							"durationtype":"",
							"jobtitle":"",
							"updatedby":"shridhar"
							}
							],
							"employeraddress":[
							{
							"emp_address1":"",
							"emp_address2":"",
							"emp_city":"",
							"emp_state":"",
							"emp_zipcode":"",
							"status":"current",
							"updateddate":1535522395867,
							"updatedby":"shridhar"
							}
							],
							"employercontact":[
							{
							"employercontact_firstname":"",
							"employercontact_lastname":"",
							"employercontact_email":"",
							"employercontact_telephoneno":"",
							"employercontact _extension":"",
							"employercontact_fax":"",
							"employercontact_address":"",
							"employercontact_city":"",
							"employercontact_state":"",
							"employercontact_zipcode":"",
							"status":"current",
							"updateddate":1535522395867,
							"updatedby":"shridhar"
							}
							],
							"injuryinformation":[
							{
							"status":"current",
							"updateddate":1535522395867,
							"updatedby":"shridhar",
							"additionaldetail":"",
							"dateofinjury":"2018-08-28T18:30:00.000Z",
							"timeofinjury":"2018- 08-29T05:59:55.866Z"
							}
							],
							"viewinformation":[
							{
							"viewdate":1535522395867,
							"viewby":"shridhar"
							}
							],
							"createddate":"2018-08-29T05:59:55.868Z"
							},
							"ptid":"5b3c4af7c1e4840130812e43"
							})
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
			});	
		

		it('it is used for  patient`s injury save \n', function (done) {
							this.timeout(20000);
							var req = request(app).post('/api/patients/addsubinjuries');
							req.cookies = Cookies;
							req
							.set('Accept','text/plain')
							.send({ injid: '5a183500135ae23a880bc0ec',
							  injurydata:
							   { status: 'current',
								 updateddate: '2018-08-29T05:59:55.867Z',
								 othernatureofbusiness: ' ',
								 emp_telephone: '2343546576',
								 emp_extension: '',
								 emp_fax: '',
								 updatedby: 'shridhar',
								 id: '5b8641458c4d851384691830',
								 company: 'sage',
								 natureofbusiness: 'Computer/Tech' },
							  text: 'injury.$.injurydata.employer' })
							.expect('Content-Type', 'text/plain')
							.expect(200)
							.end(function (err, res) {
								done(err);
							});
		});			
		
		it('It is  used for patient`s injury deletion \n', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/injuries/deleteInjury');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({ injid: '5b877b148a369f171465fbe1' })
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function (err, res) {
					//console.log(err);
					
					done(err);
				});
		});		
		
		it('it is used for get formdata  id  \n', function (done) {
			this.timeout(20000);
			var req = request(app).get('/api/reportformbyid/5b7fab346d1e221638de0cba');
			req.cookies = Cookies;
			  req
			  .set('Accept', 'application/json')
			  .send({ 'formid': '5b7fab346d1e221638de0cba' })
			  .expect('Content-Type', /json/)
			  .expect(200)
			  .end(function (err, res) {
					done(err);
			  });
		});	
		
		
		it('it is used for getdata from  formtype and status  \n ', function (done) {
			this.timeout(20000);
			var req = request(app).get('/api/reportdata/5b5abdd04a49471660a7856b');
			req.cookies = Cookies;
			  req
			  .set('Accept', 'application/json')
			  .send({ 'reportid': '5b5abdd04a49471660a7856b' })
			  .expect('Content-Type', /json/)
			  .expect(200)
			  .end(function (err, res) {
					done(err);
			  });
		});	
			
			
		it('It is used  report  card view  \n', function (done) {
			this.timeout(20000);
			var req = request(app).get('/api/getreportcardview/5a1834e6135ae23a880bc0e1/5a183500135ae23a880bc0ec');
			req.cookies = Cookies;
			  req
			  .set('Accept', 'application/json')
			  .send({ 'patientid': '5a1834e6135ae23a880bc0e1','injuryid':'5a183500135ae23a880bc0ec' })
			  .expect('Content-Type', /json/)
			  .expect(200)
			  .end(function (err, res) {
				  
					done(err);
			  });
		});		
			
		it('It is used for  openreportlogcount \n', function (done) {
					this.timeout(20000);
					var req = request(app).get('/api/log/getopenedreportcount/5b8f73cd0818360bfc5aaff4');
					req.cookies = Cookies;
					  req
					  .set('Accept', 'application/json')
					  .send({ 'reportid': '5b8f73cd0818360bfc5aaff4' })
					  .expect('Content-Type', /json/)
					  .expect(200)
					  .end(function (err, res) {
							done(err);
					  });
		});	
		
		it('It is used for  submittedreportclosereportlog  \n', function (done) {
							this.timeout(20000);
							var req = request(app).get('/api/log/submitedreportcloselog/5baf5f1080bc242fe8f1c97a');
							req.cookies = Cookies;
							  req
							  .set('Accept', 'application/json')
							  .send({ 'reportid': '5baf5f1080bc242fe8f1c97a' })
							  .expect('Content-Type', /json/)
							  .expect(200)
							  .end(function (err, res) {
								  //console.log(res.text);
									done(err);
							  });
		});
			
		it('it is used for delete report \n', function (done) {
							this.timeout(20000);
							var req = request(app).get('/api/deletereport/54620f84614abbcc1800003a');
							req.cookies = Cookies;
							  req
							  .set('Accept', 'application/json')
							  .send({ 'reportid': '54620f84614abbcc1800003a' })
							  .expect('Content-Type', /json/)
							  .expect(200)
							  .end(function (err, res) {
									done(err);
							  });
		});	
		
it(' it is used for patient report save  \n', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/patientdata/save');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({"reportid":"5b877fa04dc3ba107415ffe0",
							"data":{
							"otherforminfo":{
							"previousclosere portdateofinjury":"2018-08-30T05:24:48.972Z"
							},
							"rfadetails":{
							"disableradio":"1",
							"email":"sorryshaktiman2015@gmail.com",
							"lastname":"rfalast",
							"firstname":"rfafirst new"
							},
							"irsnumber":null,
							"ActivitiesofDailyLiving":{
							"disableradio":"1",
							"ADLsexualE recBodythoracicradio":"No limitations",
							"ADLsexualLubriBodythoracicradio":"No lim itations",
							"ADLsexualEjacBodythoracicradio":"No limitations",
							"ADLsexualOrgaBodyth oracicradio":"No limitations",
							"ADLsleepNoctBodythoracicradio":"No limitations",
							" ADLsleepRestBodythoracicradio":"No limitations",
							"ADLtravelFlyBodythoracicradio":"No limitations",
							"ADLtravelDrivBodythoracicradio":"No limitations",
							"ADLtravelRid Bodythoracicradio":"No limitations",
							"ADLnonSpecTactBodythoracicradio":"No limita tions",
							"ADLnonSpecLiftBodythoracicradio":"No limitations",
							"ADLnonSpecGraspBodyth oracicradio":"No limitations",
							"ADLsensorySmellBodythoracicradio":"No limitations ",
							"ADLsensoryTastBodythoracicradio":"No limitations",
							"ADLsensoryTactileBodythora cicradio":"No limitations",
							"ADLsensorySeeBodythoracicradio":"No limitations",
							"AD LsensoryHearBodythoracicradio":"No limitations",
							"ADLPhysicalClimbBodythoracicrad io":"No limitations",
							"ADLPhysicalWalkBodythoracicradio":"No limitations",
							"ADLPhy sicalRecliBodythoracicradio":"No limitations",
							"ADLPhysicalSitBodythoracicradio":"No limitations",
							"ADLPhysicalStandBodythoracicradio":"No limitations",
							"ADLcommSp eakingBodythoracicradio":"No limitations",
							"ADLcommHearingBodythoracicradio":"No limitations",
							"ADLcommSeeingBodythoracicradio":"No limitations",
							"ADLcommTypingBod ythoracicradio":"No limitations",
							"ADLcommWritBodythoracicradio":"No limitations",
							"ADLselfCareEatBodythoracicradio":"No limitations",
							"ADLselfCareBathBodythoracic radio":"No limitations",
							"ADLselfCareDressBodythoracicradio":"No limitations",
							"AD LselfCareHairBodythoracicradio":"No limitations",
							"ADLselfCareTeethBodythoracicra dio":"No limitations",
							"ADLselfCareDefeBodythoracicradio":"No limitations",
							"ADLse lfCareUrinBodythoracicradio":"No limitations",
							"visited":false
							},
							"addendum":[
							],
							"workStatusNote":[
							],
							"usernpinumber":"1230000000",
							"signDoctor":{
							"level4":{
							"firstname ":"shridhar",
							"lastname":"gadhave",
							"licensenumber":"MD234234",
							"speciality":[
							{
							"name":"",
							"boardcertified":false,
							"_id":"55b1d779a4c0a01009000020"
							}
							],
							"profession":[
							"dc"
							],
							"otherprofessiontext":"",
							"id":"55b1d779a4c0a0100900001f"
							}
							},
							"workrestriction":{
							"disableradio":"1",
							"WRea10":"Allowed",
							"WRea9":"Allowed",
							"WRea8":"Allowed",
							"WRe a7":"Allowed",
							"WRea6":"Allowed",
							"WRea5":"Allowed",
							"WRea4":"Allowed",
							"WRea3":"All owed",
							"WRea2":"Allowed",
							"WRea1":"Allowed",
							"WRtb1tr29":"No limitations",
							"WRtb1tr2 8":"No limitations",
							"WRtb1tr27":"No limitations",
							"WRtb1tr26":"No limitations",
							"W Rtb1tr25":"No limitations",
							"WRtb1tr24":"No limitations",
							"WRtb1tr23":"No limitati ons",
							"WRtb1tr22":"No limitations",
							"WRtb1tr21":"No limitations",
							"WRtb1tr20":"No l imitations",
							"WRtb1tr19":"No limitations",
							"WRtb1tr18":"No limitations",
							"WRtb1tr17 ":"No limitations",
							"WRtb1tr16":"No limitations",
							"WRtb1tr15":"No limitations",
							"WR tb1tr14":"No limitations",
							"WRtb1tr13":"No limitations",
							"WRtb1tr12":"No limitatio ns",
							"WRtb1tr11":"No limitations",
							"WRtb1tr10":"No limitations",
							"WRtb1tr9":"No lim itations",
							"WRtb1tr8":"No limitations",
							"WRtb1tr7":"No limitations",
							"WRtb1tr6":"No limitations",
							"WRtb1tr5":"No limitations",
							"WRtb1tr4":"No limitations",
							"WRtb1tr3":"No limitations",
							"WRtb1tr2":"No limitations",
							"visited":false
							},
							"sh":{
							"disablerad io":"1",
							"chkHobbiesOtherTextarea":null,
							"chkHobbies":[
							],
							"chkHobbiesNone":[
							],
							"rdoM ilitaryServiceTextarea":null,
							"rdoMilitaryService":null,
							"rdoSelfEmploymentTextare a":null,
							"rdoSelfEmployment":null,
							"rdoSecondJobsTextarea":null,
							"rdoSecondJobs":null,
							"SHrdoLevelOfEducationtextA":null,
							"SHrdoLevelOfEducation":null,
							"shfreedataent ry":null,
							"txtAlcohol":null,
							"chkAlcohol":[
							],
							"txtTobacco":null,
							"chkTobacco":[
							],
							"tx tStreetDrug":null,
							"chkStreetDrug":[
							],
							"txtCaffeine":null,
							"chkCaffeine":[
							],
							"chkCaf feineNegative":[
							],
							"chkOccupationalHistoryOtherTextarea":null,
							"SHchkOccupationalH istory":[
							],
							"SHrdoEmploymentStatus":null,
							"SHrdoMaritalStatus":null,
							"visited":false
							},
							"relevantmedicalsocialhistory":{
							"disableradio":"1",
							"shgeneralallergicothertex t":null,
							"shgeneralhematologicalothertext":null,
							"shgeneralendocrineothertext":null,
							"shgeneralpsychiatricothertext":null,
							"shgeneralneurologicalothertext":null,
							"sh generalskinothertext":null,
							"shgeneralmusculoskeletalothertext":null,
							"shgeneralge nitourinaryothertext":null,
							"shgeneralgastrointestinalothertext":null,
							"shgeneralr espiratoryothertext":null,
							"shgeneralcardiovascularothertext":null,
							"shgeneralthro atothertext":null,
							"shgeneraleyesothertext":null,
							"shgeneralreviewpriorothertext":null,
							"shgeneralallergiccheck":[
							],
							"shgeneralhematologicalcheck":[
							],
							"shgeneralendo crinecheck":[
							],
							"shgeneralpsychiatric":[
							],
							"shgeneralneurologicalcheck":[
							],
							"shgene ralskincheck":[
							],
							"shgeneralmusculoskeletalcheck":[
							],
							"shgeneralgenitourinary":[
							],
							"shgeneralgastrointestinalcheck":[
							],
							"shgeneralrespiratorycheck":[
							],
							"shgeneralcar diovascularcheck":[
							],
							"shgeneralthroatcheck":[
							],
							"shgeneraleyescheck":[
							],
							"shgenera lconstitutionalcheck":[
							],
							"negativeshgeneralconstitutionalcheck":[
							],
							"shgeneralrev iewpriorcheck":[
							],
							"shpriorillnessradio":null,
							"shknownallergiesothertext":null,
							"s hknownallergiesOthercheckTextarea":null,
							"shknownallergiesOthercheck":[
							],
							"shknown allergiescheck":[
							],
							"shknownallergiesNonecheck":[
							],
							"shcurrentmedicationsothertext ":null,
							"shcurrentmedications":[
							],
							"shcurrentmedicationradio":null,
							"shgeneralhealt hpriorsurgerytextother":null,
							"shgeneralhealthpriorsugeycheck":[
							],
							"shgeneralhealt hpriorsurgeryradio":null,
							"shgeneralhealthontritextother":null,
							"shgeneralhealthco ntricheck":[
							],
							"shgeneralpriorhealthradio":null,
							"visited":false
							},
							"objectivefindin gs":{
							"OfTempratureRadio":"F"
							},
							"patientcomplaints":{
							"cliniclocationobj":{
							"street":"loc1streetkalyan",
							"country":"US",
							"city":"loc1city",
							"state":"ID",
							"zipcode":"555 5555555",
							"location":"loc1",
							"phonenumber":"1222222222",
							"extension":"2333333",
							"fax number":"3444444444",
							"county":"loc1country",
							"_id":"58e3720bb844ae21a027f464"
							},
							"cliniclocation":"loc1country, loc1streetkalyan, loc1city, 5555555555, ID, US",
							"phonenumber":"0000001111",
							"currentexamdate":"2018-08-30T05:24:48.972Z",
							"subjective complaints_contactphonenumber":"1222222222",
							"subjectivecomplaints_fax":"34444444 44",
							"subjectivecomplaints_extension":"2333333"
							},
							"selectinjuries":{
							"company":"fdg ",
							"natureofbusiness":"",
							"othernatureofbusiness":"",
							"emp_telephone":"",
							"emp_exten sion":"",
							"emp_fax":"",
							"status":"current",
							"updateddate":"2017-04-04T06:26:49.090Z ",
							"updatedby":"shridhar",
							"_id":"58e33ca9b844ae21a027f44b",
							"id":"58e33ca9b844ae21 a027f44b",
							"emp_address1":"",
							"emp_address2":"",
							"emp_city":"",
							"emp_state":"",
							"emp_zipcode":"",
							"insurance_claimsadministrator":"",
							"insurance_claimsnumber":"",
							"insu ranceaddressline1":"",
							"insuranceaddressline2":"",
							"insurancecity":"",
							"insurancest ate":"",
							"insurancezipcode":"",
							"claimsadjuster_firstname":"",
							"claimsadjuster_last name":"",
							"claimsadjuster_email":"",
							"claimsadjuster_telephoneno":"",
							"claimsadjust er_extension":"",
							"claimsadjuster_fax":"",
							"claimsadjuster_address":"",
							"claimsadju ster_city":"",
							"claimsadjuster_state":"",
							"claimsadjuster_zipcode":"",
							"claimsadjus ter_company":"",
							"firstname":"ranjit",
							"middlename":null,
							"lastname":"dagad",
							"gende r":"Male",
							"dateofbirth":"1999-04-06T18:30:00.000Z",
							"dateofdeath":null,
							"socialsec urityno":"222222222",
							"employeehandedness":"Right",
							"utilizationreview_firstname":"",
							"utilizationreview_lastname":"",
							"utilizationreview_email":"",
							"utilizationrevi ew_telephoneno":"",
							"utilizationreview_extension":"",
							"utilizationreview_fax":"",
							" utilizationreview_address":"",
							"utilizationreview_city":"",
							"utilizationreview_sta te":"",
							"utilizationreview_zipcode":"",
							"utilizationreview_company":"",
							"rncasemana ger_firstname":"",
							"rncasemanager_lastname":"",
							"rncasemanager_email":"",
							"rncasema nager_telephoneno":"",
							"rncasemanager_extension":"",
							"rncasemanager_fax":"",
							"rncas emanager_address":"",
							"rncasemanager_city":"",
							"rncasemanager_state":"",
							"rncaseman ager_zipcode":"",
							"rncasemanager_company":"",
							"location_address1":"",
							"location_add ress2":"",
							"location_zipcode":"",
							"location_city":"",
							"location_state":"",
							"dateofin jury":"2017-03-31T18:30:00.000Z",
							"dateoflastwork":"",
							"timeofinjury":"2017-04-04T 06:25:02.992Z",
							"injuryplace":"",
							"isinjurywitnes":"",
							"other_injuryplace":"",
							"firs taid":"",
							"other_measure_text":"",
							"reportedemployOther":"",
							"reportedemployer":"",
							"afterworking":"",
							"other_afterworking":"",
							"additionaldetail":"",
							"other_isinjuryw itnes":"",
							"evaluated_prior":"",
							"timeofpriorevaluation":"",
							"dateofpriorevaluation ":"",
							"otherwitnes":"",
							"other_measure":[
							],
							"other_reportedemploye":[
							],
							"durationofe mployement":"",
							"durationtype":"",
							"jobtitle":"",
							"witnes":[
							],
							"witnesothercheck":[
							],
							"firstaid_measure":[
							],
							"reportedemploye":[
							],
							"reportedEmployerOtherText":"",
							"sibodypart":[
							{
							"bodysystem":"Spine",
							"id":"thoracic",
							"text":"Thoracic",
							"sequence":2,
							"s electable":true,
							"bdsides":"none",
							"bdmechanism":"Pushing",
							"bdpartother":"",
							"bdsys temother":"",
							"dateOfRating":"",
							"ratebodypart":false,
							"ratebodyYesNoRadio":"No"
							}
							],
							"concatedbodypart":[
							{
							"bodysystem":"Spine",
							"id":"thoracic",
							"text":"Thoracic",
							"seq uence":2,
							"selectable":true,
							"bdsides":"none",
							"bdmechanism":"Pushing",
							"bdpartother ":"",
							"bdsystemother":"",
							"concateId":"thoracic",
							"dateOfRating":"",
							"ratebodypart":false,
							"ratebodyYesNoRadio":"No"
							}
							],
							"ethnicityselect":"",
							"injuredrace":"",
							"ethnici tyselectother":null,
							"injuredraceother":null,
							"phonenumber":"0000001111",
							"visited":true
							},
							"bginfo":{
							"firstname":"ranjit",
							"middlename":"",
							"lastname":"dagad",
							"gender ":"Male",
							"dateofbirth":"1999-04-06T18:30:00.000Z",
							"dateofdeath":null,
							"socialsecu rityno":"222222222",
							"employeehandedness":"Right",
							"status":"current",
							"updateddate ":"2017-04-04T06:24:32.911Z",
							"updatedby":"shridhar",
							"_id":"58e33c3db844ae21a027f 432",
							"id":"58e33c3db844ae21a027f432",
							"email":"",
							"homephone":"",
							"cellphone":"",
							"w orkphone":"",
							"extension":"",
							"preferredcommunication":"",
							"preferredcommunicationo ther":"",
							"addressline1":"fr",
							"addressline2":"rto",
							"city":"fdg",
							"state":"AL",
							"zip code":"",
							"currentoccupation":"",
							"currentoccupationother":"",
							"location_address1":"",
							"location_address2":"",
							"location_zipcode":"",
							"location_city":"",
							"location_sta te":"",
							"emp_address1":"",
							"emp_address2":"",
							"emp_city":"",
							"emp_state":"",
							"emp_zip code":"",
							"company":"fdg",
							"natureofbusiness":"",
							"othernatureofbusiness":"",
							"emp_t elephone":"",
							"emp_extension":"",
							"emp_fax":"",
							"durationofemployement":"",
							"duratio ntype":"",
							"jobtitle":"",
							"insurance_claimsadministrator":"",
							"insurance_claimsnumb er":"",
							"insuranceaddressline1":"",
							"insuranceaddressline2":"",
							"insurancecity":"",
							"insurancestate":"",
							"insurancezipcode":"",
							"claimsadjuster_firstname":"",
							"claimsa djuster_lastname":"",
							"claimsadjuster_email":"",
							"claimsadjuster_telephoneno":"",
							" claimsadjuster_extension":"",
							"claimsadjuster_fax":"",
							"claimsadjuster_address":"",
							"claimsadjuster_city":"",
							"claimsadjuster_state":"",
							"claimsadjuster_zipcode":"",
							"claimsadjuster_company":"",
							"dateofinjury":"2017-03-31T18:30:00.000Z",
							"dateoflas twork":"",
							"timeofinjury":"2017-04-04T06:25:02.992Z",
							"injuryplace":"",
							"isinjurywi tnes":"",
							"other_injuryplace":"",
							"firstaid":"",
							"other_measure_text":"",
							"reportede mployOther":"",
							"reportedemployer":"",
							"afterworking":"",
							"other_afterworking":"",
							"additionaldetail":"",
							"other_isinjurywitnes":"",
							"evaluated_prior":"",
							"timeofprior evaluation":"",
							"dateofpriorevaluation":"",
							"otherwitnes":"",
							"other_measure":[
							],
							"other_reportedemploye":[
							],
							"administrativerule":"AMA Guides 5th Edition",
							"visited":true,
							"bginfolbl":"",
							"basicinformation":"",
							"contact":"",
							"contactinformation":"",
							"addresslbl":"",
							"address":"",
							"empinfo":"",
							"occupation":"",
							"injuryempinfo":"",
							"empduration":"",
							"durationlbl":"",
							"employer":"",
							"empaddlbl":"",
							"employeraddress":"",
							"insurancelbl":"",
							"insuranceadministrator":"",
							"claimadjuster":"",
							"claimsadjuster":"",
							"reportinfo":"",
							"locationaddlbl":"",
							"locationaddressinjury":"",
							"sameasempl oyeraddress":""
							}
							},
							"formtype":"dfr",
							"rfas":[
							]
							}
							)
				.expect('Content-Type', 'text/html; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
		});			
			
		it(' it is used for  testimonial random  \n ', function (done) {
			this.timeout(20000);
			var req = request(app).get('/api/testimonial/random');
			req.cookies = Cookies;
			  req
			  .set('Accept', 'application/json')
			  .expect('Content-Type', /json/)
			  .expect(200)
			  .end(function (err, res) {
					done(err);
			  });
		});	
			
		
		it('it is used for  testimonial  based on page   \n', function (done) {
		this.timeout(20000);
		var req = request(app).get('/api/testimonial/page/1');
		req.cookies = Cookies;
		  req
		  .set('Accept', 'application/json')
		  .send({ 'pagenum': '1' })
		  .expect('Content-Type', /json/)
		  .expect(200)
		  .end(function (err, res) {
			 
				done(err);
		  });
	});	
	//success
	it(' it is used for  show specialities  \n  ', function (done) {
		this.timeout(20000);
		var req = request(app).get('/api/specialities');
		req.cookies = Cookies;
		  req
		  .set('Accept', 'application/json')
		  .expect('Content-Type', /json/)
		  .expect(200)
		  .end(function (err, res) {
			  ////console.log(res);
				done(err);
		  });
	});
	//success
	it(' it is used for show ClaimsAdministrator  \n ', function (done) {
			this.timeout(20000);
			var req = request(app).get('/api/getclaimadmin/am');
			req.cookies = Cookies;
			  req
			  .set('Accept', 'application/json')
			  .expect('Content-Type',/html/)
			  .expect(200)
			  .end(function (err, res) {
				 
				 // //console.log(res);
					done(err);
			  });
	});	
	//success
	it(' it should return user details  \n ', function (done) {
			this.timeout(20000);
			var req = request(app).get('/api/rfacarduser/55b1d779a4c0a0100900001f');
			req.cookies = Cookies;
			  req
			  .set('Accept', 'application/json')
			  .send({ 'id': '55b1d779a4c0a0100900001f' })
			  .expect('Content-Type',/json/)
			  .expect(200)
			  .end(function (err, res) {
				 
				  ////console.log(res);
					done(err);
			  });
	});	
	//success
	it(' it should return carduserdetails  \n ', function (done) {
			this.timeout(20000);
			var req = request(app).get('/api/rfacarduserdetail');
			req.cookies = Cookies;
			  req
			  .set('Accept', 'application/json')
			  .expect('Content-Type',/json/)
			  .expect(200)
			  .end(function (err, res) {
				 
				  ////console.log(res);
					done(err);
			  });
	});	
	
	it('it sholud return patientsreportbasedonpatientid,injuryid,state,status && rfa  \n',function (done) {
		this.timeout(20000);
		var req = request(app).get('/api/rfacard/55d6fdc64ec48b2c2e000029/55d6fdb94ec48b2c2e000020/ca');
		req.cookies = Cookies;
		req
		.set('Accept','application/json; charset=utf-8')
		.expect('Content-Type', 'application/json; charset=utf-8')
		.expect(200)
		.end(function (err, res) {
			done(err);
			});
	});  
	
	//success
	it('it is used for getreportpricing  \n', function (done) {
			this.timeout(20000);
			var req = request(app).get('/api/getreportpricing/dfr');
			req.cookies = Cookies;
			  req
			  .set('Accept', 'application/json')
			  .expect('Content-Type',/json/)
			  .expect(200)
			  .end(function (err, res) {
				 
				  ////console.log(res);
					done(err);
			  });
	});
	//success
	it('it is used for show  reportpricinglist  \n ', function (done) {
				this.timeout(20000);
				var req = request(app).get('/api/getreportpricinglist');
				req.cookies = Cookies;
				  req
				  .set('Accept', 'application/json')
				  .expect('Content-Type',/json/)
				  .expect(200)
				  .end(function (err, res) {
					 
					  ////console.log(res);
						done(err);
				  });
	});
	//success
	it(' it is used for show  countries name  \n ', function (done) {
				this.timeout(20000);
				var req = request(app).get('/api/countries');
				req.cookies = Cookies;
				  req
				  .set('Accept', 'application/json')
				  .expect('Content-Type',/json/)
				  .expect(200)
				  .end(function (err, res) {
					 
					  ////console.log(res);
						done(err);
				  });
	});
	
	//success
	it(' it is used for show  all questions  \n ', function (done) {
				this.timeout(20000);
				var req = request(app).get('/api/questions');
				req.cookies = Cookies;
				  req
				  .set('Accept', 'application/json')
				  .expect('Content-Type',/json/)
				  .expect(200)
				  .end(function (err, res) {
					 
					  ////console.log(res);
						done(err);
				  });
	});	
  	//success
	it(' it is used for get randompublishreportid   (formtlistid)   \n', function (done) {
					this.timeout(20000);
					var req = request(app).get('/api/getrandompublishreportid/dfr/2');
					req.cookies = Cookies;
					  req
					  .set('Accept', 'application/json')
					  .expect('Content-Type',/json/)
					  .expect(200)
					  .end(function (err, res) {
						 
						  ////console.log(res);
							done(err);
					});
	});		
		it('it is used for save saveWorkStatus as worddoc  \n', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/workstatus');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send( { workStatusData:
				   { wsPublishSectionRoot: '',
					 wsPubSecWorkRest: '',
					 wsPubSecEnvRest: '',
					 wsClinicFollowUpPlan: '',
					 wsCurrentPractice: 'ratefast',
					 cliniclocationobj:
					  { country: 'US',
						city: 'city',
						state: 'AK',
						street: 'test',
						county: 'coun',
						zipcode: '40708',
						_id: '568bbc4e8363192c17430e5e',
						location: 'a1',
						phonenumber: '2121111222',
						extension: '3333344',
						faxnumber: '4445555555' },
					 phonenumber: '2121111222',
					 extension: '3333344',
					 doctorInfo: {},
					 currentexamdate: '2018-08-24T06:58:59.889Z',
					 patientFirstname: 'sambha2',
					 patientMiddlename: '',
					 patientLastname: 'masala',
					 currentUser:
					  { id: '554731842ea9829026000021',
						role: 'siteadmin',
						practicename: 'ratefast',
						username: 'siteadmin',
						rolename: 'siteadmin',
						level: 'level4',
						enableAutoLogout: true,
						enableOauth: false,
						firstname: 'siteadmin22',
						lastname: 'site11',
						isresetPwdexpired: false,
						passwordchangedate: '2018-06-20T04:46:37.719Z',
						passwordEmailAlert: [Object],
						profession: '',
						otherprofessiontext: '',
						athena_departmentid: 0,
						practiceDetails: [Object] },
					 currentDate: '2018-09-04T09:05:16.947Z',
					 doctorProfession: '',
					 sendAs: 'senddoc' },
				  reportid: '5b7facb36d1e221638de0cd8' })
				.expect('Content-Type', 'text/html; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
			});		
		//success	
			it(' find all report data aganist reportype  \n', function (done) {
				this.timeout(20000);
				var req = request(app).get('/api/reportpricing/pr2');
				req.cookies = Cookies;
				  req
				  .set('Accept', 'application/json')
				  .expect('Content-Type', /json/)
				  .expect(200)
				  .end(function (err, res) {
					  ////console.log(res);
						done(err);
				  });
			});
		//success	
			it('update custom price for report  \n', function (done) {
				this.timeout(20000);
				var req = request(app).put('/api/updateCustomReportPricing/568bbc4e8363192c17430e5d');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({ _id: '535f9816ef9cdf9826000046',
				  __v: 0,
				  billingcalculatoromfs: 'on',
				  editionama: 'AMA Guides 5th Edition',
				  name: 'Rate Fast',
				  practicename: 'RateFast2',
				  pricingtype: 'custompricing',
				  reportpricing: { pr4: '49.99', pr2: '78', dfr: '45' },
				  irsnumber: null,
				  isAthena: false,
				  athena_practicename: '',
				  athena_practiceid: 0,
				  report_autosave: true,
				  kickstart_page:
				   { email_recipient: '',
					 email_content:
					  { email_body: '<p>Hi"</p><p>Your information has successfully been submited. You will becontacted within threebusiness days. If you have a question, please call 707.483.4346 or email jamd@rate-fast.com</p><p>The RateFast Team</p>',
						email_subject: 'Your work injury information has been received!' },
					 successpage: { message: '', title: '' },
					 footer: '',
					 sub_title: '',
					 title: '' },
				  logout_warning_seconds: 10,
				  session_timeout:
				   { enable: true,
					 rater2: 900,
					 rater1: 900,
					 siteadmin: 900,
					 superadmin: 900,
					 admin_level4: 1200,
					 admin_level3: 1200,
					 admin_level2: 1200,
					 admin_level1: 1200,
					 nonadmin_level4: 1800,
					 nonadmin_level3: 1800,
					 nonadmin_level2: 1800,
					 nonadmin_level1: 1800 },
				  enable_ws_docx_footer_pr4: true,
				  enable_ws_docx_footer_pr2: true,
				  enable_ws_docx_footer_dfr: true,
				  enable_ws_docx_header_pr4: true,
				  enable_ws_docx_header_pr2: true,
				  enable_ws_docx_header_dfr: true,
				  enable_report_docx_footer_pr4: true,
				  enable_report_docx_footer_pr2: true,
				  enable_report_docx_footer_dfr: true,
				  enable_report_docx_header_pr4: true,
				  enable_report_docx_header_pr2: true,
				  enable_report_docx_header_dfr: true,
				  enable_docx_footer: true,
				  enable_docx_header: true,
				  kickstart_url: '',
				  enable_kickstart: false,
				  practicename2: '',
				  faxnumber: '8555555555',
				  userextension: '',
				  userphonenumber: '',
				  stampapproval: 'publish',
				  usercount: 1,
				  createdon: '2014-04-29T12:16:22.788Z',
				  status: 'active',
				  practiceaddress:
				   [ { street: 'sa',
					   country: 'US',
					   city: 'sci',
					   state: 'KS',
					   zipcode: '1111111111',
					   location: 's1',
					   phonenumber: '1111115555',
					   extension: '2222444',
					   faxnumber: '8555555555',
					   county: 'sc',
					   _id: '58c8cd3aa1f61328c88255a3' } ],
				  rfadetails: null,
				  billingaddress: { phonenumber: '1111115555', billingextension: '2222444' } } )
				.expect('Content-Type', 'text/plain')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
			});		
		//success	
		it('set report global pricing  \n', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/updateglobalpricing');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({ pricing: { dfr: '2', pr2: '4.99', pr4: '49.99' } } )
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
			});	
		//success	
		it('get injury information based on patientid  \n', function (done) {
				this.timeout(20000);
				var req = request(app).get('/api/patients/getinjurylibrary/5a1834e6135ae23a880bc0e1/0');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
			});
		//success	
		it('get injury information based on patientid \n', function (done) {
				this.timeout(20000);
				var req = request(app).get('/api/patients/getidpinfo/5a1834e6135ae23a880bc0e1/0');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
			});
		//success	
		it('it is used for addsubinjuriesbodypart   \n', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/patients/addsubinjuriesbdpart');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({ injid: '5a183500135ae23a880bc0ec',
				  injurydata:
				   { company: 'fdg',
					 natureofbusiness: '',
					 othernatureofbusiness: '',
					 emp_telephone: '9861238307',
					 emp_extension: '',
					 emp_fax: '3234254356',
					 status: 'current',
					 updateddate: '2017-04-04T06:26:49.090Z',
					 updatedby: 'shridhar',
					 id: '5b8f5da8aee09405c478ea4c' },
				  text: 'injury.$.injurydata.employer',
				  changetoarchive: false } )
				.expect('Content-Type', 'text/plain')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
			});	
		//success	
		it(' it used for UpdateInjuryinformation  \n', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/patients/updateinjuryinformationdetails');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({ injid: '5a183500135ae23a880bc0ec',
				  injuryinformation:
				   [ { dateofinjury: '2017-03-31T18:30:00.000Z',
					   dateoflastwork: '2018-09-03T18:30:00.000Z',
					   timeofinjury: '2017-04-04T06:25:02.992Z',
					   injuryplace: 'Office',
					   isinjurywitnes: '',
					   other_injuryplace: '',
					   firstaid: '',
					   other_measure_text: '',
					   reportedemployOther: '',
					   reportedemployer: '',
					   afterworking: '',
					   other_afterworking: '',
					   additionaldetail: '',
					   other_isinjurywitnes: '',
					   evaluated_prior: '',
					   timeofpriorevaluation: '',
					   dateofpriorevaluation: '',
					   otherwitnes: '',
					   updateddate: '2017-04-04T06:26:49.090Z',
					   updatedby: 'shridhar',
					   _id: '5b8e328b0d322c0e2cb18228',
					   dateofpermanent: '2018-01-31T18:30:00.000Z',
					   other_measure: [],
					   other_reportedemploye: [],
					   id: '5b8e328b0d322c0e2cb18228' } ] } )
				.expect('Content-Type', 'text/plain')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
			});
		//success
		it('it used for updateEmployeeHandedness in injury  \n', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/injuries/updateEmployeeHandedness');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({ ptid: '58e33c3db844ae21a027f429', handedness: 'Right' } )
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
		});	
		//success
		it(' it is used for to update  injuries viewby  \n', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/injuries/addViewer');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({ username: 'shridhar', injid: '58e33c43b844ae21a027f434' } )
				.expect('Content-Type', 'text/html; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
		});
		//success
		
		
		it('serch with patients in dashboard  \n', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/patientsearch');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({ pageController: 'page',
				  pagenum: 1,
				  sfname: 'ranjit',
				  slname: 0,
				  sdob: 0,
				  ssocial: 0,
				  searchController: 'search',
				  selectedstatecode: 'CA',
				  gender: '',
				  recordsBy: 'practicename',
				  confirmed: false } )
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
		});
		
		it('serch with patientswithreports  in dashboard  \n', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/searchpatientwithreports');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({ pageController: 'page',
				  pagenum: 1,
				  sfname: 'ranjit',
				  slname: 0,
				  sdob: 0,
				  ssocial: 0,
				  searchController: 'search',
				  selectedstatecode: 'CA',
				  gender: '',
				  recordsBy: 'practicename',
				  confirmed: false,
				  startInjuryDate: 0,
				  endInjuryDate: '2018-09-07T06:06:48.276Z',
				  startServiceDate: 0,
				  endServiceDate: '2018-09-07T06:06:48.276Z',
				  startSubmitDate: 0,
				  endSubmitate: '2018-09-07T06:06:48.276Z',
				  status: [ 'open', 'closed', 'level1', 'level2' ],
				  reporttype: [ 'dfr', 'pr2', 'pr4' ] })
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					done(err);
				});
		});
		
		it('updaterecentviews in dashboard  \n', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/patients/updateRecentViews');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({ })
				.expect('Content-Type', 'text/html; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					
					done(err);
				});
		});
		
			
		it('it is used for get injury Archive Information \n', function (done) {
				this.timeout(20000);
				var req = request(app).get('/api/patients/getlatestinjuries/5a183500135ae23a880bc0ec/0');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					////console.log(res);
					done(err);
				});
		});
		
	it('it is used for Opened report log  \n', function (done) {
				this.timeout(20000);
				var req = request(app).get('/api/log/reportopenlog/5baf5f1080bc242fe8f1c97a');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(200)
				.end(function (err, res) {
					////console.log(res);
					done(err);
				});
		});		
		
		it('change the status of injury \n ', function (done) {
				this.timeout(20000);
				var req = request(app).post('/api/injuries/archiveStatus');
				req.cookies = Cookies;
				req
				.set('Accept','application/json; charset=utf-8')
				.send({ injid: '5a183500135ae23a880bc0ec',
			  currentId: '5b8f5ee8e174430e5853b6be',
			  sectionname: 'employer',
			  injurydata:
			   { company: 'fdg',
				 natureofbusiness: '',
				 othernatureofbusiness: '',
				 emp_telephone: '9861238307',
				 emp_extension: '',
				 emp_fax: '3234254356',
				 status: 'current',
				 updateddate: '2018-09-06T07:26:26.743Z',
				 updatedby: 'shridhar',
				 _id: '5b8f5ee8e174430e5853b6be',
				 id: '5b8f5e000000000000e8e174430e5853b6be' } })
				.expect('Content-Type', 'text/plain')
				.expect(200)
				.end(function (err, res) {
					//console.log(err);
					done(err);
				});
		});
		
		
                });
            }
            catch (e) {
                throw e
            }
			}, function (err, result) {
    // all finished
    console.log('database calls done');
  });

}
var arr = new Array(10);
OuterFunction(arr)
			
        /* }
    }, j * interval);
} */
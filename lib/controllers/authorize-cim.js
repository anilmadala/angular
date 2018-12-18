'use strict';
var mongoose = require('mongoose'),
User = mongoose.model('User'),
Practice = mongoose.model('Practice');
/*
var Authorize = require('auth-net-cim/node_modules/auth-net-types');
var _AuthorizeCIM = require('auth-net-cim'),
    AuthorizeCIM = new _AuthorizeCIM({
        api: '36S7U8qbktFK',
        key: '6K4EMJv3Qn3k3m6k',
        sandbox: true // false
    });
*/

var envSetting = {
    api: process.env.AUTHORIZE_API,
    key: process.env.AUTHORIZE_KEY,
    sandbox: process.env.node_env != 'production',
    cert: false
};
var setValidateMode = process.env.node_env != 'production' ? 'testMode' : 'liveMode';

var Authorize = require('auth-net-cim');
var _AuthorizeCIM = require('auth-net-cim'),
    AuthorizeCIM = new _AuthorizeCIM(envSetting);


exports.customCreateProfile = function (newPractice, practiceUser, callback) {
   
    var month = newPractice.month.trim().split('-')[0];
    if (month.length == 1) {
        month = "0" + month;
    }
    var merchantId = (new Date()).getTime() + Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    
    var expdate = newPractice.year + "-" + month;
    AuthorizeCIM.createCustomerProfile({
        customerProfile: {
            merchantCustomerId: merchantId,
            description: newPractice.practicename,
            email: newPractice.billingaddress.billingemail,
            customerProfileId: 1234,
            customerType: 'individual',
            paymentProfiles: {
                customerType: 'individual',
                billTo: {
                    firstName: practiceUser.firstname,
                    lastName: practiceUser.lastname,
                    company: '',
                    address: newPractice.billingaddress.billingaddres,
                    city: newPractice.billingaddress.city,
                    state: newPractice.billingaddress.state,
                    zip: newPractice.billingaddress.zipcode,
                    country: 'US',
                    phoneNumber: newPractice.billingaddress.phonenumber
                },
                payment: {
                    creditCard: {
                        cardNumber: newPractice.creditcardnumber,
                        expirationDate: expdate
                    }
                }
            }
        }
    }, function (err, response) {
        if (err) {
           
            callback(err);
        } else {            
            newPractice.cimprofileid = response.customerProfileId;
            newPractice.merchantid = merchantId;
            newPractice.paymentprofileid = response.customerPaymentProfileIdList.numericString;
            callback(err, response);
        }
    })
};

var addBillingaddress = function (newPractice, practiceUser, callback) {
    
    AuthorizeCIM.createCustomerShippingAddress({
        customerProfileId: newPractice.cimprofileid,
        shippingAddress: ({
            firstName: practiceUser.firstname,
            lastName: practiceUser.lastname,
            address: newPractice.billingaddress.billingaddres,
            city: newPractice.billingaddress.city,
            state: newPractice.billingaddress.state,
            zip: newPractice.billingaddress.zipcode,
            country: 'US'
        })
    }, function (err, response) {
        if (!err) {            
            callback(null, response);
        } else {
            callback(err);
        }
    });
};


var createCustomerPaymentProfile = function (newPractice, callback) {
   
    var month = newPractice.month.trim().split('-')[0];
    if (month.length == 1) {
        month = "0" + month;
    }
   
    var expdate = newPractice.year + "-" + month;

    var options = {
        customerType: 'individual',

        payment: {
            creditCard: {
                cardNumber: newPractice.creditcardnumber,
                expirationDate: expdate
            }
        }
    }

    
    AuthorizeCIM.createCustomerPaymentProfile({ customerProfileId: newPractice.cimprofileid, paymentProfile: options }, function (err, response) {
        if (err) {
           
            callback(err);
        }
        else {
            newPractice.paymentprofileid = response.customerPaymentProfileId;
            
            callback(null, response);
        }
    });


}

var getcustomerprofile = function (newPractice, callback) {
    
    
    AuthorizeCIM.getCustomerProfile(newPractice.cimprofileid, function (err, response) {
        if (err) {
            callback(err);
        }
        else {
            newPractice.merchantid = response.profile.merchantCustomerId;
            //newPractice.paymentprofileid= response.profile.paymentProfiles.customerPaymentProfileId;
            callback(null, response);
        }
    });
};

exports.getcustomerpaymentprofile = function (newPractice, callback) {

    
    if (newPractice.cimprofileid) {
        AuthorizeCIM.getCustomerPaymentProfile({
            customerProfileId: newPractice.cimprofileid
            //customerPaymentProfileId: '1234'
        }, function (err, response) {            
            callback(null, response);
        });
    }
}

exports.updatecustomerprofile = function (customer_personal_info, customer_payment_info) {

    /*
     var customerupdateinfo = new Authorize.CustomerBasic({
     email: 'like_matya@yahoo.co.in',
     merchantCustomerId: 1392189987831,
     description: 'New description! updated.......',
     customerProfileId: 24024528
     });
     */

    AuthorizeCIM.updateCustomerProfile(customer_personal_info, function (err, response) {
        if (err) {
           
        }
        else {            
           
        }
    });

};


exports.updateBillingaddress = function (billingaddress, cimPid, callback) {

   

    AuthorizeCIM.updateCustomerShippingAddress({
        customerProfileId: cimPid,
        address: ({
            firstName: 'John',
            lastName: 'Smith',
            address: billingaddress.billingaddres,
            state: billingaddress.state,
            city: billingaddress.city,
            country: 'US',
            zip: billingaddress.zipcode,
            customerAddressId: null
        })
    }, function (err, response) {
        if (err) {  }
        else { return callback(null, response); }
    });
};

exports.updateCustomerPaymentProfile = function (customer_personal_info, callback) {
   
    var options = {
        customerPaymentProfileId: customer_personal_info.paymentProfileId,
        customerType: 'individual',
        billTo: {
            firstName: customer_personal_info.userinfo.firstname,
            lastName: customer_personal_info.userinfo.lastname,
            address: customer_personal_info.billingaddress.billingaddres,
            city: customer_personal_info.billingaddress.city,
            state: customer_personal_info.billingaddress.state,
            zip: customer_personal_info.billingaddress.zipcode,
            country: 'US',
            phoneNumber: customer_personal_info.billingaddress.phonenumber
        },
        payment: {
            creditCard: {
                cardNumber: customer_personal_info.cardNumber,
                expirationDate: customer_personal_info.expirationDate
            }
        }
    }
    var customer_payment_info = {
        customerProfileId: customer_personal_info.profileId,
        paymentProfile: options
    }

    AuthorizeCIM.updateCustomerPaymentProfile(customer_payment_info, function (err, response) {
        if (err) {
            callback(err);
           
        }
        else {
           
            callback();
          
        }
    });
}

// Authorize.net Payment function Authentication & Payment

exports.getCustomerProfile = function (req, res) {

    
    //var practicename = req.params.practicename;
    var practicename = req.user.practicename;
    var chargeAmount = req.params.chargeamount;

    Practice.find({ "practicename": practicename }, { "paymentprofileid": 1, "cimprofileid": 1, "merchantid": 1 }, function (err, practices) {
        if (err) {
           
            res.jsonp(500, { message: err });
        }
        else {            

            if (practices) {                
               
                if (practices[0].cimprofileid) {
                    var transaction = {
                        amount: chargeAmount,
                        customerProfileId: practices[0].cimprofileid,
                        customerPaymentProfileId: practices[0].paymentprofileid
                    };
                    
                    //Setting the limit between duplicate transaction
                    AuthorizeCIM.setExtraOptions({
                        x_duplicate_window: 0
                    });

                    AuthorizeCIM.createCustomerProfileTransaction('AuthCapture', transaction, function (err, result) {
                        if (!err) {
                           
                            res.jsonp([{ responce: result }]);
                        }
                        else {
                            
                            //res.jsonp(500, { message: 'There was some error in the transaction, hence report could not be closed. However, your data has been saved. Error is :' + JSON.stringify(err) });
							res.jsonp(500, err );
                        }
                    });                
                }
                else {
                    res.jsonp(500, { message: err });
                }
            } else {
                res.jsonp([{ responce: [] }]);
            }
        }
    })
};

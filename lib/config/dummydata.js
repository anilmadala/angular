/*'use strict';

var mongoose = require('mongoose'),
    encrypt = mongoose.model('Encrypted');

encrypt.find({}).remove(function () {
    encrypt.create({
        name: 'HTML5 Boilerplate',
        age: 25
    }, function () {

    }
    );
});*/

//'use strict';

//var mongoose = require('mongoose'),
//    User = mongoose.model('User'),
//    Practice = mongoose.model('Practice'),
//    Thing = mongoose.model('Thing'),
//    Template = mongoose.model('Template'),
//    Speciality = mongoose.model('Speciality');

// * Populate database with sample application data
// */

////Clear old things, then add things in
//Thing.find({}).remove(function () {
//    Thing.create({
//            name: 'HTML5 Boilerplate',
//            info: 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
//            awesomeness: 10
//        }, {
//            name: 'AngularJS',
//            info: 'AngularJS is a toolset for building the framework most suited to your application development.',
//            awesomeness: 10
//        }, {
//            name: 'Karma',
//            info: 'Spectacular Test Runner for JavaScript.',
//            awesomeness: 10
//        }, {
//            name: 'Express',
//            info: 'Flexible and minimalist web application framework for node.js.',
//            awesomeness: 10
//        }, {
//            name: 'MongoDB + Mongoose',
//            info: 'An excellent document database. Combined with Mongoose to simplify adding validation and business logic.',
//            awesomeness: 10
//        }, function () {
//            
//        }
//    );
//});

////Clear old users, then add a default user

//User.find({}).remove(function () {
//    User.create({
//        provider: 'local',
//        firstname: 'siteadmin',
//        lastname: 'siteadmin',
//        username: 'siteadmin',
//        email: 'siteadmin@test.com',
//        password: 'siteadmin',
//        question: '52f8e52c226f1c2b38272c68',
//        answer: 'Rugby',
//        practice: [{ 'name': 'ratefast', 'role': 'siteadmin', 'rolename': 'siteadmin', 'status': 'active' }],
//        profession: [],
//        speciality: [],
//        licensenumber: 'ABCDE'
//    },
//    {
//        provider: 'local',
//        firstname: 'Rater1',
//        lastname: 'Rater1',
//        username: 'rater1',
//        email: 'rater1@test.com',
//        password: 'rater1',
//        question: '52f8e52c226f1c2b38272c68',
//        answer: 'Rugby',
//        practice: [{ 'name': 'ratefast', 'role': 'rater1', 'rolename': 'rater1', 'status': 'active' }],
//        profession: [],
//        speciality: [],
//        licensenumber: 'AB234'
//    },
//    {
//        provider: 'local',
//        firstname: 'Rater2',
//        lastname: 'Rater2',
//        username: 'rater2',
//        email: 'rater2@test.com',
//        password: 'rater2',
//        question: '52f8e52c226f1c2b38272c68',
//        answer: 'Rugby',
//        practice: [{ 'name': 'ratefast', 'role': 'rater2', 'rolename': 'rater2', 'status': 'active' }],
//        profession: [],
//        speciality: [],
//        licensenumber: '12CDE'
//    },
//    {
//        provider: 'local',
//        firstname: 'user1',
//        lastname: 'user1',
//        username: 'user1',
//        email: 'user1@test.com',
//        password: 'user1',
//        question: '52f8e52c226f1c2b38272c68',
//        answer: 'Rugby',
//        practice: [{ 'name': 'practice1', 'role': 'superadmin', 'rolename': 'superadmin', 'status': 'active' }, { 'name': 'practice2', 'role': 'admin level4', 'rolename': 'admin', 'level': 'level4', 'status': 'active' }],
//        profession: [],
//        speciality: [],
//        licensenumber: 'A12DE'
//    },
//    {
//        provider: 'local',
//        firstname: 'user2',
//        lastname: 'user2',
//        username: 'user2',
//        email: 'user2@test.com',
//        password: 'user2',
//        question: '52f8e52c226f1c2b38272c68',
//        answer: 'Rugby',
//        practice: [{ 'name': 'practice2', 'role': 'admin level4', 'rolename': 'superadmin', 'status': 'active', 'level': 'level4' }, { 'name': 'practice1', 'role': 'nonadmin level4', 'rolename': 'nonadmin', 'level': 'level4', 'status': 'active' }],
//        profession: [],
//        speciality: [],
//        licensenumber: 'B12DE'
//    },
//    {
//        provider: 'local',
//        firstname: 'user3',
//        lastname: 'user3',
//        username: 'user3',
//        email: 'user3@test.com',
//        password: 'user3',
//        question: '52f8e52c226f1c2b38272c68',
//        answer: 'Rugby',
//        practice: [{ 'name': 'practice2', 'role': 'nonadmin level4', 'rolename': 'nonadmin', 'level': 'level4', 'status': 'active' }],
//        profession: [],
//        speciality: [],
//        licensenumber: 'A12DE'
//    },
//    {
//        provider: 'local',
//        firstname: 'user4',
//        lastname: 'user4',
//        username: 'user4',
//        email: 'user4@test.com',
//        password: 'user4',
//        question: '52f8e52c226f1c2b38272c68',
//        answer: 'Rugby',
//        practice: [{ 'name': 'practice2', 'role': 'nonadmin level3', 'rolename': 'nonadmin', 'level': 'level3', 'status': 'active' }],
//        profession: [],
//        speciality: [],
//        licensenumber: '122DE'
//    },
//    {
//        provider: 'local',
//        firstname: 'user5',
//        lastname: 'user5',
//        username: 'user5',
//        email: 'user5@test.com',
//        password: 'user5',
//        question: '52f8e52c226f1c2b38272c68',
//        answer: 'Rugby',
//        practice: [{ 'name': 'practice2', 'role': 'nonadmin level2', 'rolename': 'nonadmin', 'level': 'level2', 'status': 'active' }],
//        profession: [],
//        speciality: [],
//        licensenumber: '12EEE'
//    },
//    {
//        provider: 'local',
//        firstname: 'user6',
//        lastname: 'user6',
//        username: 'user6',
//        email: 'user6@test.com',
//        password: 'user6',
//        question: '52f8e52c226f1c2b38272c68',
//        answer: 'Rugby',
//        practice: [{ 'name': 'practice2', 'role': 'nonadmin level1', 'rolename': 'nonadmin', 'level': 'level1', 'status': 'active' }],
//        profession: [],
//        speciality: [],
//        licensenumber: '1CXDE'
//    }, function () {
//            
//        }
//    );
//});

//Template.find({}).remove(function () {
//    Template.create({
//            "name": "Registration",
//            "subject": "Welcome to Rate Fast - Registration",
//            "dataMsg": "<b>Hi {username},</b><br/><br/> You have successfuly Registered on RateFast <br/><br/>Click on the below link to activate your account<br>{link}"
//        },
//        {
//            "name": "ForgotPassword",
//            "subject": "Password Reset",
//            "dataMsg": "Please use this link to change password {link}"
//        },
//        {
//            "name": "ForgotUsername",
//            "subject": "please find your rate-fast username.",
//            "dataMsg": "<b>Hello,</b><br/><br/> your rate-fast username is  {username}<br/><br/>Thank you"
//        },
//        {
//            "name": "InviteNewuser",
//            "subject": "Invitation To Join Rate Fast",
//            "dataMsg": "<b>Hi, </b><br/> You have invitation To join RateFast, Click on the below link to Accept<br><a href='{link}'>Accept</a> <br/>Thank you"
//        },
//        {
//            "name": "InviteExcitinguser",
//            "subject": "Invitation To Join Rate Fast",
//            "dataMsg": "<b>Hi, </b><br/> You have invitation To join RateFast, Click on the below link to Accept<br><a href='{link}'>Accept</a> <br/>Thank you"
//        },
//        function () {

//        }
//    );
//});

//Speciality.find({}).remove(function () {
//    Speciality.create(
//        {
//            "title": 'Allergy and Immunology',
//            "accounttype": "provider"

//        },
//        {
//            "title": 'Anesthesiology',
//            "accounttype": "provider"

//        },
//        {
//            "title": 'Chiropractic',
//            "accounttype": "provider"
//        },
//        {
//            "title": 'Dermatology',
//            "accounttype": "provider"
//        },
//        {
//            "title": 'Emergency Medicine', "accounttype": "provider"
//        },
//        {
//            "title": 'Family Medicine', "accounttype": "provider"
//        },
//        {
//            "title": 'Family Medicine/Sports Medicine', "accounttype": "provider"
//        },
//        {
//            "title": 'Internal Medicine', "accounttype": "provider"
//        },
//        {
//            "title": 'Internal Medicine/Cardiology', "accounttype": "provider"
//        },
//        {
//            "title": 'Internal Medicine/Pulmonary Disease', "accounttype": "provider"
//        },
//        {
//            "title": 'Internal Medicine/Rheumatology', "accounttype": "provider"
//        },
//        {
//            "title": 'Internal Medicine/Sports Medicine', "accounttype": "provider"
//        },
//        {
//            "title": 'Neurology', "accounttype": "provider"
//        },
//        {
//            "title": 'Neurological Surgery', "accounttype": "provider"
//        },
//        {
//            "title": 'Obstetrics and Gynecology', "accounttype": "provider"
//        },
//        {
//            "title": 'Occupational Medicine', "accounttype": "provider"
//        },
//        {
//            "title": 'Occupational Medicine/ Medical Toxicology', "accounttype": "provider"
//        },
//        {
//            "title": 'Ophthalmology', "accounttype": "provider"
//        },
//        {
//            "title": 'Orthopedic Surgery', "accounttype": "provider"
//        },
//        {
//            "title": 'Orthopedic Surgery/Orthopedic Sports Medicine', "accounttype": "provider"
//        },
//        {
//            "title": 'Orthopedic Surgery/Surgery of the Hand', "accounttype": "provider"
//        },
//        {
//            "title": 'Otolaryngology', "accounttype": "provider"
//        },
//        {
//            "title": 'Physical Medicine and Rehabilitation', "accounttype": "provider"
//        },
//        {
//            "title": 'Physical Medicine and Rehabilitation/ Pain Medicine', "accounttype": "provider"
//        },
//        {
//            "title": 'Plastic Surgery', "accounttype": "provider"
//        },
//        {
//            "title": 'Plastic Surgery/ Plastic Surgery Within the Head and Neck', "accounttype": "provider"
//        },
//        {
//            "title": 'Plastic Surgery/ Surgery of the Hand', "accounttype": "provider"
//        },
//        {
//            "title": 'Podiatry', "accounttype": "provider"
//        },
//        {
//            "title": 'Psychiatry', "accounttype": "provider"
//        },
//        {
//            "title": 'Psychiatry/ Addiction Psychiatry', "accounttype": "provider"
//        },
//        {
//            "title": 'Public Health and General Preventive Medicine', "accounttype": "provider"
//        },
//        {
//            "title": 'Surgery', "accounttype": "provider"
//        },
//        {
//            "title": 'Surgery/Surgery of the Hand', "accounttype": "provider"
//        },
//        {
//            "title": 'Thoracic and Cardiac Surgery', "accounttype": "provider"
//        },
//        {
//            "title": 'Urology', "accounttype": "provider"
//        },
//        {
//            "title": 'Paralegal', "accounttype": "attorney"
//        },
//        {
//            "title": 'Esquire', "accounttype": "attorney"
//        },
//        {
//            "title": 'Other', "accounttype": "provider"
//        },
//        function () {

//        }
//    );
//});

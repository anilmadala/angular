'use strict';

var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema


var userlogSchema = new Schema({
    username: String,
    userid: String,
    practicename: String,
    ip: String,
    device: String,
    signindate: Date,
  
    signoutdate: Date,
  
    sessionid: String
}, { versionKey: false });

userlogSchema.index({sessionid: 1});

mongoose.model('Userlog', userlogSchema);
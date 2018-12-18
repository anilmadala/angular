'use strict';

var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema


var reportlogSchema = new Schema({
    username: String,
    reportid: String,
    userid: String,
    practicename: String,
    opendate: Date,
    closedate: Date,
    role: String,
    rolename: String,
    level: String,
    status: String
}, { versionKey: false });

reportlogSchema.index({practicename: 1, reportid: 1, userid: 1, opendate: -1});

mongoose.model('Reportlog', reportlogSchema);
'use strict';

var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema


var logfaxSchema = new Schema({
	faxData: Object,
	reportid : String,
	useripdaddress: String,
	sendDate : Date
}, { versionKey: false });

mongoose.model('Logfax',logfaxSchema);
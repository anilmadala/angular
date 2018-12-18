'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var AthenaCodeSchema = new Schema({
	code:String,
	value : String,
	codename:String,
	type:String
});

mongoose.model('Athenacode', AthenaCodeSchema);
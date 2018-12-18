'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var FormTypesSchema = new Schema({
    title: String,
    formtype: String,
    versioncount: Number,
    reportversioncount: Number,
    permission: String
});

mongoose.model('FormTypes', FormTypesSchema);

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Increment Record Schema
 */
var incrementrecordSchema = new Schema({
    id: String,
    patientrecordno: Number
});

mongoose.model('IncrementRecord', incrementrecordSchema);

    'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var SpecialitySchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true
    },
    accounttype: String

});


mongoose.model('Speciality', SpecialitySchema);

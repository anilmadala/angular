'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var FormSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    formname: {
        type: String,
        default: '',
        trim: true
    },
    pricing: {
        type: String,
        default: ''
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Forms', FormSchema);

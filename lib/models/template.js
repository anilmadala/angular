'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Template Schema
 */
var TemplateSchema = new Schema({
    name: String,
    subject: String,
    dataMsg: String
});

TemplateSchema.index({name: 1});

mongoose.model('Template', TemplateSchema);

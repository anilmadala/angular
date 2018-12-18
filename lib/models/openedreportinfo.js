'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Openreport_infoSchema = new Schema({
    username: String,
    reportid: String,
    createdAt: { type: Date, default: Date.now }
});

Openreport_infoSchema.index({createdAt: 1});
Openreport_infoSchema.index({reportid: 1, username: 1});

mongoose.model('Openreportinfo', Openreport_infoSchema);

'use strict';
/**
 * Created by Mayur.Mathurkar on 3/11/14.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PricingSchema = new Schema({
    formtype: { type: String },
    pricing: { type: String }
});

mongoose.model("Reportpricings", PricingSchema);
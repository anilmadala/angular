'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var SalespersonSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    salesperson: {
        type: String,
        default: '',
        trim: true
    },
    email: {
    type: String,
    unique: true
    },
    commissionpercentage: {
        type: Number
    },
    status:{
      type: String
    }
});

SalespersonSchema.statics = {
    list: function (options, cb) {
        this.find()
            .sort({ 'name': 1 }) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    },
    status: function (options, cb) {
        this.find({status: options.status})
          .sort({ 'name': 1 })
          .limit(options.perPage)
          .skip(options.perPage * options.page)
          .exec(cb)
    },
    search: function (options, cb) {
        this.find({ $or: [{'salesperson': { $regex: options.search, $options: 'i' }}, {'email': { $regex: options.search, $options: 'i'}}] })
          .sort({ 'name': 1 })
          .limit(options.perPage)
          .skip(options.perPage * options.page)
          .exec(cb)
    },
    combinesearch: function (options, cb) {
      this.find({ $and: [{status: options.status},{$or:[{'salesperson': { $regex: options.search, $options: 'i' }}, {'email': { $regex: options.search, $options: 'i'}}]} ]})
          .sort({ 'name': 1 })
          .limit(options.perPage)
          .skip(options.perPage * options.page)
          .exec(cb)
    }
}

SalespersonSchema.index({email: 1});

mongoose.model('Salespersons', SalespersonSchema);

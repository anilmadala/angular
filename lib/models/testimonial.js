'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Testimonial Schema
 */
var TestimonialSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    author: {
        type: String,
        default: ''
    }
});

/**
 * Validations
 */
TestimonialSchema.path('content').validate(function(content) {return content.length;}, 'Content cannot be blank');

/**
 * Statics
 */
TestimonialSchema.statics.list =   function (options, cb) {
    var criteria = options.criteria || {}
	
    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }



mongoose.model('Testimonial', TestimonialSchema);

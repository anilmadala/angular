'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var BlogSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    author: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: ''
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
BlogSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
BlogSchema.statics = {

  list:  function (options, cb) {
    var criteria = options.criteria || {}
    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  },

  findone:  function (options, cb) {
    this.find({ _id : options.blogId})
      .exec(cb)
  },

  category: function (options, cb) {
    this.find({category : options.category})
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  },

   search: function (options, cb) {
    
    var criteria = options.searchId;
    criteria = '.*' + criteria + '.*';
   
     this.find( { $or: [ { 'content' : { $regex :  criteria/i , $options : 'i' }} , { 'title' : { $regex : criteria/i , $options : 'i' }} ]} )
     //this.find( { 'title' : { $regex :  criteria , $options : 'i' }} )
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}

mongoose.model('Blog', BlogSchema);

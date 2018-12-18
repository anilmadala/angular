'use strict';

var mongoose = require('mongoose'),
    Testimonial = mongoose.model('Testimonial');

/**
 * Get Random Testimonial
 */
exports.getRandom = function (req, res, next) {
  var randomnumber ;
  Testimonial.count().exec(function (err, result) {
    randomnumber = Math.floor(Math.random() * ((result-1) - 0 + 1)) + 0;
    
    Testimonial.find().limit(-1).skip(randomnumber).exec(function (err, testimonial) {
    if (!err) {
      // res.send("random" + randomnumber);
     res.send(testimonial);
     
    } else {
      return res.send(err);
    }
    });
  });
 };
 

/**
 * Get Paged Testimonial
 */
 exports.index = function(req, res){
    
  var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
  var perPage = 4
  var options = {
    perPage: perPage,
    page: page,	
  }
  
  options.criteria= {'show': 1};

  Testimonial.list(options, function(err, testimonials) {
    if (err) 
		//return res.render('500')
		return res.send(500);//Changed by Unais
    Testimonial.count().exec(function (err, count) {
		if(err)
			res.json(500, {msg: err});
		else
		{
			res.jsonp([{
			title: 'Testimonial',
			testimonials: testimonials,
			page: page + 1,
			pages: Math.ceil(count / perPage),
			totalitem : count  
			}]);
		}
    })
  })
};

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Blog = mongoose.model('Blog');

/**
 * Find article by id
 */

exports.findall = function (req, res) {
    Blog.find().sort('-created').exec(function (err, blogs) {
        if (err) {
            /*res.render('error', {
                status: 500
            });*/			
			res.send(500); //Changed by Unais
        } else {
            res.jsonp(blogs);
        }
    });
};

exports.findone = function (req, res) {

    var blogId = req.params.blogId
    var options = {
        blogId: blogId
    }

    Blog.findone(options, function (err, blogs) {
        if (err) 
			//return res.render('500')
			return res.send(500); //Changed by Unais
        Blog.count().exec(function (err, count) {
            res.jsonp([{
                title: 'Blogs',
                blogs: blogs
            }]);
        })
    })
};

exports.index = function (req, res) {
    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 2
    var options = {
        perPage: perPage,
        page: page
    }

    Blog.list(options, function (err, blogs) {
        if (err) 
			//return res.render('500')
			return res.send(500); //Changed by Unais
        Blog.count().exec(function (err, count) {
            res.jsonp([{
                title: 'Blog',
                blogs: blogs,
                page: page + 1,
                pages: Math.ceil(count / perPage),
                totalitem: count
            }]);

        })
    })
};

exports.category = function (req, res) {
    var categoryId = req.params.catId
    var page = 1
    var perPage = 3
    var options = {
        perPage: perPage,
        page: page,
        category: categoryId
    }

    Blog.category(options, function (err, blogs) {
        if (err) 
			//return res.render('500')
			return res.send(500); //Changed by Unais
        Blog.count().exec(function (err, count) {
            res.jsonp([{
                title: 'Blog',
                blogs: blogs,
                page: page + 1,
                pages: Math.ceil(count / perPage),
                totalitem: count
            }]);

        })
    })
};

// Search blogs
exports.search = function (req, res) {
   
    var searchId = req.params.searchId;
    var page = 1
    var perPage = 2
    var options = {
        perPage: perPage,
        page: page,
        searchId: searchId
    }
    var criteria = req.params.searchId;
    criteria = '.*' + req.params.searchId + '.*';
   
    Blog.find({ $or: [{ 'content': { $regex: criteria } }, { 'title': { $regex: criteria } }] }, function (err, blogs) {
        Blog.count().exec(function (err, count) {
            res.jsonp([{
                title: 'Blog',
                blogs: blogs,
                page: page + 1,
                pages: Math.ceil((blogs.length) / perPage),
                totalitem: blogs.length
            }]);
        })
    });
};


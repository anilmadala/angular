'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Salesperson = mongoose.model('Salespersons');

/**
 * All States List
 */
exports.index = function (req, res) {

    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9
    var options = {
        perPage: perPage,
        page: page
    }

    Salesperson.list(options, function (err, salespersons) {
        if (err) 
			//return res.render('500')
			return res.send(500);//Changed by Unais
        Salesperson.count().exec(function (err, count) {
			if (err) 			
				return res.send(500);//Changed by Unais
			else
			{
				res.jsonp([{
					title: 'Salesperson',
					salespersons: salespersons,
					page: page + 1,
					pages: Math.ceil(count / perPage),
					totalitem: count
				}]);
			}
        })
    })
};

exports.status = function (req, res) {
    var statusId = req.params.statusId;
    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9
    var options = {
        perPage: perPage,
        page: page,
        status: statusId
    }

    Salesperson.status(options, function (err, data) {
        if (err) 
			//return res.render('500')
			return res.send(500);//Changed by Unais
        Salesperson.count(options.status).exec(function (err, count) {
			if (err) 			
				return res.send(500);//Changed by Unais
			else
			{
				res.jsonp([{
					title: 'Salespersons',
					salespersons: data,
					page: page + 1,
					pages: Math.ceil(count / perPage),
					totalitem: count
				}]);
			}
        })
    })
};

exports.search = function (req, res) {
    var searchId = req.params.searchId;
    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9
    var options = {
        perPage: perPage,
        page: page,
        search: searchId
    }

    Salesperson.search(options, function (err, data) {
        if (err) 
			//return res.render('500')
			return res.send(500);//Changed by Unais
        Salesperson.count(options.status).exec(function (err, count) {
			if (err) 			
				return res.send(500);//Changed by Unais
			else
			{
				res.jsonp([{
					title: 'Salespersons',
					salespersons: data,
					page: page + 1,
					pages: Math.ceil(count / perPage),
					totalitem: count
				}]);
			}
        })
    })
};

exports.createSalesperson = function(req, res) {
    var newSalesperson = new Salesperson(req.body);
   
    newSalesperson.save(function(err) {
        if(err)
            return res.json(500, err);
        else
            return res.jsonp('Successfully registered');
    });
};

exports.updateSalesperson = function(req, res) {
    var salespersonId = req.body.id;
    var options = {
        id: salespersonId,
        email: req.body.data.email,
        salesperson: req.body.data.salesperson,
        status: req.body.data.status,
        commissionpercentage: req.body.data.commissionpercentage
    };
   

    Salesperson.update({ _id: options.id }, { $set: { 'email': options.email,
                                                  'salesperson': options.salesperson,
                                                  'status': options.status,
                                                  'commissionpercentage': options.commissionpercentage
                                                } 
                                        }).exec(function (err, result) {
                                            if (err) return res.send(500);
                                            else return res.send(200);
                                        });
    };


exports.listAll = function (req, res) {
    Salesperson.find().exec(function (err, salespersonsList) {
        if(err) 
			//return res.render('500')
			return res.send(500);//Changed by Unais
        else{
            res.jsonp([{
                salespersons: salespersonsList,
                title: 'Salesperson'
            }]);
        }
    })
};

exports.combinedSearch = function(req, res) {
    var searchId = req.params.searchId;
    var statusId = req.params.statusId;
    var page = (req.param('pagenum') > 0 ? req.param('pagenum') : 1) - 1
    var perPage = 9
    var options = {
        perPage: perPage,
        page: page,
        search: searchId,
        status: statusId
    }

    Salesperson.combinesearch(options, function (err, data) {
        if (err) 
			//return res.render('500')
			return res.send(500);//Changed by Unais
        Salesperson.count(options.status).exec(function (err, count) {
			if (err) 			
				return res.send(500);//Changed by Unais
			else
			{
				res.jsonp([{
					title: 'Salespersons',
					salespersons: data,
					page: page + 1,
					pages: Math.ceil(count / perPage),
					totalitem: count
				}]);
			}
        })
    })
};
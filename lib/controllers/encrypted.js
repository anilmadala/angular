

var mongoose = require('mongoose'),
    Encrypted = mongoose.model('Encrypted');

exports.createrecord = function (req, res) {

    //var newRecord = new Encrypted(req.body);
    //newRecord.name = 'Praveen';
    //newRecord.age = '25';
    //newRecord.id = req.body.id;

   

    ////newRecord.encrypt(function (err) {
    ////    if (err) return handleError(err);

                       
    ////});

    //Encrypted.update({ age: 25 }, { name: req.body.name }, { multi: false }
    //).exec(function (err, result) {
    //    if (err) return res.send(500);
    //    if (!err) return res.send(200, 'update');
    //});
    
    ////newRecord.save(function (err) {
    ////    if (err)
    ////        return res.json(400, err);
    ////    else
    ////        return res.jsonp('New Record created.');
    ////});
    

   
};

exports.fetchrecord = function (req, res) {

    //Encrypted.find().exec(function (err, info) {
    //    if (err) return res.send(500);
    //    else {
    //        res.jsonp([
    //            {
    //                data: info
    //            }
    //        ]);
    //    }
    //}); 
};
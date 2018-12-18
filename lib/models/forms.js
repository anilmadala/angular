/**
 * Created by Mayur.Mathurkar on 3/11/14.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var formsSchema = mongoose.Schema({
    type: String,
    templatename: String,
    formname: String,
    version: Number,
    status: String,
    formtype: String,
    formdata: Object,
    reportformdata: String,
    templatedata: String,
}, { versionKey: false });

formsSchema.statics = {

    list: function (options, cb) {
        var criteria = options.criteria || {}
        this.find(criteria, { formdata: 0 })
            .populate('user', 'name username')
            .sort({ 'createdAt': -1 }) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    }
}

formsSchema.index({formtype: 1, status: 1, type: 1});

mongoose.model("FormList", formsSchema);
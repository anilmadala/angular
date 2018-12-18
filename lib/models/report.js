
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReportSchema = new Schema({
    formtype: String,
    formtitle: String,
    reportformat: String,
    formversion: Number,
    reporttype: String,
    reportversion: Number,
    reportstatus: String,
    reportdata: String,
    createddate: {
        type: Date,
        default: Date.now
    },
    createdby: String,
    modifieddate: {
        type: Date,
        default: Date.now
    },
    modifiedby: String

}, { versionKey: false });

ReportSchema.statics = {

    list: function (options, cb) {
        var criteria = options.criteria || {}
        this.find(criteria, { reportdata: 0 })
            .populate('user', 'name username')
            .sort({ 'createdAt': -1 }) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    }
}

ReportSchema.index({formtype: 1, formversion: 1, reportstatus: 1});

mongoose.model("Reports", ReportSchema);

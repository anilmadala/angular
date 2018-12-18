var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InsurenceAdminSchema = new Schema({

    insurance_administrator_id: Number,
    text: String,
    keyword: String,
    sequence: Number
}, { versionKey: false });

InsurenceAdminSchema.index({text: 1});

mongoose.model("insurance_administrator", InsurenceAdminSchema);


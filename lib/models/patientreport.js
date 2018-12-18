/**
 * Created by Mayur.Mathurkar on 3/11/14.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
	
var util = require('../encrypt-utility'); //For encryption/decryption



var patientreportSchema = mongoose.Schema({    
	patientid: String,
    injuryid: String,
    version: Number,
    status: String,
	//Added by Unais to save flavor for report
	flavor: String,
    reportpublishid: String,
    formid: String,
    formtype: String,
    modifiedby: String,
    modifieddate: Date,
    data: { type: Object, get: util.decryptobj, set: util.encryptobj },
    userlevel: String,
    createdby: String,
    createdDate: Date,
    submittedBy: String,
    submittedDate: Date,
    practicename: String,
    submittedAtLevel1: String,
    submittedDateAtLevel1: Date,
    submittedAtLevel2: String,
    submittedDateAtLevel2: Date,
    dateofinjury: Date,
    state: String,
    reratecomment: String,
    rerateflag: String,
    reportcopiedfrom: String,
    reratetype: String,
    previousclosedreport: String,
    reportcharge: String,
	rfas:Array,
	addendum:{type: Array,'default': []},
	workStatusNote: {type: Array,'default': []},
	athena_practiceid : {type : Number, default : 0},   // Athena changes
    athena_patientid : { type : Number, default: 0 },  // Athena changes
    athena_departmentid : {type : Number, default : 0} // Athena changes
});

patientreportSchema.set('toJSON', { getters: true, setters: true });
patientreportSchema.set('toObject', { getters: true, setters: true });

patientreportSchema.index({patientid: 1, injuryid: 1, status: 1});
patientreportSchema.index({injuryid: 1, patientid: 1, status: 1, submittedDate: -1});
patientreportSchema.index({formtype: 1, state: 1, status: 1, submittedDateAtLevel2: -1});
patientreportSchema.index({patientid: 1});
patientreportSchema.index({practicename: 1});
patientreportSchema.index({practicename: 1, status: 1, formtype: 1, state: 1});
patientreportSchema.index({formtype: 1, status: 1, state: 1});
patientreportSchema.index({practicename: 1, status: 1, state: 1});
patientreportSchema.index({practicename: 1, status: 1, submittedDate: 1});
patientreportSchema.index({patientid: 1, injuryid: 1, state: 1});


mongoose.model("Patientreport", patientreportSchema);
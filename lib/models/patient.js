'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    //encrypt = require('mongoose-encryption'),
    Schema = mongoose.Schema;
//var crypto = require('crypto');
var util = require('../encrypt-utility'); //For encryption/decryption

//Following line is Added by Unais to avoid mongoose warning of deprecated promise library
//mongoose.Promise = global.Promise;

//var encryptionKey = process.env.ENCRYPTED_KEY;

/*
 * setStatusCurrent : this function used to set value current if the value null.
 * currently this function used in medical history and social history to set status = current
 */
function setStatusCurrent (v) {
	   if(v==null){
	     return 'current';
	   }
	   return v;
	}


//basic child
var basicinformationschema = new Schema ( {
            firstname: { type: String, get: util.decrypt, set: util.encrypt},
            middlename: { type: String, get: util.decrypt, set: util.encrypt},
            lastname: { type: String, get: util.decrypt, set: util.encrypt},
            gender: { type: String, get: util.decrypt, set: util.encrypt},
            dateofbirth: { type: String, get: util.decrypt, set: util.encrypt},
            dateofdeath: { type: String, get: util.decrypt, set: util.encrypt},
            socialsecurityno: { type: String, get: util.decrypt, set: util.encrypt},
            employeehandedness: { type: String, get: util.decrypt, set: util.encrypt},
						medicalrecordno: { type: String, get: util.decrypt, set: util.encrypt},
            status: String,
            updateddate: Date,
            updatedby: String
        });
basicinformationschema.set('toJSON', { getters: true, setters: true});
basicinformationschema.set('toObject', { getters: true, setters: true});


//basic child
var contactSchema = new Schema ( {
			email: { type: String, get: util.decrypt, set: util.encrypt},
			homephone: { type: String, get: util.decrypt, set: util.encrypt},
			cellphone: { type: String, get: util.decrypt, set: util.encrypt},
			workphone: { type: String, get: util.decrypt, set: util.encrypt},
			extension: { type: String, get: util.decrypt, set: util.encrypt},
			phonenumberselect: { type: String, get: util.decrypt, set: util.encrypt},
			phonenumberselectsecond: { type: String, get: util.decrypt, set: util.encrypt},
			phonenumberselectthird: { type: String, get: util.decrypt, set: util.encrypt},
			voicemailthirdradio: { type: String, get: util.decrypt, set: util.encrypt},
			voicemailsecondradio: { type: String, get: util.decrypt, set: util.encrypt},
			voicemailradio: { type: String, get: util.decrypt, set: util.encrypt},
			preferredcommunication: { type: String, get: util.decrypt, set: util.encrypt},
			preferredcommunicationother: { type: String, get: util.decrypt, set: util.encrypt},
			status: String,
			updateddate: Date,
			updatedby: String
	});
contactSchema.set('toJSON', { getters: true, setters: true});
contactSchema.set('toObject', { getters: true, setters: true});


var addressSchema = new Schema (  {
            addressline1: { type: String, get: util.decrypt, set: util.encrypt},
            addressline2: { type: String, get: util.decrypt, set: util.encrypt},
            city: { type: String, get: util.decrypt, set: util.encrypt},
            state: { type: String, get: util.decrypt, set: util.encrypt},
            zipcode: { type: String, get: util.decrypt, set: util.encrypt},
            status: String,
            updateddate: Date,
            updatedby: String
        });
addressSchema.set('toJSON', { getters: true, setters: true});
addressSchema.set('toObject', { getters: true, setters: true});

var demographicsSchema = new Schema (   {
            preferredlanguage: { type: String, get: util.decrypt, set: util.encrypt},
            preferredlanguageother: { type: String, get: util.decrypt, set: util.encrypt},
            ethnicity: { type: String, get: util.decrypt, set: util.encrypt},
            ethnicityother: { type: String, get: util.decrypt, set: util.encrypt},
            race: { type: String, get: util.decrypt, set: util.encrypt},
            raceother: { type: String, get: util.decrypt, set: util.encrypt},
            status: String,
            updateddate: Date,
            updatedby: String
        });
demographicsSchema.set('toJSON', { getters: true, setters: true});
demographicsSchema.set('toObject', { getters: true, setters: true});


var occupationSchema = new Schema (  {
            currentoccupation: { type: String, get: util.decrypt, set: util.encrypt},
            currentoccupationother: { type: String, get: util.decrypt, set: util.encrypt},
            status: String,
            updateddate: Date,
            updatedby: String
        });
occupationSchema.set('toJSON', { getters: true, setters: true});
occupationSchema.set('toObject', { getters: true, setters: true});


var emergencyContactAddressSchema = new Schema (  {
                    addressline1: { type: String, get: util.decrypt, set: util.encrypt},
                    addressline2: { type: String, get: util.decrypt, set: util.encrypt},
                    city: { type: String, get: util.decrypt, set: util.encrypt},
                    state: { type: String, get: util.decrypt, set: util.encrypt},
                    zipcode: { type: String, get: util.decrypt, set: util.encrypt},
                    status: String,
                    updateddate: Date,
                    updatedby: String
                });
emergencyContactAddressSchema.set('toJSON', { getters: true, setters: true});
emergencyContactAddressSchema.set('toObject', { getters: true, setters: true});


var emergencycontactinfoSchema = new Schema (  {
            relationship: { type: String, get: util.decrypt, set: util.encrypt},
            emergencyrelationother: { type: String, get: util.decrypt, set: util.encrypt},
            firstname: { type: String, get: util.decrypt, set: util.encrypt},
            lastname: { type: String, get: util.decrypt, set: util.encrypt},
            email: { type: String, get: util.decrypt, set: util.encrypt},
            homephone: { type: String, get: util.decrypt, set: util.encrypt},
            cellphone: { type: String, get: util.decrypt, set: util.encrypt},
            workphone: { type: String, get: util.decrypt, set: util.encrypt},
            extension: { type: String, get: util.decrypt, set: util.encrypt},
            status: String,
            updateddate: Date,
            updatedby: String,
            address: [emergencyContactAddressSchema]
        });
emergencycontactinfoSchema.set('toJSON', { getters: true, setters: true});
emergencycontactinfoSchema.set('toObject', { getters: true, setters: true});
var injuryinformationSchema = new Schema (   {
							injuryinformationdetail: { type: String, get: util.decrypt, set: util.encrypt },
							dateofinjury: { type: String, get: util.decrypt, set: util.encrypt},
							dateoflastwork: { type: String, get: util.decrypt, set: util.encrypt},
							dateofpermanent: { type: String, get: util.decrypt, set: util.encrypt},
							timeofinjury: { type: String, get: util.decrypt, set: util.encrypt},
							injuryplace: { type: String, get: util.decrypt, set: util.encrypt},
							isinjurywitnes: { type: String, get: util.decrypt, set: util.encrypt},
							other_isinjurywitnes: { type: String, get: util.decrypt, set: util.encrypt},
							other_injuryplace: { type: String, get: util.decrypt, set: util.encrypt},
							firstaid: { type: String, get: util.decrypt, set: util.encrypt},
							firstaid_measure: Object,
							other_measure_text: { type: String, get: util.decrypt, set: util.encrypt},
							reportedemployer: { type: String, get: util.decrypt, set: util.encrypt},
							reportedemploye: Object,
							other_reportedemploye: [],//{ type: String, get: util.decrypt, set: util.encrypt},
							other_measure: [],
							afterworking: { type: String, get: util.decrypt, set: util.encrypt},
							other_afterworking: { type: String, get: util.decrypt, set: util.encrypt},
							additionaldetail: { type: String, get: util.decrypt, set: util.encrypt},
							status: String,
							witnes: Object,
							evaluated_prior: { type: String, get: util.decrypt, set: util.encrypt},
							timeofpriorevaluation: { type: String, get: util.decrypt, set: util.encrypt},
							dateofpriorevaluation:{ type: String, get: util.decrypt, set: util.encrypt},
							otherwitnes: { type: String, get: util.decrypt, set: util.encrypt},
							reportedemployOther: { type: String, get: util.decrypt, set: util.encrypt},
							updateddate: Date,
							updatedby: String
});
injuryinformationSchema.set('toJSON', { getters: true, setters: true});
injuryinformationSchema.set('toObject', { getters: true, setters: true});

var locationaddressinjurySchema = new Schema (  {
                        location_address1: { type: String, get: util.decrypt, set: util.encrypt},
                        location_address2: { type: String, get: util.decrypt, set: util.encrypt},
                        location_city: { type: String, get: util.decrypt, set: util.encrypt},
                        location_state: { type: String, get: util.decrypt, set: util.encrypt},
                        location_zipcode: { type: String, get: util.decrypt, set: util.encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    });
locationaddressinjurySchema.set('toJSON', { getters: true, setters: true});
locationaddressinjurySchema.set('toObject', { getters: true, setters: true});


var acceptedbodypartsinjuredbodypartSchema = new Schema ({
                            bodypart: { type: String, get: util.decrypt, set: util.encrypt},
                            bodypart_mechanism: { type: String, get: util.decrypt, set: util.encrypt},
                            bodysystem: { type: String, get: util.decrypt, set: util.encrypt},
                            otherBodysystem: { type: String, get: util.decrypt, set: util.encrypt},
                            otherBodyparts: { type: String, get: util.decrypt, set: util.encrypt},
                            bodypartsides: { type: String, get: util.decrypt, set: util.encrypt},
                            Hidebdpartsides: Boolean,
                            otherbodypart_mechanismshow: Boolean,
                            otherbodypart_mechanismshowmodel: { type: String, get: util.decrypt, set: util.encrypt},
														ratebodypart:{ type: Boolean, default:false} ,
														dateOfRating: Date,
														ratebodyYesNoRadio: { type: String, default:'No'}

                        });
acceptedbodypartsinjuredbodypartSchema.set('toJSON', { getters: true, setters: true});
acceptedbodypartsinjuredbodypartSchema.set('toObject', { getters: true, setters: true});



var injuryemployerSchema = new Schema ({
                        company: { type: String, get: util.decrypt, set: util.encrypt},
                        natureofbusiness: { type: String, get: util.decrypt, set: util.encrypt},
                        othernatureofbusiness: { type: String, get: util.decrypt, set: util.encrypt},
                        emp_telephone: { type: String, get: util.decrypt, set: util.encrypt},
                        emp_extension: { type: String, get: util.decrypt, set: util.encrypt},
												emp_fax: { type: String, get: util.decrypt, set: util.encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String,
                    });
injuryemployerSchema.set('toJSON', { getters: true, setters: true});
injuryemployerSchema.set('toObject', { getters: true, setters: true});




var injuryemploymentSchema = new Schema ( {
                        status: String,
                        updateddate: Date,
                        updatedby: String,
                        jobtitle: { type: String, get: util.decrypt, set: util.encrypt},
                        durationofemployement: { type: String, get: util.decrypt, set: util.encrypt},
                        durationtype: { type: String, get: util.decrypt, set: util.encrypt}
                    });
injuryemploymentSchema.set('toJSON', { getters: true, setters: true});
injuryemploymentSchema.set('toObject', { getters: true, setters: true});




var employeraddressSchema = new Schema ({
                        emp_address1: { type: String, get: util.decrypt, set: util.encrypt},
                        emp_address2: { type: String, get: util.decrypt, set: util.encrypt},
                        emp_city: { type: String, get: util.decrypt, set: util.encrypt},
                        emp_zipcode: { type: String, get: util.decrypt, set: util.encrypt},
                        emp_state: { type: String, get: util.decrypt, set: util.encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    });
employeraddressSchema.set('toJSON', { getters: true, setters: true});
employeraddressSchema.set('toObject', { getters: true, setters: true});



var employercontactSchema = new Schema ({
                        employercontact_firstname: { type: String, get: util.decrypt, set: util.encrypt},
                        employercontact_lastname: { type: String, get: util.decrypt, set: util.encrypt},
                        employercontact_telephoneno: { type: String, get: util.decrypt, set: util.encrypt},
                        employercontact_extension: { type: String, get: util.decrypt, set: util.encrypt},
                        employercontact_email: { type: String, get: util.decrypt, set: util.encrypt},
                        employercontact_fax: { type: String, get: util.decrypt, set: util.encrypt},
                        employercontact_address: { type: String, get: util.decrypt, set: util.encrypt},
                        employercontact_city: { type: String, get: util.decrypt, set: util.encrypt},
                        employercontact_state: { type: String, get: util.decrypt, set: util.encrypt},
                        employercontact_zipcode: { type: String, get: util.decrypt, set: util.encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    });
employercontactSchema.set('toJSON', { getters: true, setters: true});
employercontactSchema.set('toObject', { getters: true, setters: true});




var injuryinsuranceSchema = new Schema ({
                        insurance_claimsadministrator: { type: String, get: util.decrypt, set: util.encrypt},
                        insurance_claimsnumber: { type: String, get: util.decrypt, set: util.encrypt},
                        insurancezipcode: { type: String, get: util.decrypt, set: util.encrypt},
                        insurancecity: { type: String, get: util.decrypt, set: util.encrypt},
                        insurancestate: { type: String, get: util.decrypt, set: util.encrypt},
                        insuranceaddressline1: { type: String, get: util.decrypt, set: util.encrypt},
                        insuranceaddressline2: { type: String, get: util.decrypt, set: util.encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    });
injuryinsuranceSchema.set('toJSON', { getters: true, setters: true});
injuryinsuranceSchema.set('toObject', { getters: true, setters: true});


var injuryclaimsadjusterSchema = new Schema ({
                        claimsadjuster_firstname: { type: String, get: util.decrypt, set: util.encrypt},
                        claimsadjuster_lastname: { type: String, get: util.decrypt, set: util.encrypt},
                        claimsadjuster_telephoneno: { type: String, get: util.decrypt, set: util.encrypt},
                        claimsadjuster_extension: { type: String, get: util.decrypt, set: util.encrypt},
                        claimsadjuster_email: { type: String, get: util.decrypt, set: util.encrypt},
                        claimsadjuster_fax: { type: String, get: util.decrypt, set: util.encrypt},
                        claimsadjuster_address: { type: String, get: util.decrypt, set: util.encrypt},
                        claimsadjuster_city: { type: String, get: util.decrypt, set: util.encrypt},
                        claimsadjuster_state: { type: String, get: util.decrypt, set: util.encrypt},
                        claimsadjuster_zipcode: { type: String, get: util.decrypt, set: util.encrypt},
                        claimsadjuster_company: { type: String, get: util.decrypt, set: util.encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    });
injuryclaimsadjusterSchema.set('toJSON', { getters: true, setters: true});
injuryclaimsadjusterSchema.set('toObject', { getters: true, setters: true});



var injurybillreviewSchema = new Schema ({
                        billreview_firstname: { type: String, get: util.decrypt, set: util.encrypt},
                        billreview_lastname: { type: String, get: util.decrypt, set: util.encrypt},
                        billreview_telephoneno: { type: String, get: util.decrypt, set: util.encrypt},
                        billreview_extension: { type: String, get: util.decrypt, set: util.encrypt},
                        billreview_email: { type: String, get: util.decrypt, set: util.encrypt},
                        billreview_fax: { type: String, get: util.decrypt, set: util.encrypt},
                        billreview_address: { type: String, get: util.decrypt, set: util.encrypt},
                        billreview_city: { type: String, get: util.decrypt, set: util.encrypt},
                        billreview_state: { type: String, get: util.decrypt, set: util.encrypt},
                        billreview_zipcode: { type: String, get: util.decrypt, set: util.encrypt},
                        billreview_company: { type: String, get: util.decrypt, set: util.encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    });
injurybillreviewSchema.set('toJSON', { getters: true, setters: true});
injurybillreviewSchema.set('toObject', { getters: true, setters: true});



var injuryUtilizationReviewSchema = new Schema ({
                        utilizationreview_firstname: { type: String, get: util.decrypt, set: util.encrypt},
                        utilizationreview_lastname: { type: String, get: util.decrypt, set: util.encrypt},
                        utilizationreview_telephoneno: { type: String, get: util.decrypt, set: util.encrypt},
                        utilizationreview_extension: { type: String, get: util.decrypt, set: util.encrypt},
                        utilizationreview_email: { type: String, get: util.decrypt, set: util.encrypt},
                        utilizationreview_fax: { type: String, get: util.decrypt, set: util.encrypt},
                        utilizationreview_address: { type: String, get: util.decrypt, set: util.encrypt},
                        utilizationreview_city: { type: String, get: util.decrypt, set: util.encrypt},
                        utilizationreview_state: { type: String, get: util.decrypt, set: util.encrypt},
                        utilizationreview_zipcode: { type: String, get: util.decrypt, set: util.encrypt},
                        utilizationreview_company: { type: String, get: util.decrypt, set: util.encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    });
injuryUtilizationReviewSchema.set('toJSON', { getters: true, setters: true});
injuryUtilizationReviewSchema.set('toObject', { getters: true, setters: true});


var injuryapplicantattorneySchema = new Schema ( {
                        applicantattorney_firstname: { type: String, get: util.decrypt, set: util.encrypt},
                        applicantattorney_lastname: { type: String, get: util.decrypt, set: util.encrypt},
                        applicantattorney_telephoneno: { type: String, get: util.decrypt, set: util.encrypt},
                        applicantattorney_extension: { type: String, get: util.decrypt, set: util.encrypt},
                        applicantattorney_email: { type: String, get: util.decrypt, set: util.encrypt},
                        applicantattorney_fax: { type: String, get: util.decrypt, set: util.encrypt},
                        applicantattorney_address: { type: String, get: util.decrypt, set: util.encrypt},
                        applicantattorney_city: { type: String, get: util.decrypt, set: util.encrypt},
                        applicantattorney_state: { type: String, get: util.decrypt, set: util.encrypt},
                        applicantattorney_zipcode: { type: String, get: util.decrypt, set: util.encrypt},
                        applicantattorney_company: { type: String, get: util.decrypt, set: util.encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    });
injuryapplicantattorneySchema.set('toJSON', { getters: true, setters: true});
injuryapplicantattorneySchema.set('toObject', { getters: true, setters: true});



var defenseattorneySchema = new Schema (  {
                        defenseattorney_firstname: { type: String, get: util.decrypt, set: util.encrypt},
                        defenseattorney_lastname: { type: String, get: util.decrypt, set: util.encrypt},
                        defenseattorney_telephoneno: { type: String, get: util.decrypt, set: util.encrypt},
                        defenseattorney_extension: { type: String, get: util.decrypt, set: util.encrypt},
                        defenseattorney_email: { type: String, get: util.decrypt, set: util.encrypt},
                        defenseattorney_fax: { type: String, get: util.decrypt, set: util.encrypt},
                        defenseattorney_address: { type: String, get: util.decrypt, set: util.encrypt},
                        defenseattorney_city: { type: String, get: util.decrypt, set: util.encrypt},
                        defenseattorney_state: { type: String, get: util.decrypt, set: util.encrypt},
                        defenseattorney_zipcode: { type: String, get: util.decrypt, set: util.encrypt},
                        defenseattorney_company: { type: String, get: util.decrypt, set: util.encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    });
defenseattorneySchema.set('toJSON', { getters: true, setters: true});
defenseattorneySchema.set('toObject', { getters: true, setters: true});



var rncasemanagerSchema = new Schema (   {
                        rncasemanager_firstname: { type: String, get: util.decrypt, set: util.encrypt},
                        rncasemanager_lastname: { type: String, get: util.decrypt, set: util.encrypt},
                        rncasemanager_telephoneno: { type: String, get: util.decrypt, set: util.encrypt},
                        rncasemanager_extension: { type: String, get: util.decrypt, set: util.encrypt},
                        rncasemanager_email: { type: String, get: util.decrypt, set: util.encrypt},
                        rncasemanager_fax: { type: String, get: util.decrypt, set: util.encrypt},
                        rncasemanager_address: { type: String, get: util.decrypt, set: util.encrypt},
                        rncasemanager_city: { type: String, get: util.decrypt, set: util.encrypt},
                        rncasemanager_state: { type: String, get: util.decrypt, set: util.encrypt},
                        rncasemanager_zipcode: { type: String, get: util.decrypt, set: util.encrypt},
                        rncasemanager_company: { type: String, get: util.decrypt, set: util.encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    });
rncasemanagerSchema.set('toJSON', { getters: true, setters: true});
rncasemanagerSchema.set('toObject', { getters: true, setters: true});

var providerSchema = new Schema (   {
                        provider_firstname: { type: String, get: util.decrypt, set: util.encrypt},
                        provider_lastname: { type: String, get: util.decrypt, set: util.encrypt},
                        provider_telephoneno: { type: String, get: util.decrypt, set: util.encrypt},
                        provider_extension: { type: String, get: util.decrypt, set: util.encrypt},
                        provider_email: { type: String, get: util.decrypt, set: util.encrypt},
                        provider_company: { type: String, get: util.decrypt, set: util.encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    });
providerSchema.set('toJSON', { getters: true, setters: true});
providerSchema.set('toObject', { getters: true, setters: true});


var medicalhistorySchema = new Schema ({
														status:{type: String, set: setStatusCurrent},
		                       updateddate: Date,
		                       updatedby: String,
		                       shgeneralpriorhealthradio:  { type: String, get: util.decrypt, set: util.encrypt},
	                       	   shgeneralhealthcontricheck:[],
	                           shgeneralhealthontritextother:{ type: String, get: util.decrypt, set: util.encrypt},

	                           shgeneralhealthpriorsurgeryradio:  { type: String, get: util.decrypt, set: util.encrypt},
	                           shgeneralhealthpriorsugeycheck:[],
		                       shgeneralhealthpriorsurgerytextother:{ type: String, get: util.decrypt, set: util.encrypt},

		                       shcurrentmedicationradio:  { type: String, get: util.decrypt, set: util.encrypt},
		                       shcurrentmedications:[],
		                       shcurrentmedicationsothertext:{ type: String, get: util.decrypt, set: util.encrypt},

		                       shknownallergiesNonecheck:[],
		                       shknownallergiescheck:[],
		                       shknownallergiesOthercheck:[],
		                       shknownallergiesOthercheckTextarea:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shknownallergiesothertext:{ type: String, get: util.decrypt, set: util.encrypt},

		                       shpriorillnessradio:  { type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralreviewpriorcheck:[],
		                       shgeneralconstitutionalcheck:[],
		                       negativeshgeneralconstitutionalcheck:[],
		                       shgeneralreviewpriorothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneraleyescheck:[],
		                       shgeneraleyesothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralthroatcheck:[],
		                       shgeneralthroatothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralcardiovascularcheck:[],
		                       shgeneralcardiovascularothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralrespiratorycheck:[],
		                       shgeneralrespiratoryothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralgastrointestinalcheck:[],
		                       shgeneralgastrointestinalothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralgenitourinary:[],
		                       shgeneralgenitourinaryothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralmusculoskeletalcheck:[],
		                       shgeneralmusculoskeletalothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralskincheck:[],
		                       shgeneralskinothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralneurologicalcheck:[],
		                       shgeneralneurologicalothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralpsychiatric:[],
		                       shgeneralpsychiatricothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralendocrinecheck:[],
		                       shgeneralendocrineothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralhematologicalcheck:[],
		                       shgeneralhematologicalothertext:{ type: String, get: util.decrypt, set: util.encrypt},
		                       shgeneralallergiccheck:[],
		                       shgeneralallergicothertext:{ type: String, get: util.decrypt, set: util.encrypt}
                       });
medicalhistorySchema.set('toJSON', { getters: true, setters: true});
medicalhistorySchema.set('toObject', { getters: true, setters: true});




var shSchema = new Schema ({
                    	   status:{type: String, set: setStatusCurrent},
	                       updateddate: Date,
	                       updatedby: String,
  		                   SHrdoMaritalStatus:{ type: String},
  		                   SHrdoEmploymentStatus:{ type: String},
  		                   SHchkOccupationalHistory:[],
  		                   chkOccupationalHistoryOtherTextarea:{ type: String},
  		                   chkCaffeineNegative:[],
  		                   chkCaffeine:[],
  		                   txtCaffeine:{ type: String, trim: true},
  		                   chkStreetDrug:[],
  		                   txtStreetDrug:{ type: String, trim: true},
  		                   chkTobacco:[],
  		                   txtTobacco:{ type: String, trim: true},
  		                   chkAlcohol:[],
  		                   txtAlcohol:{ type: String, trim: true},
  		                   shfreedataentry:{ type: String},
  		                   SHrdoLevelOfEducation:{ type: String},
  		                   SHrdoLevelOfEducationtextA:{ type: String},
  		                   rdoSecondJobs:{ type: String},
  		                   rdoSecondJobsTextarea:{ type: String},
  		                   rdoSelfEmployment:{ type: String},
  		                   rdoSelfEmploymentTextarea:{ type: String},
  		                   rdoMilitaryService:{ type: String},
  		                   rdoMilitaryServiceTextarea:{ type: String},
  		                   chkHobbiesNone:[],
  		                   chkHobbies:[],
  		                   chkHobbiesOtherTextarea:{ type: String}
                         });
shSchema.set('toJSON', { getters: true, setters: true});
shSchema.set('toObject', { getters: true, setters: true});




/**
 * Patient Schema
 */
var patientSchema = new Schema({
    practicename: String,
	confirmed:{type: Boolean, default:true},
    createdFromLandingPage:{type: Boolean, default:false},
    recentviews: [
        {
            viewedby: String,
            vieweddate: Date
        }
    ],
    basicinformation: [basicinformationschema],
    contactinformation: [contactSchema],
    address: [addressSchema],
    demographics: [demographicsSchema],
    occupation: [occupationSchema],
    emergencycontactinfo: [emergencycontactinfoSchema],
    createddate: Date,
    createdby: String,
    updateddate: Date,
    updatedby: String,
    patientrecordno: String,
    state: String,
    injury: [
        {
            injurydata: {
						injuryinformation: [injuryinformationSchema],
                communication: {
                    patientcommunicationcomment: String,
                    admincommunicationcomment: String,
                    diagnostictesting: String,
                    othernotes: String
                },
                viewinformation: [
                    {
                        viewdate: Date,
                        viewby: String
                    }
                ],
                locationaddressinjury: [locationaddressinjurySchema],
                acceptedbodyparts: [
                    {
                        injuredbodypart: [acceptedbodypartsinjuredbodypartSchema],
                        //employeehandedness: String,
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    }
                ],

                employer: [ injuryemployerSchema],
                employment: [injuryemploymentSchema],
                employeraddress: [ employeraddressSchema],
                employercontact: [employercontactSchema],
                insurance: [injuryinsuranceSchema],
                claimsadjuster: [injuryclaimsadjusterSchema],
                billreview: [injurybillreviewSchema],
                utilizationreview: [injuryUtilizationReviewSchema],
                applicantattorney: [injuryapplicantattorneySchema],
                defenseattorney: [defenseattorneySchema],
                rncasemanager: [rncasemanagerSchema],
				provider: [providerSchema],
                injuryreportid: mongoose.Schema.Types.ObjectId,
                createddate: String,
                createdtime: String,
                createdby: String,
                updateddate: Date,
                updatedby: String,
				athena_insurancepackageid:{type : Number, default : 0},   // Athena changes
				athena_insuranceid:{type : Number, default : 0},   // Athena changes
            }
        }
    ],

    medicalhistory: [medicalhistorySchema],
    sh: [shSchema],
        athena_practiceid : {type : Number, default : 0},// Athena changes
        athena_patientid : { type : Number, default: 0 },// Athena changes
        athena_departmentid : {type : Number, default : 0}	// Athena changes
});

patientSchema.set('toJSON', { getters: true, setters: true ,virtuals: true});
patientSchema.set('toObject', { getters: true, setters: true,virtuals: true });

patientSchema.statics = {
    list: function (options, cb) {
        var criteria = options.criteria || {}
        this.find(criteria, { firstname: 1, middlename: 1, lastname: 1, dateofbirth: 1 })
            .limit(options.perPage)
            .sort({ firstname: 1 })
            .skip(options.perPage * options.page)
            .exec(cb)
    }
}

patientSchema.index({injury: {_id: 1}});
patientSchema.index({practicename: 1});
patientSchema.index({practicename: 1, state: 1, confirmed: 1});
patientSchema.index({patientrecordno: 1});
patientSchema.index({state: 1});
patientSchema.index({recentviews: {viewedby: 1}});
patientSchema.index({recentviews: {vieweddate: 1}});
patientSchema.index({basicinformation: {lastname: 1}});



mongoose.model('Patient', patientSchema);

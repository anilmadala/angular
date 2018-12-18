'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    //encrypt = require('mongoose-encryption'),
    Schema = mongoose.Schema;

var crypto = require('crypto');

var encryptionKey = process.env.ENCRYPTED_KEY;

function encrypt(text) {
  if (text === null || typeof text === 'undefined') { return text; };
  var cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
} 

function decrypt(text) {
  if (text === null || typeof text === 'undefined') {return text;};
  var decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

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

/**
 * Patient Schema
 */
var patientSchema = new Schema({
    practicename: String,
    recentviews: [
        {
            viewedby: String,
            vieweddate: Date
        }
    ],
    basicinformation: [
        {
            firstname: { type: String, get: decrypt, set: encrypt},
            middlename: { type: String, get: decrypt, set: encrypt},
            lastname: { type: String, get: decrypt, set: encrypt},
            gender: { type: String, get: decrypt, set: encrypt},
            dateofbirth: { type: String, get: decrypt, set: encrypt},
            dateofdeath: { type: String, get: decrypt, set: encrypt},
            socialsecurityno: { type: String, get: decrypt, set: encrypt},
            employeehandedness: { type: String, get: decrypt, set: encrypt},
			medicalrecordno: { type: String, get: decrypt, set: encrypt},
            status: String,
            updateddate: Date,
            updatedby: String
        }
    ],
    contactinformation: [
        {
            email: { type: String, get: decrypt, set: encrypt},
            homephone: { type: String, get: decrypt, set: encrypt},
            cellphone: { type: String, get: decrypt, set: encrypt},
            workphone: { type: String, get: decrypt, set: encrypt},
            extension: { type: String, get: decrypt, set: encrypt},
            phonenumberselect: { type: String, get: decrypt, set: encrypt},
            phonenumberselectsecond: { type: String, get: decrypt, set: encrypt},
            phonenumberselectthird: { type: String, get: decrypt, set: encrypt},
            voicemailthirdradio: { type: String, get: decrypt, set: encrypt},
            voicemailsecondradio: { type: String, get: decrypt, set: encrypt},
            voicemailradio: { type: String, get: decrypt, set: encrypt},
            preferredcommunication: { type: String, get: decrypt, set: encrypt},
            preferredcommunicationother: { type: String, get: decrypt, set: encrypt},
            status: String,
            updateddate: Date,
            updatedby: String
        }
    ],
    address: [
        {
            addressline1: { type: String, get: decrypt, set: encrypt},
            addressline2: { type: String, get: decrypt, set: encrypt},
            city: { type: String, get: decrypt, set: encrypt},
            state: { type: String, get: decrypt, set: encrypt},
            zipcode: { type: String, get: decrypt, set: encrypt},
            status: String,
            updateddate: Date,
            updatedby: String
        }
    ],
    demographics: [
        {
            preferredlanguage: { type: String, get: decrypt, set: encrypt},
            preferredlanguageother: { type: String, get: decrypt, set: encrypt},
            ethnicity: { type: String, get: decrypt, set: encrypt},
            ethnicityother: { type: String, get: decrypt, set: encrypt},
            race: { type: String, get: decrypt, set: encrypt},
            raceother: { type: String, get: decrypt, set: encrypt},
            status: String,
            updateddate: Date,
            updatedby: String
        }
    ],
    occupation: [
        {
            currentoccupation: { type: String, get: decrypt, set: encrypt},
            currentoccupationother: { type: String, get: decrypt, set: encrypt},
            status: String,
            updateddate: Date,
            updatedby: String
        }
    ],
    emergencycontactinfo: [
        {
            relationship: { type: String, get: decrypt, set: encrypt},
            emergencyrelationother: { type: String, get: decrypt, set: encrypt},
            firstname: { type: String, get: decrypt, set: encrypt},
            lastname: { type: String, get: decrypt, set: encrypt},
            email: { type: String, get: decrypt, set: encrypt},
            homephone: { type: String, get: decrypt, set: encrypt},
            cellphone: { type: String, get: decrypt, set: encrypt},
            workphone: { type: String, get: decrypt, set: encrypt},
            extension: { type: String, get: decrypt, set: encrypt},
            status: String,
            updateddate: Date,
            updatedby: String,
            address: [
                {
                    addressline1: { type: String, get: decrypt, set: encrypt},
                    addressline2: { type: String, get: decrypt, set: encrypt},
                    city: { type: String, get: decrypt, set: encrypt},
                    state: { type: String, get: decrypt, set: encrypt},
                    zipcode: { type: String, get: decrypt, set: encrypt},
                    status: String,
                    updateddate: Date,
                    updatedby: String
                }
            ]
        }
    ],
    createddate: Date,
    createdby: String,
    updateddate: Date,
    updatedby: String,
    patientrecordno: String,
    state: String,
    injury: [
        {
            injurydata: {
                injuryinformation: [
                    {
                        injuryinformationdetail: { type: String, get: decrypt, set: encrypt },
                        dateofinjury: { type: String, get: decrypt, set: encrypt},
                        dateoflastwork: { type: String, get: decrypt, set: encrypt},
                        dateofpermanent: { type: String, get: decrypt, set: encrypt},
                        timeofinjury: { type: String, get: decrypt, set: encrypt},
                        injuryplace: { type: String, get: decrypt, set: encrypt},
                        isinjurywitnes: { type: String, get: decrypt, set: encrypt},
                        other_isinjurywitnes: { type: String, get: decrypt, set: encrypt},
                        other_injuryplace: { type: String, get: decrypt, set: encrypt},
                        firstaid: { type: String, get: decrypt, set: encrypt},
                        firstaid_measure: Object,
                        other_measure_text: { type: String, get: decrypt, set: encrypt},
                        reportedemployer: { type: String, get: decrypt, set: encrypt},
                        reportedemploye: Object,
                        other_reportedemploye: { type: String, get: decrypt, set: encrypt},
                        afterworking: { type: String, get: decrypt, set: encrypt},
                        other_afterworking: { type: String, get: decrypt, set: encrypt},
                        additionaldetail: { type: String, get: decrypt, set: encrypt},
                        status: String,
                        witnes: Object,
                        evaluated_prior: { type: String, get: decrypt, set: encrypt},
                        timeofpriorevaluation: { type: String, get: decrypt, set: encrypt},
                        dateofpriorevaluation:{ type: String, get: decrypt, set: encrypt},
                        otherwitnes: { type: String, get: decrypt, set: encrypt},
                        reportedemployOther: { type: String, get: decrypt, set: encrypt},
                        updateddate: Date,
                        updatedby: String
                    }
                ],
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
                locationaddressinjury: [
                    {
                        location_address1: { type: String, get: decrypt, set: encrypt},
                        location_address2: { type: String, get: decrypt, set: encrypt},
                        location_city: { type: String, get: decrypt, set: encrypt},
                        location_state: { type: String, get: decrypt, set: encrypt},
                        location_zipcode: { type: String, get: decrypt, set: encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    }
                ],
                acceptedbodyparts: [
                    {
                        injuredbodypart: [{
                            bodypart: { type: String, get: decrypt, set: encrypt},
                            bodypart_mechanism: { type: String, get: decrypt, set: encrypt},
                            bodysystem: { type: String, get: decrypt, set: encrypt},
                            otherBodysystem: { type: String, get: decrypt, set: encrypt},
                            otherBodyparts: { type: String, get: decrypt, set: encrypt}, 
                            bodypartsides: { type: String, get: decrypt, set: encrypt},
                            Hidebdpartsides: Boolean,
                            otherbodypart_mechanismshow: Boolean,
                            otherbodypart_mechanismshowmodel: { type: String, get: decrypt, set: encrypt},
							ratebodypart:{ type: Boolean, default:false} ,
							dateOfRating: Date,
							ratebodyYesNoRadio: { type: String, default:'No'}                          
                        }],
                        //employeehandedness: String,
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    }
                ],
                
                employer: [
                    {
                        company: { type: String, get: decrypt, set: encrypt},
                        natureofbusiness: { type: String, get: decrypt, set: encrypt},
                        othernatureofbusiness: { type: String, get: decrypt, set: encrypt},
                        emp_telephone: { type: String, get: decrypt, set: encrypt},
                        emp_extension: { type: String, get: decrypt, set: encrypt},
						emp_fax: { type: String, get: decrypt, set: encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String,
                    }
                ],
                employment: [
                    {
                        status: String,
                        updateddate: Date,
                        updatedby: String,
                        jobtitle: { type: String, get: decrypt, set: encrypt},
                        durationofemployement: { type: String, get: decrypt, set: encrypt},
                        durationtype: { type: String, get: decrypt, set: encrypt}                        
                    }
                ],
                employeraddress: [
                    {
                        emp_address1: { type: String, get: decrypt, set: encrypt},
                        emp_address2: { type: String, get: decrypt, set: encrypt},
                        emp_city: { type: String, get: decrypt, set: encrypt},
                        emp_zipcode: { type: String, get: decrypt, set: encrypt},
                        emp_state: { type: String, get: decrypt, set: encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    }
                ],
                employercontact: [
                    {
                        employercontact_firstname: { type: String, get: decrypt, set: encrypt},
                        employercontact_lastname: { type: String, get: decrypt, set: encrypt},
                        employercontact_telephoneno: { type: String, get: decrypt, set: encrypt},
                        employercontact_extension: { type: String, get: decrypt, set: encrypt},
                        employercontact_email: { type: String, get: decrypt, set: encrypt},
                        employercontact_fax: { type: String, get: decrypt, set: encrypt},
                        employercontact_address: { type: String, get: decrypt, set: encrypt},
                        employercontact_city: { type: String, get: decrypt, set: encrypt},
                        employercontact_state: { type: String, get: decrypt, set: encrypt},
                        employercontact_zipcode: { type: String, get: decrypt, set: encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    }
                ],
                insurance: [
                    {
                        insurance_claimsadministrator: { type: String, get: decrypt, set: encrypt},
                        insurance_claimsnumber: { type: String, get: decrypt, set: encrypt},
                        insurancezipcode: { type: String, get: decrypt, set: encrypt},
                        insurancecity: { type: String, get: decrypt, set: encrypt},
                        insurancestate: { type: String, get: decrypt, set: encrypt},
                        insuranceaddressline1: { type: String, get: decrypt, set: encrypt},
                        insuranceaddressline2: { type: String, get: decrypt, set: encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    }
                ],
                claimsadjuster: [
                    {
                        claimsadjuster_firstname: { type: String, get: decrypt, set: encrypt},
                        claimsadjuster_lastname: { type: String, get: decrypt, set: encrypt},
                        claimsadjuster_telephoneno: { type: String, get: decrypt, set: encrypt},
                        claimsadjuster_extension: { type: String, get: decrypt, set: encrypt},
                        claimsadjuster_email: { type: String, get: decrypt, set: encrypt},
                        claimsadjuster_fax: { type: String, get: decrypt, set: encrypt},
                        claimsadjuster_address: { type: String, get: decrypt, set: encrypt},
                        claimsadjuster_city: { type: String, get: decrypt, set: encrypt},
                        claimsadjuster_state: { type: String, get: decrypt, set: encrypt},
                        claimsadjuster_zipcode: { type: String, get: decrypt, set: encrypt},
                        claimsadjuster_company: { type: String, get: decrypt, set: encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    }
                ],
                billreview: [
                    {
                        billreview_firstname: { type: String, get: decrypt, set: encrypt},
                        billreview_lastname: { type: String, get: decrypt, set: encrypt},
                        billreview_telephoneno: { type: String, get: decrypt, set: encrypt},
                        billreview_extension: { type: String, get: decrypt, set: encrypt},
                        billreview_email: { type: String, get: decrypt, set: encrypt},
                        billreview_fax: { type: String, get: decrypt, set: encrypt},
                        billreview_address: { type: String, get: decrypt, set: encrypt},
                        billreview_city: { type: String, get: decrypt, set: encrypt},
                        billreview_state: { type: String, get: decrypt, set: encrypt},
                        billreview_zipcode: { type: String, get: decrypt, set: encrypt},
                        billreview_company: { type: String, get: decrypt, set: encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    }
                ],
                utilizationreview: [
                    {
                        utilizationreview_firstname: { type: String, get: decrypt, set: encrypt},
                        utilizationreview_lastname: { type: String, get: decrypt, set: encrypt},
                        utilizationreview_telephoneno: { type: String, get: decrypt, set: encrypt},
                        utilizationreview_extension: { type: String, get: decrypt, set: encrypt},
                        utilizationreview_email: { type: String, get: decrypt, set: encrypt},
                        utilizationreview_fax: { type: String, get: decrypt, set: encrypt},
                        utilizationreview_address: { type: String, get: decrypt, set: encrypt},
                        utilizationreview_city: { type: String, get: decrypt, set: encrypt},
                        utilizationreview_state: { type: String, get: decrypt, set: encrypt},
                        utilizationreview_zipcode: { type: String, get: decrypt, set: encrypt},
                        utilizationreview_company: { type: String, get: decrypt, set: encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    }
                ],
                applicantattorney: [
                    {
                        applicantattorney_firstname: { type: String, get: decrypt, set: encrypt},
                        applicantattorney_lastname: { type: String, get: decrypt, set: encrypt},
                        applicantattorney_telephoneno: { type: String, get: decrypt, set: encrypt},
                        applicantattorney_extension: { type: String, get: decrypt, set: encrypt},
                        applicantattorney_email: { type: String, get: decrypt, set: encrypt},
                        applicantattorney_fax: { type: String, get: decrypt, set: encrypt},
                        applicantattorney_address: { type: String, get: decrypt, set: encrypt},
                        applicantattorney_city: { type: String, get: decrypt, set: encrypt},
                        applicantattorney_state: { type: String, get: decrypt, set: encrypt},
                        applicantattorney_zipcode: { type: String, get: decrypt, set: encrypt},
                        applicantattorney_company: { type: String, get: decrypt, set: encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    }
                ],
                defenseattorney: [
                    {
                        defenseattorney_firstname: { type: String, get: decrypt, set: encrypt},
                        defenseattorney_lastname: { type: String, get: decrypt, set: encrypt},
                        defenseattorney_telephoneno: { type: String, get: decrypt, set: encrypt},
                        defenseattorney_extension: { type: String, get: decrypt, set: encrypt},
                        defenseattorney_email: { type: String, get: decrypt, set: encrypt},
                        defenseattorney_fax: { type: String, get: decrypt, set: encrypt},
                        defenseattorney_address: { type: String, get: decrypt, set: encrypt},
                        defenseattorney_city: { type: String, get: decrypt, set: encrypt},
                        defenseattorney_state: { type: String, get: decrypt, set: encrypt},
                        defenseattorney_zipcode: { type: String, get: decrypt, set: encrypt},
                        defenseattorney_company: { type: String, get: decrypt, set: encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    }
                ],
                rncasemanager: [
                    {
                        rncasemanager_firstname: { type: String, get: decrypt, set: encrypt},
                        rncasemanager_lastname: { type: String, get: decrypt, set: encrypt},
                        rncasemanager_telephoneno: { type: String, get: decrypt, set: encrypt},
                        rncasemanager_extension: { type: String, get: decrypt, set: encrypt},
                        rncasemanager_email: { type: String, get: decrypt, set: encrypt},
                        rncasemanager_fax: { type: String, get: decrypt, set: encrypt},
                        rncasemanager_address: { type: String, get: decrypt, set: encrypt},
                        rncasemanager_city: { type: String, get: decrypt, set: encrypt},
                        rncasemanager_state: { type: String, get: decrypt, set: encrypt},
                        rncasemanager_zipcode: { type: String, get: decrypt, set: encrypt},
                        rncasemanager_company: { type: String, get: decrypt, set: encrypt},
                        status: String,
                        updateddate: Date,
                        updatedby: String
                    }
                ],
                injuryreportid: mongoose.Schema.Types.ObjectId,
                createddate: String,
                createdtime: String,
                createdby: String,
                updateddate: Date,
                updatedby: String
            }
        }
    ],
	
    medicalhistory: [
                       {
							   status:{type: String, set: setStatusCurrent},
		                       updateddate: Date,
		                       updatedby: String,	                           
		                       shgeneralpriorhealthradio:  { type: String, get: decrypt, set: encrypt},
	                       	   shgeneralhealthcontricheck:[],
	                           shgeneralhealthontritextother:{ type: String, get: decrypt, set: encrypt},	   
	                           	                           
	                           shgeneralhealthpriorsurgeryradio:  { type: String, get: decrypt, set: encrypt},
	                           shgeneralhealthpriorsugeycheck:[],
		                       shgeneralhealthpriorsurgerytextother:{ type: String, get: decrypt, set: encrypt},
		                      		                       
		                       shcurrentmedicationradio:  { type: String, get: decrypt, set: encrypt},
		                       shcurrentmedications:[],
		                       shcurrentmedicationsothertext:{ type: String, get: decrypt, set: encrypt},	
		                        		                       
		                       shknownallergiesNonecheck:[],
		                       shknownallergiescheck:[],		                       
		                       shknownallergiesOthercheck:[],
		                       shknownallergiesOthercheckTextarea:{ type: String, get: decrypt, set: encrypt},
		                       shknownallergiesothertext:{ type: String, get: decrypt, set: encrypt},		       
		                       
		                       shpriorillnessradio:  { type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralreviewpriorcheck:[],		                       		                       
		                       shgeneralconstitutionalcheck:[],		                       		                       
		                       negativeshgeneralconstitutionalcheck:[],		                       
		                       shgeneralreviewpriorothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneraleyescheck:[],
		                       shgeneraleyesothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralthroatcheck:[],
		                       shgeneralthroatothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralcardiovascularcheck:[],
		                       shgeneralcardiovascularothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralrespiratorycheck:[],
		                       shgeneralrespiratoryothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralgastrointestinalcheck:[],
		                       shgeneralgastrointestinalothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralgenitourinary:[],
		                       shgeneralgenitourinaryothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralmusculoskeletalcheck:[],
		                       shgeneralmusculoskeletalothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralskincheck:[],
		                       shgeneralskinothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralneurologicalcheck:[],
		                       shgeneralneurologicalothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralpsychiatric:[],
		                       shgeneralpsychiatricothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralendocrinecheck:[],
		                       shgeneralendocrineothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralhematologicalcheck:[],
		                       shgeneralhematologicalothertext:{ type: String, get: decrypt, set: encrypt},		                       
		                       shgeneralallergiccheck:[],
		                       shgeneralallergicothertext:{ type: String, get: decrypt, set: encrypt}
                       }
                    ],
            sh: [
                         {
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
                         }
            ]
});

patientSchema.index({ 'practicename': 1, 'state': -1 });
patientSchema.set('autoIndex', false);

patientSchema.set('toJSON', { getters: true, setters: true });
patientSchema.set('toObject', { getters: true, setters: true });

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



mongoose.model('Patient', patientSchema);

'use strict';

var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;   

var validatePresenceOf = function (value) {
    return value && value.length;
};

/**
 * User Schema
 */
var practiceSchema = new Schema({
    cimprofileid: String,
    merchantid: String,
    paymentprofileid: String,
    billingaddress: { billingaddres: String, billingemail: String, city: String, state: String, county: String, zipcode: String, phonenumber: String, customerAddressId: String,  billingextension: String },
	rfadetails: {firstname: String, lastname: String, email: String},
	irsnumber: String,
    county: String,
    salesperson: String,
    other_salesperson: String,
    practiceaddress: [{ street: String, county: String, city: String, state: String, zipcode: String, country: String, location: String, phonenumber: String, extension: String, faxnumber: String  }],
    //phonenumber: String,
    practicename: { type: String, required: true, unique: true}, // removed index (index: true) 
    status: { type: String, default: 'registered' },
    createdon: { type: Date, default: Date.now },
    usercount: { type: Number, default: 1 },
    letterhead: String,
    editionama: String,
    provider: String,
    pid: String,
    billingcalculatoromfs: String,
    stampapproval: { type: String, default: 'publish' },
    dfrfreereport: String,
    pr2freereport: String,
    pr4freereport: String,
    dfrcharge: String,
    pr2charge: String,
    pr4charge: String,
    pricingtype: String,
    reportpricing: { type: Object },
	userphonenumber: { type: String,default:""  },
    userextension: { type: String,default: ""  },
	faxnumber: { type: String,default: ""  },
	practicename2: { type: String,default:""  },
	enable_kickstart: { type: Boolean, default: false  },
	kickstart_url: { type: String,default: ""  },	
	enable_docx_header: { type: Boolean, default: true  },
    enable_docx_footer: { type: Boolean, default: true  },
	enable_report_docx_header_dfr: { type: Boolean, default: true  },
	enable_report_docx_header_pr2: { type: Boolean, default: true  },
	enable_report_docx_header_pr4: { type: Boolean, default: true  },
	enable_report_docx_footer_dfr: { type: Boolean, default: true  },
    enable_report_docx_footer_pr2: { type: Boolean, default: true  },
	enable_report_docx_footer_pr4: { type: Boolean, default: true  },
	enable_ws_docx_header_dfr: { type: Boolean, default: true  },
	enable_ws_docx_header_pr2: { type: Boolean, default: true  },
	enable_ws_docx_header_pr4: { type: Boolean, default: true  },
	enable_ws_docx_footer_dfr: { type: Boolean, default: true  },
    enable_ws_docx_footer_pr2: { type: Boolean, default: true  },
	enable_ws_docx_footer_pr4: { type: Boolean, default: true  },
	session_timeout: {
        nonadmin_level1: { type: Number, default: 1800 },
        nonadmin_level2: { type: Number, default: 1800 },
        nonadmin_level3: { type: Number, default: 1800 },
        nonadmin_level4: { type: Number, default: 1800 },
        admin_level1: { type: Number, default: 1200 },
        admin_level2: { type: Number, default: 1200 },
        admin_level3: { type: Number, default: 1200 },
        admin_level4: { type: Number, default: 1200 },
        superadmin: { type: Number, default: 900 },
        siteadmin: { type: Number, default: 900 },
        rater1: { type: Number, default: 900 },
        rater2: { type: Number, default: 900 },
        enable: { type: Boolean, default: true } //to enable disable session time out default enabled.
    },
    logout_warning_seconds: { type: Number, default: 10 },
	
    //kickstart_page:{title:String,sub_title:String,footer:String,successpage:{title:String,message:String}},
	kickstart_page:{
		title:{ type: String,default:""  },
		sub_title:{ type: String,default:""  },
		footer:{ type: String,default:""  },
		successpage:{
				title:{ type: String,default:""  },
				message:{ type: String,default:""  }
		},
		email_content:{ email_subject:{type: String,default:"Your work injury information has been received!" }, email_body:{type: String,default:"<p>Hi,</p><p>Your information has successfully been submitted. You will be contacted within three business days. If you have a question, please call 707.483.4346 or email jamd@rate-fast.com</p><p>The RateFast Team</p>" } },
		email_recipient:{ type: String,default:"" }
	},
	report_autosave : {type: Boolean, default : true},
	athena_practiceid : {type : Number, default : 0},    // Athena changes
    athena_practicename : {type : String, default : ""}, // Athena changes
    isAthena : {type: Boolean, default: false}    // Athena changes
});


// For validations of Practice (Uniqueness & all)

practiceSchema.plugin(uniqueValidator, { message: 'Value is not unique.' });
/**
 * Pre-save hook
 */
practiceSchema
  .pre('save', function (next) {
      if (!validatePresenceOf(this.practicename))
          next(new Error('Already Exist'));
      else
          next();
  });

practiceSchema
.virtual('creditcardname')
    .set(function (creditcardname) {
        this._creditcardname = creditcardname;
    })
    .get(function () {
        return this._creditcardname;
    });

practiceSchema
    .virtual('creditcardnumber')
    .set(function (creditcardnumber) {
        this._creditcardnumber = creditcardnumber;
    })
    .get(function () {
        return this._creditcardnumber;
    });

practiceSchema
    .virtual('month')
    .set(function (month) {
        this._month = month;
    })
    .get(function () {
        return this._month;
    });

practiceSchema
    .virtual('year')
    .set(function (year) {
        this._year = year;
    })
    .get(function () {
        return this._year;
    });

practiceSchema
    .virtual('')
    .set(function (expirationDate) {
        this._expirationDate = expirationDate;
    })
    .get(function () {
        return this._expirationDate;
    });
/*
practiceSchema
    .virtual('')
    .set(function(cardCode) {
        this._cardCode = cardCode;
    })
    .get(function() {
        return this._cardCode;
    });
*/

/**
 * Methods
 */
/**
  * isUnique - check if the practice is already in database
  *
  * @param {String} practiceName
  * @return {Boolean}
  * @api public
  */
practiceSchema.methods.isExist = function (cb) {
    this.model('Practice').count({ practicename: this.practicename })
      .exec(cb)
}


practiceSchema.statics = {
    uniquelicense: function (options, cb) {
        this.find({ ulicense: options.ulicense })
          .exec(cb)
    },
    uniquename: function (options, cb) {
        this.find({ practicename: { $regex: new RegExp('^' + options.pname.toLowerCase(), 'i') } })
          .exec(cb)
    },
    findById: function (options, cb) {
        this.find({ _id: options.practiceId })
          .exec(cb)
    },
    list: function (options, cb) {
        var criteria = options.criteria || {}
        this.find(criteria)
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    },
    status: function (options, cb) {
        var criteria = options.status || {}
        this.find(criteria)
          .sort({ 'practicename': 1 }) // sort by date
          .limit(options.perPage)
          .skip(options.perPage * options.page)
          .exec(cb)
    },
    search: function (options, cb) {
        var re = new RegExp(options.searchId, 'i');
       
        //this.find( { $or: [ { 'content' : { $regex :  criteria , $options : 'i' }} , { 'title' : { $regex : criteria , $options : 'i' }} ]} )
        this.find({ 'practicename': { $regex: re, $options: 'i' } })
            .sort({ 'practicename': 1 }) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    }
};

practiceSchema.index({practicename: 1});
practiceSchema.index({kickstart_url: 1, enable_kickstart: 1});

mongoose.model('Practice', practiceSchema);
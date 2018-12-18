'use strict';

var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var authTypes = ['github', 'twitter', 'facebook', 'google'],
    SALT_WORK_FACTOR = 10;
	
var encryptionKey = process.env.ENCRYPTED_KEY;		

/**
 * User Schema
 */
var UserSchema = new Schema({
    accounttype: String,
    otheraccounttype: String,
    firstname: String,
    lastname: String,
    username: { type: String, required: true, unique: true, lowercase: true }, //index: true
    profession: [{}],
    email: { type: String, unique: true, lowercase: true },
    speciality: [{ name: String, boardcertified: Boolean }],
    question: String,
    answer: String,
    hashedPassword: String,
    salt: String,
    resetpwddateExpire: { type: Date, default: Date.now },
    isresetpwdExpire: { type: Boolean, default: false },
    practice: [{ p_id: String, name: String, role: String, status: String, rolename: String, level: String, stampapproval: String, createddate: { type: Date, default: Date.now },athena_practiceid: {type : Number, default : 0}, athena_practicename : {type : String, default : ""}, athena_username : {type : String, default : ""}}], // Athena changes 
    otherprofessiontext: String,
    licensenumber: String,
    pid: String,
    personalsignature: String,
    lastlogin:  { type: Date,default: Date.now},
	loginattempts:{ type: Number,min: 0,default: 0  },
	usernpinumber : {type: String, default:"" },
	userphonenumber: { type: String,default:""  },
    userextension: { type: String,default: ""  },
	enableAutoLogout: { type: Boolean, default: true },
	enableOauth: { type: Boolean, default: false },
	oldpasswords:[],
	passwordchangedate:{ type: Date,default: Date.now},
	passwordEmailAlert: {day60Sent: {type: Boolean,default:false},day83Sent :{type: Boolean,default:false},expiredSent: {type: Boolean,default:false}},
	athena_departmentid : {type : Number, default : 0},    // Athena changes
    hashedString: String    // Athena changes
});


/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function (password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashedPassword = this.encryptPassword(password);	  
	  this.hashedString = this.encrypt(password); // Athena changes
	  //this.hashedPassword = this.encrypt(password);
  })
  .get(function () {
      return this._password;
  });

// Basic info to identify the current authenticated user in the app
//Mayur
UserSchema
    .virtual('practicename')
    .set(function (practicename) {
        this._practice = practicename;
    })
    .get(function () {
        return this._practice;
    });

//Mayur
UserSchema
  .virtual('userInfo')
  .get(function () {
      return {
          'id': this._id,
          'name': this.name,
          'role': this.getrole(this.practicename),
          'practicename': this.practicename,
          'username': this.username,
          'rolename': this.getrolename(this.practicename),
          'level': this.getlevel(this.practicename, this.username),
		  'enableAutoLogout': this.enableAutoLogout,
		  'enableOauth': this.enableOauth, 
          'pid': this.pid,
          'firstname': this.firstname,
          'lastname': this.lastname,
          'isresetPwdexpired': this.isresetpwdExpire,
		  'passwordchangedate':this.passwordchangedate,
		  'passwordEmailAlert':this.passwordEmailAlert,
		  'profession': this.profession,
		  'otherprofessiontext': this.otherprofessiontext,
		  'athena_departmentid':this.athena_departmentid        // Athena changes
      };
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
      return {
          'name': this.name,
          'role': this.role
      };
  });



/**
 * Validations
 */
var validatePresenceOf = function (value) {
    return value && value.length;
};

// Validate empty email
UserSchema
  .path('email')
  .validate(function (email) {
      // if you are authenticating by any of the oauth strategies, don't validate
      if (authTypes.indexOf(this.provider) !== -1) return true;
      return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
      // if you are authenticating by any of the oauth strategies, don't validate
      if (authTypes.indexOf(this.provider) !== -1) return true;
      return hashedPassword.length;
  }, 'Password cannot be blank');

/**
 * Plugins
 */
UserSchema.plugin(uniqueValidator, { message: 'Value is not unique.' });

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
      if (!this.isNew) return next();

      if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
          next(new Error('Invalid password'));
      else
          next();
  });

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },


    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },    
	 encrypt: function (text) {		
		
		if (text === null || typeof text === 'undefined') { return text; };
		var cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
		var crypted = cipher.update(text,'utf8','hex');
		crypted += cipher.final('hex');
		
		return crypted;
	}, 

	decrypt :function(text) {		
		if (text === null || typeof text === 'undefined') {return text;};
		var decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
		var dec = decipher.update(text,'hex','utf8');
		dec += decipher.final('utf8');
		
		return dec;
	},
	/**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function (password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
		
		/*crypto.pbkdf2(password,salt, 10000, 64, 'sha256', (err, derivedKey) => {
			if (err) throw err;
			return derivedKey.toString('base64');  
		});*/
    },
    //Mayur
    getrole: function (practicename) {
        for (var i = 0; i < this.practice.length; ++i) {
            var person_i = this.practice[i];
            if (person_i["name"] == practicename && person_i["status"] == "active") {
                return person_i["role"];
            }
        }
    },

    getrolename: function (practicename) {

        for (var i = 0; i < this.practice.length; ++i) {
            var person_i = this.practice[i];

            if (person_i["name"] == practicename && person_i["status"] == "active") {

                if (person_i["rolename"])
                    return person_i["rolename"];
                else
                    return '';
            }
        }
    },
    getlevel: function (practicename, username) {

        for (var i = 0; i < this.practice.length; ++i) {
            var person_i = this.practice[i];

            if (person_i["name"] == practicename && person_i["status"] == "active") {

                return person_i["level"];

            }
        }
    },

    validProfileInfo: function (password, cb) {
        this.model('User').findOne({ username: this.username, email: this.email },
          function (err, user) {
              if (err) return cb(null, false);
              if (!user) return cb(null, false);
              if (!user.authenticate(password)) return cb(null, false);
              return cb(null, user);
          }
        );
    },

    validPassword: function (password, cb) {

        this.model('User').findOne({ email: this.email },
          function (err, user) {

              if (err) return cb(null, false);
              if (!user) return cb(null, false);
              if (!user.authenticate(password)) {
                  
                  return cb(null, false)
              };
              return cb(null, user);
          }
        );
    },

    isPresent: function (cb) {
        this.model('User').count({ username: this.username })
          .exec(cb)
    }
};

UserSchema.statics = {
    uniqueemail: function (options, cb) {
        this.find({ email: options.uemail })
          .exec(cb)
    },
    uniquename: function (options, cb) {
        this.find({ username: options.uname.toLowerCase() })
          .exec(cb)
    },
    list: function (query, select, options, cb) {
        this.find(query, select)
            .sort({ name: 1 }) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    },
    search: function (query, select, options, cb) {
        this.find(query, select, { $or: [{ 'username': { $regex: options.search, $options: '$i' } }, { 'email': { $regex: options.search, $options: '$i' } }] })
          .sort({ username: 1 })
          .limit(options.perPage)
          .skip(options.perPage * options.page)
          .exec(cb)
    },

    getNextSequence: function (name) {
        var ret = db.counters.findAndModify({
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
        });
        return ret.seq;
    }
};

UserSchema.index({email: 1});
UserSchema.index({username: 1});
UserSchema.index({practice: {name: 1}, practice: {status: 1}, practice: {level: 1}});
UserSchema.index({practice: {rolename: 1}});
UserSchema.index({practice: {name: 1}, practice: {status: 1}, practice: {level: 1}, firstname: 1});

mongoose.model('User', UserSchema);
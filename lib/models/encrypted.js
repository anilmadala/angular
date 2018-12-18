'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    encrypt = require('mongoose-encryption'),
    Schema = mongoose.Schema;


var encryptedSchema = new mongoose.Schema({
    name: String,
    age: Number
    // whatever else
});

// Add any other plugins or middleware here. For example, middleware for hashing passwords
var encryptionKey = process.env.ENCRYPTED_KEY;

encryptedSchema.plugin(encrypt, { key: encryptionKey, exclude: ['age'] });
// This adds a _ct field to the schema, as well as pre 'init' and pre 'save' middleware,
// and encrypt and decrypt instance methods

mongoose.model('Encrypted', encryptedSchema);
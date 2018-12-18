var crypto = require('crypto');

var encryptionKey = process.env.ENCRYPTED_KEY;

exports.encrypt = function (text) {
	try
	{
		if (text === null || typeof text === 'undefined') { return text; };
		var cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
		var crypted = cipher.update(text,'utf8','hex');
		crypted += cipher.final('hex');
	}
	catch(err)
	{
		
		//return text;
	}
	return crypted;
} 

exports.decrypt = function (text) {
	try
	{

		if (text === null || typeof text === 'undefined') {return text;};
		var decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
		var dec = decipher.update(text,'hex','utf8');
		dec += decipher.final('utf8');
	}	
	catch(err)
	{
		
		//return text;
	}	
	return dec;
}


exports.encryptobj = function (obj) {
    
    //Loop all the properties and encrypt the data
    if (obj != null && obj['bginfo'] != 'undefined' && obj['selectinjuries'] != 'undefined') {

        var includeobj = ['bginfo', 'selectinjuries'];

        for (var sectionName in includeobj) {

            var o = obj[includeobj[sectionName]];

            for (var prop in o) {
                var value = o[prop];

                if (typeof value === 'object' || prop == '_id' || prop == 'id' || prop == 'status' || prop == 'updatedby' || prop == 'updateddate') {
                   
                }
                else {
					try
					{
						if(value!=true)
							o[prop] = encrypt(value);	
						//else
							//o[prop] = encrypt(value.toString());
					}
					catch(e)
					{
						
					}                    
                }
            }
           
        }
    }
    return obj;
}

exports.decryptobj = function (obj) {
    
    //Loop all the properties and decrypt the data

    if (obj != null && obj['bginfo'] != 'undefined' && obj['selectinjuries'] != 'undefined') {

        var includeobj = ['bginfo', 'selectinjuries'];

        for (var sectionName in includeobj) {

            var o = obj[includeobj[sectionName]];

            for (var prop in o) {
                var value = o[prop];
                if (typeof value === 'object' || prop == '_id' || prop == 'id' || prop == 'status' || prop == 'updatedby' || prop == 'updateddate') {

                }
                else {
                    var decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
                    try {
                        var dec = decipher.update(value, 'hex', 'utf8');
                        dec += decipher.final('utf8');
                        o[prop] = dec;
                    } catch (ex) { }
                }
            }
        }
    }

    return obj;
}
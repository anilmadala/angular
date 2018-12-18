// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: 'your-secret-clientID-here', // your App ID
		'clientSecret' 	: 'your-client-secret-here', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '1032869843153-jqv78lf9iq53pglulvbb7ra28taqs14m.apps.googleusercontent.com',
		'clientSecret' 	: 'd5Yn68MAitWyf7VRXzvQjycb',
		'callbackURL' 	: 'http://localhost:9000/auth/google/callback'
	}

};
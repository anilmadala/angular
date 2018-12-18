var athenahealthapi = require('./athenahealthapi')
var events = require('events')


module.exports.key = 'rs97qxku39p85qkny77y56hf'
module.exports.secret = 'xv9J9WPDw74nU8E'
module.exports.version = 'preview1'
module.exports.practiceid = 195900

module.exports.api = new athenahealthapi.Connection(module.exports.version, module.exports.key, module.exports.secret, module.exports.practiceid)
//api.status.on('ready', main)
module.exports.api.status.on('error', function(error) {
	console.log(error)
})

// If you want to change which practice you're working with after initialization, this is how.
module.exports.api.practiceid = 195900

// Before we start, here's a useful function
module.exports.path_join = function() {
	// trim slashes from arguments, prefix a slash to the beginning of each, re-join (ignores empty parameters)
	var args = Array.prototype.slice.call(arguments, 0)
	var nonempty = args.filter(function(arg, idx, arr) {
		return typeof(arg) != 'undefined'
	})
	var trimmed = nonempty.map(function(arg, idx, arr) {
		return '/' + String(arg).replace(new RegExp('^/+|/+$'), '')
	})
	return trimmed.join('')
}

module.exports.log_error =function(error) {
	console.log(error)
	console.log(error.cause)
}
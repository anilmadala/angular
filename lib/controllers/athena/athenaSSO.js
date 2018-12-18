
var filesystem=require('fs'); //Used for logging purpose


exports.displayAthenaError = function(req,res){	

	res.send(req.body);
}

exports.getAthenaToken = function(req,res){	
	
	//Unais' comment: Redirect to SSO result page with the token id and agent id received
	res.redirect('/athena-sso-result?token=' + req.body.tokenid + '&agent=' + req.body.agentid);
}

exports.getAthenaUserDetais = function(req,res){					
	var tokenid='';		
	tokenid=req.query.token;	
	
	var request = require('request'),
		username = 'c64aa748-a334-4c32-9259-16f61f4dff10', //process.env.PINGONE_CLIENTID,
		password = 'Ratefast@1989', //process.env.PINGONE_SECRET, 
		url = "https://sso.connect.pingidentity.com/sso/TXS/2.0/1/" + tokenid,
		auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
	
	request(
		{
			url : url,
			headers : {
				"Authorization" : auth
			}
		},
		function (error, response, body) {			
			res.jsonp({userDetails: response.body});					
		}
	);						
}
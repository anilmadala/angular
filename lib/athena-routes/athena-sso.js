var athenaSSO =  require('../controllers/athena/athenaSSO');

module.exports = function (app) {
	
	app.post('/sso/pages/error', athenaSSO.displayAthenaError);
	app.post('/athena-sso', athenaSSO.getAthenaToken); 		
	app.get('/athena-user-details', athenaSSO.getAthenaUserDetais);	
}
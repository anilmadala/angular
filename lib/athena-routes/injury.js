
var athenaInjury =  require('../controllers/athena/athenaInjury');

module.exports = function (app) {	
	
	//Injury APIs	
	app.get('/api/athena/getinjurydetails', athenaInjury.getInjuryDetails);
	app.get('/api/athena/ratefast/checkInjury', athenaInjury.getInjuryRatefastStatus);
	app.post('/api/athena/ratefast/getAthenaCode', athenaInjury.getAthenaCodes);
	app.get('/api/athena/ratefast/getPatientInfo', athenaInjury.getpatient);
	app.post('/api/athena/ratefast/updatePatient', athenaInjury.updatepatient);
	//update insurance data to athena from ratefast
    app.put('/api/athena/updateInsuranceDatatoAthena', athenaInjury.updateAthenaInsuranceData);
}
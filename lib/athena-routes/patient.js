var athenaPatient =  require('../controllers/athena/athenaPatient');

module.exports = function (app) {
					
	//code by shridhar
	app.get('/api/athena/getpatientByID', athenaPatient.getAthenaPatientByID);
	app.get('/api/athena/getpatientList', athenaPatient.getAthenaPatientList); 	
	
	app.get('/api/athena/ratefast/checkPatientExistance', athenaPatient.checkAthenaPatientExistance);
	app.post('/api/athena/createpatient', athenaPatient.createAthenaPatient); 
	
	app.get('/api/athena/practiceinfo', athenaPatient.getPracticeDetails);
	app.get('/api/athena/ratefast/checkUserExistence',athenaPatient.checkUserExistence);
	app.post('/api/athena/ratefast/createuser',athenaPatient.createUser);
	
	app.get('/api/athena/ratefast/getpasswordbyusername', athenaPatient.getPasswordbyUsername);
	app.get('/api/athena/medications', athenaPatient.getMedications);
	
	app.get('/api/athena/patientchanged', athenaPatient.getPatientChanged);
	
	app.put('/api/athena/syncpatienttoathena', athenaPatient.updateAthenaPatient);
	
	//add practice data in user already exist 
    app.post('/api/athena/ratefast/updateuser',athenaPatient.addUserPracticeData);
	
	app.get('/api/athena/patientmedicalsocialdata', athenaPatient.getOnlyMedicalSocialData);
	
}
'use strict';

angular.module('ratefastApp').controller('workstatusController', function ($scope,$rootScope,$modal, $filter,$location,$anchorScroll, $http,serviceworkstatusnotefax) {	
	if(typeof $rootScope.currentUser =='undefined'){
		$location.path('/createreport');
		$location.replace();
	}else{
		
		$scope.open = function () {
			 debugger;
			 var template = 'partials/providerpopup.html';
			 var modalInstance = $modal.open({
				 templateUrl: template,
				 controller: 'signPopupCtrl',
				 resolve: {
					 type: function () {
						 return 9;
					 }
				 }
			 });
		};
 
		$scope.getCountrySelect=function(){
			 var allCountries = [ [ "Afghanistan (‫افغانستان‬‎)", "af", "93" ], [ "Albania (Shqipëri)", "al", "355" ], [ "Algeria (‫الجزائر‬‎)", "dz", "213" ], [ "American Samoa", "as", "1684" ], [ "Andorra", "ad", "376" ], [ "Angola", "ao", "244" ], [ "Anguilla", "ai", "1264" ], [ "Antigua and Barbuda", "ag", "1268" ], [ "Argentina", "ar", "54" ], [ "Armenia (Հայաստան)", "am", "374" ], [ "Aruba", "aw", "297" ], [ "Australia", "au", "61", 0 ], [ "Austria (Österreich)", "at", "43" ], [ "Azerbaijan (Azərbaycan)", "az", "994" ], [ "Bahamas", "bs", "1242" ], [ "Bahrain (‫البحرين‬‎)", "bh", "973" ], [ "Bangladesh (বাংলাদেশ)", "bd", "880" ], [ "Barbados", "bb", "1246" ], [ "Belarus (Беларусь)", "by", "375" ], [ "Belgium (België)", "be", "32" ], [ "Belize", "bz", "501" ], [ "Benin (Bénin)", "bj", "229" ], [ "Bermuda", "bm", "1441" ], [ "Bhutan (འབྲུག)", "bt", "975" ], [ "Bolivia", "bo", "591" ], [ "Bosnia and Herzegovina (Босна и Херцеговина)", "ba", "387" ], [ "Botswana", "bw", "267" ], [ "Brazil (Brasil)", "br", "55" ], [ "British Indian Ocean Territory", "io", "246" ], [ "British Virgin Islands", "vg", "1284" ], [ "Brunei", "bn", "673" ], [ "Bulgaria (България)", "bg", "359" ], [ "Burkina Faso", "bf", "226" ], [ "Burundi (Uburundi)", "bi", "257" ], [ "Cambodia (កម្ពុជា)", "kh", "855" ], [ "Cameroon (Cameroun)", "cm", "237" ], [ "Canada", "ca", "1", 1, [ "204", "226", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905" ] ], [ "Cape Verde (Kabu Verdi)", "cv", "238" ], [ "Caribbean Netherlands", "bq", "599", 1 ], [ "Cayman Islands", "ky", "1345" ], [ "Central African Republic (République centrafricaine)", "cf", "236" ], [ "Chad (Tchad)", "td", "235" ], [ "Chile", "cl", "56" ], [ "China (中国)", "cn", "86" ], [ "Christmas Island", "cx", "61", 2 ], [ "Cocos (Keeling) Islands", "cc", "61", 1 ], [ "Colombia", "co", "57" ], [ "Comoros (‫جزر القمر‬‎)", "km", "269" ], [ "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)", "cd", "243" ], [ "Congo (Republic) (Congo-Brazzaville)", "cg", "242" ], [ "Cook Islands", "ck", "682" ], [ "Costa Rica", "cr", "506" ], [ "Côte d’Ivoire", "ci", "225" ], [ "Croatia (Hrvatska)", "hr", "385" ], [ "Cuba", "cu", "53" ], [ "Curaçao", "cw", "599", 0 ], [ "Cyprus (Κύπρος)", "cy", "357" ], [ "Czech Republic (Česká republika)", "cz", "420" ], [ "Denmark (Danmark)", "dk", "45" ], [ "Djibouti", "dj", "253" ], [ "Dominica", "dm", "1767" ], [ "Dominican Republic (República Dominicana)", "do", "1", 2, [ "809", "829", "849" ] ], [ "Ecuador", "ec", "593" ], [ "Egypt (‫مصر‬‎)", "eg", "20" ], [ "El Salvador", "sv", "503" ], [ "Equatorial Guinea (Guinea Ecuatorial)", "gq", "240" ], [ "Eritrea", "er", "291" ], [ "Estonia (Eesti)", "ee", "372" ], [ "Ethiopia", "et", "251" ], [ "Falkland Islands (Islas Malvinas)", "fk", "500" ], [ "Faroe Islands (Føroyar)", "fo", "298" ], [ "Fiji", "fj", "679" ], [ "Finland (Suomi)", "fi", "358", 0 ], [ "France", "fr", "33" ], [ "French Guiana (Guyane française)", "gf", "594" ], [ "French Polynesia (Polynésie française)", "pf", "689" ], [ "Gabon", "ga", "241" ], [ "Gambia", "gm", "220" ], [ "Georgia (საქართველო)", "ge", "995" ], [ "Germany (Deutschland)", "de", "49" ], [ "Ghana (Gaana)", "gh", "233" ], [ "Gibraltar", "gi", "350" ], [ "Greece (Ελλάδα)", "gr", "30" ], [ "Greenland (Kalaallit Nunaat)", "gl", "299" ], [ "Grenada", "gd", "1473" ], [ "Guadeloupe", "gp", "590", 0 ], [ "Guam", "gu", "1671" ], [ "Guatemala", "gt", "502" ], [ "Guernsey", "gg", "44", 1 ], [ "Guinea (Guinée)", "gn", "224" ], [ "Guinea-Bissau (Guiné Bissau)", "gw", "245" ], [ "Guyana", "gy", "592" ], [ "Haiti", "ht", "509" ], [ "Honduras", "hn", "504" ], [ "Hong Kong (香港)", "hk", "852" ], [ "Hungary (Magyarország)", "hu", "36" ], [ "Iceland (Ísland)", "is", "354" ], [ "India (भारत)", "in", "91" ], [ "Indonesia", "id", "62" ], [ "Iran (‫ایران‬‎)", "ir", "98" ], [ "Iraq (‫العراق‬‎)", "iq", "964" ], [ "Ireland", "ie", "353" ], [ "Isle of Man", "im", "44", 2 ], [ "Israel (‫ישראל‬‎)", "il", "972" ], [ "Italy (Italia)", "it", "39", 0 ], [ "Jamaica", "jm", "1876" ], [ "Japan (日本)", "jp", "81" ], [ "Jersey", "je", "44", 3 ], [ "Jordan (‫الأردن‬‎)", "jo", "962" ], [ "Kazakhstan (Казахстан)", "kz", "7", 1 ], [ "Kenya", "ke", "254" ], [ "Kiribati", "ki", "686" ], [ "Kuwait (‫الكويت‬‎)", "kw", "965" ], [ "Kyrgyzstan (Кыргызстан)", "kg", "996" ], [ "Laos (ລາວ)", "la", "856" ], [ "Latvia (Latvija)", "lv", "371" ], [ "Lebanon (‫لبنان‬‎)", "lb", "961" ], [ "Lesotho", "ls", "266" ], [ "Liberia", "lr", "231" ], [ "Libya (‫ليبيا‬‎)", "ly", "218" ], [ "Liechtenstein", "li", "423" ], [ "Lithuania (Lietuva)", "lt", "370" ], [ "Luxembourg", "lu", "352" ], [ "Macau (澳門)", "mo", "853" ], [ "Macedonia (FYROM) (Македонија)", "mk", "389" ], [ "Madagascar (Madagasikara)", "mg", "261" ], [ "Malawi", "mw", "265" ], [ "Malaysia", "my", "60" ], [ "Maldives", "mv", "960" ], [ "Mali", "ml", "223" ], [ "Malta", "mt", "356" ], [ "Marshall Islands", "mh", "692" ], [ "Martinique", "mq", "596" ], [ "Mauritania (‫موريتانيا‬‎)", "mr", "222" ], [ "Mauritius (Moris)", "mu", "230" ], [ "Mayotte", "yt", "262", 1 ], [ "Mexico (México)", "mx", "52" ], [ "Micronesia", "fm", "691" ], [ "Moldova (Republica Moldova)", "md", "373" ], [ "Monaco", "mc", "377" ], [ "Mongolia (Монгол)", "mn", "976" ], [ "Montenegro (Crna Gora)", "me", "382" ], [ "Montserrat", "ms", "1664" ], [ "Morocco (‫المغرب‬‎)", "ma", "212", 0 ], [ "Mozambique (Moçambique)", "mz", "258" ], [ "Myanmar (Burma) (မြန်မာ)", "mm", "95" ], [ "Namibia (Namibië)", "na", "264" ], [ "Nauru", "nr", "674" ], [ "Nepal (नेपाल)", "np", "977" ], [ "Netherlands (Nederland)", "nl", "31" ], [ "New Caledonia (Nouvelle-Calédonie)", "nc", "687" ], [ "New Zealand", "nz", "64" ], [ "Nicaragua", "ni", "505" ], [ "Niger (Nijar)", "ne", "227" ], [ "Nigeria", "ng", "234" ], [ "Niue", "nu", "683" ], [ "Norfolk Island", "nf", "672" ], [ "North Korea (조선 민주주의 인민 공화국)", "kp", "850" ], [ "Northern Mariana Islands", "mp", "1670" ], [ "Norway (Norge)", "no", "47", 0 ], [ "Oman (‫عُمان‬‎)", "om", "968" ], [ "Pakistan (‫پاکستان‬‎)", "pk", "92" ], [ "Palau", "pw", "680" ], [ "Palestine (‫فلسطين‬‎)", "ps", "970" ], [ "Panama (Panamá)", "pa", "507" ], [ "Papua New Guinea", "pg", "675" ], [ "Paraguay", "py", "595" ], [ "Peru (Perú)", "pe", "51" ], [ "Philippines", "ph", "63" ], [ "Poland (Polska)", "pl", "48" ], [ "Portugal", "pt", "351" ], [ "Puerto Rico", "pr", "1", 3, [ "787", "939" ] ], [ "Qatar (‫قطر‬‎)", "qa", "974" ], [ "Réunion (La Réunion)", "re", "262", 0 ], [ "Romania (România)", "ro", "40" ], [ "Russia (Россия)", "ru", "7", 0 ], [ "Rwanda", "rw", "250" ], [ "Saint Barthélemy (Saint-Barthélemy)", "bl", "590", 1 ], [ "Saint Helena", "sh", "290" ], [ "Saint Kitts and Nevis", "kn", "1869" ], [ "Saint Lucia", "lc", "1758" ], [ "Saint Martin (Saint-Martin (partie française))", "mf", "590", 2 ], [ "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)", "pm", "508" ], [ "Saint Vincent and the Grenadines", "vc", "1784" ], [ "Samoa", "ws", "685" ], [ "San Marino", "sm", "378" ], [ "São Tomé and Príncipe (São Tomé e Príncipe)", "st", "239" ], [ "Saudi Arabia (‫المملكة العربية السعودية‬‎)", "sa", "966" ], [ "Senegal (Sénégal)", "sn", "221" ], [ "Serbia (Србија)", "rs", "381" ], [ "Seychelles", "sc", "248" ], [ "Sierra Leone", "sl", "232" ], [ "Singapore", "sg", "65" ], [ "Sint Maarten", "sx", "1721" ], [ "Slovakia (Slovensko)", "sk", "421" ], [ "Slovenia (Slovenija)", "si", "386" ], [ "Solomon Islands", "sb", "677" ], [ "Somalia (Soomaaliya)", "so", "252" ], [ "South Africa", "za", "27" ], [ "South Korea (대한민국)", "kr", "82" ], [ "South Sudan (‫جنوب السودان‬‎)", "ss", "211" ], [ "Spain (España)", "es", "34" ], [ "Sri Lanka (ශ්‍රී ලංකාව)", "lk", "94" ], [ "Sudan (‫السودان‬‎)", "sd", "249" ], [ "Suriname", "sr", "597" ], [ "Svalbard and Jan Mayen", "sj", "47", 1 ], [ "Swaziland", "sz", "268" ], [ "Sweden (Sverige)", "se", "46" ], [ "Switzerland (Schweiz)", "ch", "41" ], [ "Syria (‫سوريا‬‎)", "sy", "963" ], [ "Taiwan (台灣)", "tw", "886" ], [ "Tajikistan", "tj", "992" ], [ "Tanzania", "tz", "255" ], [ "Thailand (ไทย)", "th", "66" ], [ "Timor-Leste", "tl", "670" ], [ "Togo", "tg", "228" ], [ "Tokelau", "tk", "690" ], [ "Tonga", "to", "676" ], [ "Trinidad and Tobago", "tt", "1868" ], [ "Tunisia (‫تونس‬‎)", "tn", "216" ], [ "Turkey (Türkiye)", "tr", "90" ], [ "Turkmenistan", "tm", "993" ], [ "Turks and Caicos Islands", "tc", "1649" ], [ "Tuvalu", "tv", "688" ], [ "U.S. Virgin Islands", "vi", "1340" ], [ "Uganda", "ug", "256" ], [ "Ukraine (Україна)", "ua", "380" ], [ "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)", "ae", "971" ], [ "United Kingdom", "gb", "44", 0 ], [ "United States", "us", "1", 0 ], [ "Uruguay", "uy", "598" ], [ "Uzbekistan (Oʻzbekiston)", "uz", "998" ], [ "Vanuatu", "vu", "678" ], [ "Vatican City (Città del Vaticano)", "va", "39", 1 ], [ "Venezuela", "ve", "58" ], [ "Vietnam (Việt Nam)", "vn", "84" ], [ "Wallis and Futuna", "wf", "681" ], [ "Western Sahara (‫الصحراء الغربية‬‎)", "eh", "212", 1 ], [ "Yemen (‫اليمن‬‎)", "ye", "967" ], [ "Zambia", "zm", "260" ], [ "Zimbabwe", "zw", "263" ], [ "Åland Islands", "ax", "358", 1 ] ];
			 var optionList=[];
			 
			 for (var i = 0; i < allCountries.length; i++) {
		        var c = allCountries[i];
		        var obj = {
		                name: c[0],
		                iso2: c[1],
		                dialCode: c[2],
		                priority: c[3] || 0,
		                areaCodes: c[4] || null
		            };
		        optionList.push(obj);
			 }
		  return optionList;
		}
		$scope.countryList=$scope.getCountrySelect();		
		$scope.dispayProgress=false;
		$scope.getProfession = function (data, otherprof) {
			
             if (data) {
                 var ret_text = '';


                 if (data.length == 1) {
                     if (data[k] != 'other') {
                         ret_text = data[0].toUpperCase();
                     } else {
                         if (otherprof) {
                             ret_text = otherprof;
                         }
                     }
                 }
                 if (data.length > 1) {
                     for (var k = 0; k < data.length; k++) {

                         if (data[k]) {
                             if (k == data.length - 1) {
                                 if (data[k] != 'other') {
                                     ret_text = ret_text + data[k].toUpperCase();
                                 } else {
                                     if (otherprof) {
                                         ret_text = ret_text + otherprof;
                                     }
                                 }

                             }
                             if (k != data.length - 1) {
                                 if (data[k] != 'other') {
                                     ret_text = ret_text + data[k].toUpperCase() + ', ';
                                 } else {
                                     if (otherprof) {
                                         ret_text = ret_text + otherprof + ', ';
                                     }
                                 }
                             }
                         }
                     }
                 }

                 return ret_text;

             }

         };
         $scope.popupMessage = function (message, width) {

             $rootScope.modalInstance = $modal.open({
                 templateUrl: 'partials/popupmessage.html',
                 controller: 'popupMessagectrl',
                 resolve: {
                     message: function () {
                         return message;
                     }
                 }

             });

         };
         /**
          * On change of practice Address update the location accordingly
          */
         $scope.locationChange = function (senderofficeaddress) {
             $scope.sender.currentSelCliniclocation	= senderofficeaddress;

         };
        
		$scope.sender={};  
		$scope.recipient={};
		$scope.sender.officeAddr				=	$rootScope.allcliniclocation;
		$scope.isClicSelected 					= 	false;
			
		$scope.currentSelCliniclocation			= 	typeof($rootScope.currentSelectedCliniclocation) !="undefined" ?$rootScope.currentSelectedCliniclocation:'';
		$scope.sender.loggenInUser				=	$rootScope.currentUser;
		$scope.sender.currentSelCliniclocation	= 	typeof($rootScope.currentSelectedCliniclocation) !="undefined" ?$rootScope.currentSelectedCliniclocation.location:'';
		var profession							= 	typeof($scope.sender.loggenInUser.profession) !="undefined" ? $scope.getProfession($scope.sender.loggenInUser.profession, $scope.sender.loggenInUser.otherprofessiontext) : "" ;
		$scope.sender.fullname					=	$scope.sender.loggenInUser.firstname + " " +$scope.sender.loggenInUser.lastname+" "+ profession;
		$scope.recipient.company				=	$rootScope.report.data.bginfo.company;
		
		/**
		 * Change 1 : Changes made on 16-march-2016 at 5.50pm by manoj gupta
		 * original code below: 
		 * 	$scope.recipient.faxno	=	$rootScope.report.data.patientcomplaints.subjectivecomplaints_fax;		
		 * 
		 */
		 
		$scope.recipient.recipientfaxnumber 						= 	$rootScope.report.data.bginfo.emp_fax;
		$scope.sender.loggenInUser.faxnumber	=	$rootScope.report.data.patientcomplaints.subjectivecomplaints_fax;
		$scope.sender.loggenInUser.userphonenumber	=	$rootScope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber;
		$scope.sender.loggenInUser.userextension	=	$rootScope.report.data.patientcomplaints.subjectivecomplaints_extension;
		
		
		/**
		 * Submits when all required data are filled
		 */		
		$scope.submitForm = function(workStatusFaxForm) {
		
			if ($scope.workStatusFaxForm.$valid) {
				$scope.dispayProgress=true; 
				var postWorkStatusData= $rootScope.workStatusData;
				postWorkStatusData.workStatusData.faxHeader={};
				 var faxCoverHeader="";
				 
				/**
				 * Header code for fax
				 */
				 faxCoverHeader +='<div> <h1 style="text-align:center">Employee Work Status</h1>';
				 faxCoverHeader +='<br/><br/>';
				 if(typeof $rootScope.workStatusData.workStatusData.currentexamdate !="undefined"){
					 if($rootScope.workStatusData.currentexamdate!=""){
						 faxCoverHeader +='<div style="width:100%;text-align:right">Date: '+$filter('date')($rootScope.workStatusData.workStatusData.currentDate, "MM/dd/yyyy")+'</div>';
						 faxCoverHeader +='<div style="width:100%;text-align:right">Time: '+$filter('date')($rootScope.workStatusData.workStatusData.currentDate, "hh:mm a")+'</div>';
						 postWorkStatusData.workStatusData.faxHeader.currentDate=$filter('date')($rootScope.workStatusData.workStatusData.currentDate, "MM/dd/yyyy") ;
						 postWorkStatusData.workStatusData.faxHeader.currentTime=$filter('date')($rootScope.workStatusData.workStatusData.currentDate, "hh:mm a") ;
					 }
				 }
				 
				 faxCoverHeader +='<br/><br/>';
				 faxCoverHeader +='<div style="width:100%;text-align:left" >';
				 if((typeof workStatusFaxForm.fname['$viewValue'] !="undefined") && (typeof workStatusFaxForm.company['$viewValue'] !="undefined")&& (typeof workStatusFaxForm.lname['$viewValue'] !="undefined")){
					 if(!((workStatusFaxForm.fname['$viewValue'] =="") && (workStatusFaxForm.company['$viewValue'] =="" && (workStatusFaxForm.lname['$viewValue'] =="")))){
						 faxCoverHeader +="To: ";
						 postWorkStatusData.workStatusData.faxHeader.toHeader="To: ";
							
					 }
				 }
				 if(typeof workStatusFaxForm.fname['$viewValue'] !="undefined"){
					 if(workStatusFaxForm.fname['$modelValue']!=""){
						 faxCoverHeader +=workStatusFaxForm.fname['$modelValue']+' '+workStatusFaxForm.lname['$modelValue'] ;
						 postWorkStatusData.workStatusData.faxHeader.recipientName=workStatusFaxForm.fname['$modelValue']+' '+workStatusFaxForm.lname['$modelValue'] ;
							
					 }
				 }
				 if(typeof workStatusFaxForm.company['$viewValue'] !="undefined"){
					 if(workStatusFaxForm.company['$modelValue']!=""){
						 faxCoverHeader +=', '+workStatusFaxForm.company['$modelValue'] ;
						 postWorkStatusData.workStatusData.faxHeader.company=', '+workStatusFaxForm.company['$modelValue'] ;
							
					 }
				 }
				 if(typeof workStatusFaxForm.recipientfaxCountryCode['$viewValue'] !="undefined"){
					if(workStatusFaxForm.recipientfaxCountryCode['$modelValue']!=""){
						faxCoverHeader +=', '+ workStatusFaxForm.recipientfaxCountryCode['$viewValue'] + ' '+workStatusFaxForm.recipientfaxnumber['$viewValue'] ;
						postWorkStatusData.workStatusData.faxHeader.recipientfaxnumber=', '+ workStatusFaxForm.recipientfaxCountryCode['$viewValue'] + ' '+workStatusFaxForm.recipientfaxnumber['$viewValue'] ;
						
					}
				}
				else
				{
					faxCoverHeader +=', +1 '+workStatusFaxForm.recipientfaxnumber['$viewValue'] ;
					postWorkStatusData.workStatusData.faxHeader.recipientfaxnumber=', +1 '+workStatusFaxForm.recipientfaxnumber['$viewValue'] ;
	
				}
				 faxCoverHeader +='</div>';
				 faxCoverHeader +='<br/><br/>';
				 faxCoverHeader +='<div style="width:100%;text-align:right" > </div>';
				 if(typeof workStatusFaxForm.recipientRemark['$viewValue'] !="undefined"){
					 if(workStatusFaxForm.recipientRemark['$modelValue']!=""){
						 faxCoverHeader +='<div>Comment : <br/>'+workStatusFaxForm.recipientRemark['$modelValue']+'</div>';
						 postWorkStatusData.workStatusData.faxHeader.recipientRemark=workStatusFaxForm.recipientRemark['$modelValue'] ;
					 }
				 }
				 faxCoverHeader +='<br/>';
				 if(typeof workStatusFaxForm.sendername['$modelValue'] !="undefined"){	 
					 if(workStatusFaxForm.sendername['$modelValue']!=""){
						 faxCoverHeader +='<div>From: '+workStatusFaxForm.sendername['$modelValue']+'</div>';
						 postWorkStatusData.workStatusData.faxHeader.sendername=workStatusFaxForm.sendername['$modelValue'] ;
					 }
				 }
				 
				 if(typeof workStatusFaxForm.senderlocationname['$modelValue'] !="undefined"){	
					 if(workStatusFaxForm.senderlocationname['$modelValue']!=""){
						 faxCoverHeader +='<div>'+workStatusFaxForm.senderlocationname['$modelValue']+'</div>';
						 postWorkStatusData.workStatusData.faxHeader.senderlocationname=workStatusFaxForm.senderlocationname['$modelValue'] ;
					 }
				 }
				 
				 //faxCoverHeader +='<br/><br/>';
				 if(typeof $scope.currentSelCliniclocation !='undefined'){
					 if($scope.currentSelCliniclocation.street!=""){
						 faxCoverHeader +='<div>'+$scope.currentSelCliniclocation.street+'</div>';
						 postWorkStatusData.workStatusData.faxHeader.currentSelCliniclocation=$scope.currentSelCliniclocation;
					 }
					 if($scope.currentSelCliniclocation.city!=""){
						 faxCoverHeader +='<div>'+$scope.currentSelCliniclocation.city+ ', '+$scope.currentSelCliniclocation.state +', '+$scope.currentSelCliniclocation.zipcode+'</div>';
					 }
				 }
				 
				 faxCoverHeader +='<br/>';
				 if(typeof workStatusFaxForm.senderphonenumber['$modelValue'] !='undefined'){
					 if(workStatusFaxForm.senderfaxnumber['$modelValue']!=""){
						 faxCoverHeader +='<div>Phone: '+workStatusFaxForm.senderphonenumber['$viewValue']+' ext. '+workStatusFaxForm.senderphoneextension['$viewValue']+'</div>';
						 postWorkStatusData.workStatusData.faxHeader.senderphonenumber=workStatusFaxForm.senderphonenumber['$viewValue'];
						 postWorkStatusData.workStatusData.faxHeader.senderphoneextension=workStatusFaxForm.senderphoneextension['$viewValue'];
					 }
				 }
				 
				 faxCoverHeader +='<br/>';
				 if(typeof workStatusFaxForm.senderemail['$modelValue'] !='undefined'){
					 if(workStatusFaxForm.senderemail['$modelValue']!=""){
						 faxCoverHeader +='<div>Email: '+workStatusFaxForm.senderemail['$modelValue']+'<div>';
						 postWorkStatusData.workStatusData.faxHeader.senderemail=workStatusFaxForm.senderemail['$viewValue'];
					 }
				 }
				 
				 faxCoverHeader +='<br/>';
				 if(typeof workStatusFaxForm.senderfaxnumber['$modelValue'] !='undefined'){
					 if(workStatusFaxForm.senderfaxnumber['$modelValue']!=""){
						 faxCoverHeader +='Sender Fax Number: '+workStatusFaxForm.senderfaxnumber['$viewValue']+'';
						 postWorkStatusData.workStatusData.faxHeader.senderfaxnumber=workStatusFaxForm.senderfaxnumber['$viewValue'];
					 }
				 }
				 if(typeof workStatusFaxForm.recipientfaxnumber['$modelValue'] !="undefined"){
					 if(workStatusFaxForm.recipientfaxnumber['$modelValue']!=""){
						 postWorkStatusData.workStatusData.recipientfaxnumber =workStatusFaxForm.recipientfaxnumber['$modelValue'] ;
						 postWorkStatusData.workStatusData.faxHeader.recipientfaxnumber=workStatusFaxForm.recipientfaxnumber['$viewValue'];
					 }
				 }
				 if(typeof workStatusFaxForm.recipientfaxCountryCode['$modelValue'] !='undefined'){
					 if(workStatusFaxForm.recipientfaxCountryCode['$modelValue']!=""){
						 postWorkStatusData.workStatusData.recipientfaxnumber=workStatusFaxForm.recipientfaxCountryCode['$modelValue']+postWorkStatusData.workStatusData.recipientfaxnumber;
						 postWorkStatusData.workStatusData.recipientfaxnumber.recipientfaxnumber=workStatusFaxForm.recipientfaxCountryCode['$modelValue']+postWorkStatusData.workStatusData.recipientfaxnumber;
						 postWorkStatusData.workStatusData.faxHeader.recipientfaxCountryCode=workStatusFaxForm.recipientfaxCountryCode['$modelValue'];
							
					 }
				 }
				 
					
				 faxCoverHeader +='<br/><br/>';
				 faxCoverHeader +='<div>';
				 faxCoverHeader +='This fax contains confidential information. If you are not the intended recipient, you are hereby notified that any dissemination, distribution, copying, or taking any action based on it is strictly prohibited and may have legal consequences. If you have received this fax in error, please notify the sender and destroy the original message and all copies.';
				 faxCoverHeader +=' </div> </div>';
				 /**
				  * Fax header printed multiple times issue solution
				  */
				 postWorkStatusData.workStatusData.html=faxCoverHeader+$rootScope.workStatusData.workStatusData.html;
				 debugger
				 serviceworkstatusnotefax.save(postWorkStatusData).$promise.then(function (response) {
					
					 $scope.dispayProgress=false;
					 $scope.popupMessage('The work status note has been faxed. To view the faxed work status note, click the View button. The work status note will be at the end of the report. ', 200);
					 $location.path('/createreport');
					 $location.replace();
				 }).catch(function (err) {
					 debugger;
					 $scope.dispayProgress=false;
					 $scope.popupMessage('Phone number is not formatted correctly or invalid. Please check the number and try again.', 400);
					 //$location.path('/createreport');
					// $location.replace();
				 });
			}

		};
		$scope.cancelFax = function() {
			$location.path('/createreport');
			$location.replace();
		};			
	}	
	
        
});
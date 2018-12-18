'use strict';

angular.module('ratefastApp')
    .controller('reportPreviewctrl', function ($scope, $http, $routeParams, $cookieStore, $cookies, patientid, reportid, $modalInstance, $sce, $rootScope, $filter, formVersion, formid, socket, $location, reportLogging) {

        $scope.patientid = (patientid);
        $scope.reportid = reportid;
        $cookies.formVersion = formVersion;
        $cookies.formid = formid;
        $cookieStore.put('formVersion', formVersion);
     
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
				

        $scope.ok = function () {
            
            socket.reportopened($rootScope.currentUser, $scope.reportid);

            $modalInstance.dismiss('/createreport');

            if ($scope.reportid != 'reportid') {
                $rootScope.reportId = $scope.reportid;
            }
            else {
                $rootScope.reportId = '';
            }

            //Report Logging for Getting IN
            reportLogging.reportopen().query({ 'reportid': $scope.reportid });

            $location.path('/createreport');
        };

    })
    .controller('newreportPreviewctrl', function ($scope, $http, $routeParams, patientid, formType, $modalInstance, $cookies, $sce, $location) {

        $scope.patientid = (patientid);
        if ($cookies.formType) {
            delete $cookies['formType'];
        }

        $cookies.formType = formType;
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {
            $modalInstance.dismiss('cancel');
            $location.path('/createreport');
        };

        $scope.getAge = function (dateString) {
            var today = new Date();
            var birthDate = new Date(dateString);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };

    })
    .controller('formdataPreviewCtrl', function ($scope, $http, $routeParams, $rootScope, $compile, $cookies, report, newReportStatus, reportdata, $modalInstance, $interpolate, $filter, currentLoggedinUserdata, PracticeGetDataByName, UpdateSignature, Practices, getdatafromAPI, closedreport, reportFlavor, submitStatus, submittedreportcount, chargeReport, submittedDate, downloadReportSafari, strTemplate) {
        $scope.billingcalculatoromfs = $rootScope.billingcalculatoromfs;
        $scope.report = report;
        $scope.report.data.usernpinumber = $rootScope.usernpinumber;
		
		$scope.practiceDetails = $rootScope.currentUser.practiceDetails;

        //Added by Unais to assign template from HTML
        $scope.strTemplate = strTemplate;

        if (reportdata != 'Blankdata')
            $scope.currentreport = reportdata;
        else
            $scope.currentreport = '<h4>No Data Available for this version or type of report.</h4>';
        $scope.reportFlavor = reportFlavor;
        $scope.newReportStatus = newReportStatus;
        $scope.closedreport = closedreport;
        $scope.submitStatus = submitStatus;
        $scope.submittedDate = submittedDate;
        $scope.reportcharge = chargeReport;

        /**
         * Current user and practice name info. Modification done for work status note feature 
         * @date:4 march 2016
         * @author: manoj gupta
         */
        $scope.currentUser = $rootScope.currentUser;
        $scope.existingReportPracticeName = $rootScope.existingReportPracticeName;
        $scope.currentSelectedCliniclocation = $rootScope.currentSelectedCliniclocation;
        $scope.currentDate = new Date();

        try {
            if ($scope.report.data.patientcomplaints.treatphynamedropdown) {
                currentLoggedinUserdata.query({ userid: $scope.report.data.patientcomplaints.treatphynamedropdown }, function (response) {

                    $scope.doctorInfo = response[0].userData[0];

                });
            }
        }
        catch (err) {
            //console.log(err);
        }

        //set current date for publish
        $scope.currdate = Date.now();

        $scope.domainName = window.location.host;

        $scope.showDocxBtn = false;
        if ($scope.domainName == 'localhost:9000' || $scope.domainName == 'localhost:3000' || $scope.domainName == 'ratefastcloud.azurewebsites.net') {
            $scope.showDocxBtn = true;
        }

        //$scope.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;

		//Safari detection code changed
		$scope.isSafari = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)==true?true:false;

        /**
		 * for adding spinner on report load
		  * @date : 18-May-2015
         * @author:manoj Gupta
		 */
        $scope.loader_handler = function (sendAs) {
            $scope.reportisLoad = sendAs;
        }
		
		 /**
        * RFA publish - do not print an RFA if a user selects a Treatment Category but does not select a treatment
        * @date : 14-Sep-2016
		* @version: V2.3.2
        * @author:manoj Gupta
        */
		
		$scope.isTreatmentSelected=function(medication, mediValue){			

			if(typeof medication=='string'){
				switch (medication) {
					case "TENS unit":
					return true;
					case "Splints":
					return true;
					case "Wheelchair":
					return true;
					case "H-Wave unit":
					return true;
					case "Cane":
					return true;
					case "Crutch":
					return true;
					case "AFO":
					return true;	
					case "KAFO":
					return true;
					case "Tennis Elbow Strap":
					return true;
					case "Neoprene Sleeve":
					return true;
					case "Wrist Support":
					return true;
					case "Lumbar Support":
					return true;
					case "Other":
					return true;
					default :
					return false;						
				}
			}
			/*if(typeof medication=='object'){
				if(typeof medication.selectnsaids =='undefined'){
					return false;
				}else{
					if(medication.selectnsaids ==''){
						return false;
					}else{
						return true;
					}
				}
			}*/
			if(typeof medication=='object'){
				if(typeof medication.selectnsaids =='undefined'){
					return false;
				}else{
					if(medication.selectnsaids ==''){
						return false;
					}else
					{
						if($scope.formtype!='pr4')
						{
							return true;
						}
						else
						{
							try{
								if(mediValue=="treatmentother"){
									if(typeof medication.othertreatmentnecessary!='undefined'){										
										if(medication.othertreatmentnecessary=='Yes'){
											return true;
										}else{
											return false;
										}
									}else{
										return false;
									}
									
								}else{
									return true;
								}
							}
							catch(err)
							{
								//console.log(err);
								return true;
							}								
						}						
					}
				}
			}
			return false;
		}

        /**
        * Store Work status data when user click Fax or save to docx button on work status page 
        * @date : 3-march-2015
        * @author:manoj Gupta
        */
        $scope.saveWorkStatus = function (sendAs) {
            /**
        	 * Extract all text data from specified ids in work status preview page.
        	 */
            var workstatus = {};
            try {
                workstatus.wsPublishSectionRoot = $('#wsPublishSectionRoot').text().trim().replace(/\s\s+/g, ' ');
                workstatus.wsPubSecWorkRest = $('#wsPublishSectionWorkRestriction').text().trim().replace(/\s\s+/g, ' ');
                workstatus.wsPubSecEnvRest = $('#wsPublishSectionEnvironmentalRestriction').text().trim().replace(/\s\s+/g, ' ');
                workstatus.wsClinicFollowUpPlan = $('#wsClinicFollowUpPlan').text().trim().replace(/\s\s+/g, ' ');
                workstatus.wsCurrentPractice = $rootScope.existingReportPracticeName;
                workstatus.cliniclocationobj = $scope.report.data.patientcomplaints.cliniclocationobj;
                workstatus.phonenumber = $scope.report.data.patientcomplaints.subjectivecomplaints_contactphonenumber;
                workstatus.extension = $scope.report.data.patientcomplaints.subjectivecomplaints_extension;

                workstatus.doctorInfo = typeof $scope.doctorInfo != 'undefined' ? $scope.doctorInfo : {};
                workstatus.currentexamdate = $scope.report.data.patientcomplaints.currentexamdate;
                workstatus.patientFirstname = $scope.report.data['bginfo'].firstname;
                workstatus.patientMiddlename = $scope.report.data['bginfo'].middlename;
                workstatus.patientLastname = $scope.report.data['bginfo'].lastname;
                workstatus.currentUser = $rootScope.currentUser;
                workstatus.currentDate = $scope.currentDate;
                workstatus.doctorProfession = typeof $scope.doctorInfo != 'undefined' ? ($scope.getProfession($scope.doctorInfo.profession, $scope.doctorInfo.otherprofessiontext)) : "";
                workstatus.WRretirndutydate = $scope.report.data['workrestriction'].WRretirndutydate
                if (sendAs == "senddoc") {
                    workstatus.sendAs = 'senddoc';
                    $rootScope.modalPreview.close(workstatus);
                }
                if (sendAs == "sendfax") {

                    var html = document.getElementById('wsreportHtml').innerHTML;
                    workstatus.html = html;
                    workstatus.sendAs = 'sendfax';
                    $rootScope.modalPreview.close(workstatus);
                }
            } catch (err) {
                //console.log(err);
            }
        }
        /**
         * store work status ends here
         */

        /**
         * Download to doc for work status note starts here
         * @Date: 1-March-2016
         * @author : Manoj Gupta
         */
        $scope.downloadDocxWS = function () {
			
            $scope.saveWorkStatus('senddoc');
            $(".sectionToDelFromDocx").html('');
            var blobs = [];
            var content = document.getElementById('wsreportHtml').innerHTML;
            var paragraphContent = document.getElementById('wsreportHtml').getElementsByClassName("divMain");
            for (var i = 0; i < paragraphContent.length; i++) {
                var element = paragraphContent[i].innerHTML;
                var replaceText = $scope.replaceAll(element, '<div', '<span');
                replaceText = $scope.replaceAll(replaceText, '</div>', '</span>')
                content = content.replace(element, replaceText);
            }
            var currentexamdate = $filter('date')($scope.report.data.patientcomplaints.currentexamdate, 'MMMM dd, yyyy');

            var treatingPhyProf = '';

            if ($scope.doctorInfo) {
                if ($scope.doctorInfo.profession || $scope.doctorInfo.otherprofessiontext) {
                    treatingPhyProf = $scope.getProfession($scope.doctorInfo.profession, $scope.doctorInfo.otherprofessiontext);
                }
                var header = $filter('capitalize')($scope.doctorInfo.firstname) + "&nbsp;" + $filter('capitalize')($scope.doctorInfo.lastname) + "&nbsp;" + treatingPhyProf + "<br />" + $scope.setAddress();
                var footer = "Patient: " + $scope.report.data.bginfo.lastname + ",&nbsp;" + $scope.report.data.bginfo.firstname + "<br/>Treating Provider: " + $scope.doctorInfo.firstname + "&nbsp;" + $scope.doctorInfo.lastname + ", " + treatingPhyProf + "<br/>Date of Exam: " + currentexamdate;

            } else {
                var header = "<br />" + $scope.setAddress();
                var footer = "Patient: " + $scope.report.data.bginfo.lastname + ",&nbsp;" + $scope.report.data.bginfo.firstname + "<br/>Date of Exam: " + currentexamdate;
            }
			
			 try{				 
				switch($cookies.formType)
				{					
					case 'dfr':
					{
						if($rootScope.currentUser.practiceDetails.enable_ws_docx_header_dfr==false)
							header='';						
						if($rootScope.currentUser.practiceDetails.enable_ws_docx_footer_dfr==false)
							footer='';						
					}
					case 'pr2':
					{
						if($rootScope.currentUser.practiceDetails.enable_ws_docx_header_pr2==false)
							header='';						
						if($rootScope.currentUser.practiceDetails.enable_ws_docx_footer_pr2==false)
							footer='';
					}
					case 'pr4':
					{
						if($rootScope.currentUser.practiceDetails.enable_ws_docx_header_pr4==false)
							header='';						
						if($rootScope.currentUser.practiceDetails.enable_ws_docx_footer_pr4==false)
							footer='';
					}
				}				
				 
                /*if($rootScope.currentUser.practiceDetails.enable_docx_header==false){
                    header='';
                }
                if($rootScope.currentUser.practiceDetails.enable_docx_footer==false){
                    footer='';
                }*/
            }catch(err){
                //console.log(err);
            }

            var filename = $filter('uppercase')($scope.formtype) + "_Report_" + $scope.report.data.bginfo.firstname + "_" + $scope.report.data.bginfo.lastname + ".doc";

            $scope.docContent = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'> <head><title></title> <!--[if gte mso 9]> <xml> <w:WordDocument> <w:View>Print</w:View> <w:Zoom>90</w:Zoom> <w:DoNotOptimizeForBrowser/> </w:WordDocument> </xml> <![endif]--> <style> p.MsoFooter, li.MsoFooter, div.MsoFooter { margin:0in; margin-bottom:.0001pt; mso-pagination:widow-orphan; tab-stops:center 3.0in right 6.0in; font-size:12.0pt; } <style> <!-- /* Style Definitions */ @page Section1 { size:8.5in 11.0in; margin:0.50in 0.50in 0.50in 0.50in; mso-header-margin:.3in; mso-header:h1; mso-footer: f1; mso-footer-margin:.3in; } div.Section1 { page:Section1; } table#hrdftrtbl { margin:0in 0in 0in 9in; } --> </style></head> <body lang=EN-US style='tab-interval:.5in'> <div class=Section1> " + content + " <table id='hrdftrtbl' border='1' cellspacing='0' cellpadding='0'> <tr><td> <div style='mso-element:header' id=h1 > <p class=MsoHeader style='text-align:center'>" + header + "</p> </div> </td> <td style='text-align:center'> <div style='mso-element:footer' id=f1> <p class=MsoFooter style='text-align:right; font-size:13px;'>" + footer + "</p><p class=MsoFooter align=center style='text-align:center'><span style=mso-tab-count:2; '></span>Page <span style='mso-field-code:\" PAGE \"'></span> of <span style='mso-field-code:\" NUMPAGES \"'></span></p></div> </td></tr> </table> </body></html>";

            if ($scope.isSafari) {

                downloadReportSafari.save({ 'content': $scope.docContent, 'filename': filename }).$promise.then(function (response) {
                    var popup = window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");
                    //var popup = window.open("/views/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");
                   
                    if (popup == undefined) {
                        alert('Please disable your popup blocker');
                    }
                });

            } else {

                blobs.push($scope.docContent);

                var blob = new Blob(blobs, {
                    type: "application/msword"
                });

                saveAs(blob, filename);
            }

        };
        /**
         * Download to doc for work status note ends here
         */

        /**
        * SendFax for work status note starts here
        * @Date: 1-March-2016
        * @author : Manoj Gupta
        */
        $scope.workStatusSendFax = function () {
            //save  work status before sending fax 
            $scope.saveWorkStatus('sendfax');
            
            /*var workstatus={};
            workstatus.html = document.getElementById('wsreportHtml').innerHTML;
            workstatus.sendAs					=	'sendfax';
            $rootScope.modalPreview.close(workstatus);*/

        };
        /**
         * fax for work status note ends here
         */
		 
		$scope.parseHTMLUnicodeChars = function (htmlData) {			
			var parsedData='';
			var replaceCodesArr = [{"initialChar": "‘", "replaceChar": "'"},{"initialChar": "’", "replaceChar": "'"},{'initialChar': '“', 'replaceChar': '"'},{'initialChar': '”', 'replaceChar': '"'}];
			if(typeof htmlData!='undefined')
			{
				if(htmlData!='')
				{
					/*$.each(replaceCodesArr, function(index, elem)
					{						
						parsedData = htmlData.replace('/' + elem.initialChar + '/g', elem.replaceChar);
					});*/
					parsedData = htmlData;
					parsedData = parsedData.replace(/‘/g, "'");
					parsedData = parsedData.replace(/’/g, "'");
					parsedData = parsedData.replace(/“/g, '"');
					parsedData = parsedData.replace(/”/g, '"');
				}
			}
			return parsedData;
		} 

        $scope.downloadDocx = function () {
            try {
                $(".sectionToDelFromDocx").html('');
            } catch (err) {
                //console.log(err);
            }
            var blobs = [];
            //document.getElementById('docReportHeading').style.display='block';
            //var content = document.getElementById('reportHtmlData').innerHTML;			
			//var content = $scope.htmlDecode($scope.htmlEncode(document.getElementById('reportHtmlData').innerHTML));
			
			var content = document.getElementById('reportHtmlData').innerHTML.replace(/“/g, '"').replace(/”/g, '"').replace(/‘/g, "'").replace(/’/g, "'");	
			//content = document.getElementById('reportHtmlData').innerHTML.replace(/á/g, "&aacute;"); //a with acute
			//content = document.getElementById('reportHtmlData').innerHTML.replace(/Á/g, "&Aacute;"); //A with acute
			
			/*content = document.getElementById('reportHtmlData').innerHTML.replace(/á/g, "a&#768;"); //a with acute
			content = document.getElementById('reportHtmlData').innerHTML.replace(/Á/g, "A&#768;"); //A with acute
			
			content = document.getElementById('reportHtmlData').innerHTML.replace(/É/g, "E&#768;"); //E with acute
			content = document.getElementById('reportHtmlData').innerHTML.replace(/Í/g, "I&#768;"); //E with acute
			content = document.getElementById('reportHtmlData').innerHTML.replace(/Ó/g, "O&#768;"); //E with acute
			content = document.getElementById('reportHtmlData').innerHTML.replace(/Ú/g, "U&#768;"); //E with acute*/
			
			/*content = document.getElementById('reportHtmlData').innerHTML.replace(/é/g, "&eacute;"); //e with acute
			content = document.getElementById('reportHtmlData').innerHTML.replace(/É/g, "&Eacute;"); //E with acute
			content = document.getElementById('reportHtmlData').innerHTML.replace(/í/g, "&iacute;"); //i with acute
			content = document.getElementById('reportHtmlData').innerHTML.replace(/Í/g, "&Iacute;"); //I with acute
			content = document.getElementById('reportHtmlData').innerHTML.replace(/ó/g, "&oacute;"); //o with acute
			content = document.getElementById('reportHtmlData').innerHTML.replace(/Ó/g, "&Oacute;"); //O with acute
			content = document.getElementById('reportHtmlData').innerHTML.replace(/ú/g, "&uacute;"); //u with acute
			content = document.getElementById('reportHtmlData').innerHTML.replace(/Ú/g, "&Uacute;"); //U with acute
			                                                                            
			content = document.getElementById('reportHtmlData').innerHTML.replace(/ñ/g, "&ntilde;"); //n with tilde
			content = document.getElementById('reportHtmlData').innerHTML.replace(/Ñ/g, "&Ntilde;"); //N with tilde
			                                                                            
			content = document.getElementById('reportHtmlData').innerHTML.replace(/ü/g, "&uuml;"); //u with diaeresis
			content = document.getElementById('reportHtmlData').innerHTML.replace(/Ü/g, "&Uuml;"); //U with diaeresis
			                                                                            
			content = document.getElementById('reportHtmlData').innerHTML.replace(/¡/g, "&iexcl;"); //inverted exclamation mark
			content = document.getElementById('reportHtmlData').innerHTML.replace(/¿/g, "&iquest;"); //turned question mark	*/		
			
			
			
			//content = $scope.parseHTMLUnicodeChars(document.getElementById('reportHtmlData').innerHTML);
			
			/*function htmlEncode(value){
			  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
			  //then grab the encoded contents back out.  The div never exists on the page.
			  return $('<div/>').text(value).html();
			}*/
			
            var paragraphContent = document.getElementById('reportHtmlData').getElementsByClassName("divMain");
            for (var i = 0; i < paragraphContent.length; i++) {
                var element = paragraphContent[i].innerHTML;
                var replaceText = $scope.replaceAll(element, '<div', '<span');
                replaceText = $scope.replaceAll(replaceText, '</div>', '</span>')
                content = content.replace(element, replaceText);
            }

            // var paragraphContent2 = document.getElementById('rfaHtml').getElementsByClassName("divMain");
            // var content2 = document.getElementById('rfaHtml').innerHTML;
            // var paragraphContent2 = document.getElementById('rfaHtml').getElementsByClassName("divMain");
            // for (var i = 0; i < paragraphContent2.length; i++) {
            // var element2 = paragraphContent2[i].innerHTML;
            // var replaceText2 = $scope.replaceAll(element2, '<div', '<span');
            // replaceText2 = $scope.replaceAll(replaceText2, '</div>', '</span>')
            // content2 = content2.replace(element2, replaceText2);
            // }

            // content = content + content2;

            var currentexamdate = $filter('date')($scope.report.data.patientcomplaints.currentexamdate, 'MMMM dd, yyyy');

            var treatingPhyProf = '';

            if ($scope.doctorInfo) {
                if ($scope.doctorInfo.profession || $scope.doctorInfo.otherprofessiontext) {
                    treatingPhyProf = $scope.getProfession($scope.doctorInfo.profession, $scope.doctorInfo.otherprofessiontext);
                }
                var header = $filter('capitalize')($scope.doctorInfo.firstname) + "&nbsp;" + $filter('capitalize')($scope.doctorInfo.lastname) + "&nbsp;" + treatingPhyProf + "<br />" + $scope.setAddress();
                var footer = "Patient: " + $scope.report.data.bginfo.lastname + ",&nbsp;" + $scope.report.data.bginfo.firstname + "<br/>Treating Provider: " + $scope.doctorInfo.firstname + "&nbsp;" + $scope.doctorInfo.lastname + ", " + treatingPhyProf + "<br/>Date of Exam: " + currentexamdate;

            } else {
                var header = "<br />" + $scope.setAddress();
                var footer = "Patient: " + $scope.report.data.bginfo.lastname + ",&nbsp;" + $scope.report.data.bginfo.firstname + "<br/>Date of Exam: " + currentexamdate;
            }
			
			try{
				switch($cookies.formType)
				{
					case 'dfr':
					{
						if($rootScope.currentUser.practiceDetails.enable_report_docx_header_dfr==false)
							header='';						             
						if($rootScope.currentUser.practiceDetails.enable_report_docx_footer_dfr==false)
							footer='';						             
					}                                                   
					case 'pr2':                                          
					{                                                   
						if($rootScope.currentUser.practiceDetails.enable_report_docx_header_pr2==false)
							header='';						             
						if($rootScope.currentUser.practiceDetails.enable_report_docx_footer_pr2==false)
							footer='';                                   
					}                                                    
					case 'pr4':                                          
					{                                                    
						if($rootScope.currentUser.practiceDetails.enable_report_docx_header_pr4==false)
							header='';						             
						if($rootScope.currentUser.practiceDetails.enable_report_docx_footer_pr4==false)
							footer='';
					}
				}				
                /*if($rootScope.currentUser.practiceDetails.enable_docx_header==false){
                    header='';
                }
                if($rootScope.currentUser.practiceDetails.enable_docx_footer==false){
                    footer='';
                }*/
            }catch(err){
                //console.log(err);
            }

            var filename = $filter('uppercase')($scope.formtype) + "_Report_" + $scope.report.data.bginfo.firstname + "_" + $scope.report.data.bginfo.lastname + ".doc";

			//content='text/html; charset=iso-8859-1'
			
            $scope.docContent = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'> <head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><title></title> <!--[if gte mso 9]> <xml> <w:WordDocument> <w:View>Print</w:View> <w:Zoom>90</w:Zoom> <w:DoNotOptimizeForBrowser/> </w:WordDocument> </xml> <![endif]--> <style> p.MsoFooter, li.MsoFooter, div.MsoFooter { margin:0in; margin-bottom:.0001pt; mso-pagination:widow-orphan; tab-stops:center 3.0in right 6.0in; font-size:12.0pt; } <style> <!-- /* Style Definitions */ @page Section1 { size:8.5in 11.0in; margin:0.50in 0.50in 0.50in 0.50in; mso-header-margin:.3in; mso-header:h1; mso-footer: f1; mso-footer-margin:.3in; } div.Section1 { page:Section1; } table#hrdftrtbl { margin:0in 0in 0in 9in; } --> </style></head> <body lang=EN-US style='tab-interval:.5in'> <div class=Section1> " + content + " <table id='hrdftrtbl' border='1' cellspacing='0' cellpadding='0'> <tr><td> <div style='mso-element:header' id=h1 > <p class=MsoHeader style='text-align:center'>" + header + "</p> </div> </td> <td style='text-align:center'> <div style='mso-element:footer' id=f1> <p class=MsoFooter style='text-align:right; font-size:13px;'>" + footer + "</p><p class=MsoFooter align=center style='text-align:center'><span style='mso-tab-count:2;'></span>Page <span style='mso-field-code:\" PAGE \"'></span> of <span style='mso-field-code:\" NUMPAGES \"'></span></p></div></td></tr></table></body></html>";

            if ($scope.isSafari) {

                downloadReportSafari.save({ 'content': $scope.docContent, 'filename': filename }).$promise.then(function (response) {
                    var popup = window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");
                    //var popup = window.open("/views/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");
                   
                    if (popup == undefined) {
                        alert('Please disable your popup blocker');
                    }
                });

            } else {

                blobs.push($scope.docContent);

                var blob = new Blob(blobs, {
                    type: "application/msword"
                });

                saveAs(blob, filename);
            }

        };

        $scope.openWindow = function () {
            //alert('test');
            //window.open("/views/partials/reports/DFR_Report_Ishant_Sharma.doc", "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");

        };

        $scope.replaceAll = function (string, find, replace) {
            return string.replace(new RegExp(find, 'g'), replace);
        }


        $scope.downloadDocx1 = function () {

            var content = document.getElementById('reportHtmlData').innerHTML;
            var Childblobs = document.getElementById('reportHtmlData').getElementsByClassName("divMain");
            for (var i = 0; i < Childblobs.length; i++) {
                var element = Childblobs[i].innerHTML;
                var replaceText = $scope.replaceAll(element, '<div', '<span');
                replaceText = $scope.replaceAll(replaceText, '</div>', '</span>')
                content = content.replace(element, replaceText);
            }

            var fullContent = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'> <head><title></title><meta http-equiv='Content-Type' content='text/html; charset=utf-8'/> <!--[if gte mso 9]> <xml> <w:WordDocument> <w:View>Print</w:View> <w:Zoom>90</w:Zoom> <w:DoNotOptimizeForBrowser/> </w:WordDocument> </xml> <![endif]--> <style> p.MsoFooter, li.MsoFooter, div.MsoFooter { margin:0in; margin-bottom:.0001pt; mso-pagination:widow-orphan; tab-stops:center 3.0in right 6.0in; font-size:12.0pt; } <style> <!-- /* Style Definitions */ @page Section1 { size:8.5in 11.0in; margin:0.50in 0.50in 0.50in 0.50in; mso-header-margin:.5in; mso-header:h1; mso-footer: f1; mso-footer-margin:.5in; } div.Section1 { page:Section1; } table#hrdftrtbl { margin:0in 0in 0in 9in; } --> </style></head> <body lang=EN-US style='tab-interval:.5in'> <div class=Section1> " + content + " <table id='hrdftrtbl' border='1' cellspacing='0' cellpadding='0'> <tr><td> <div style='mso-element:header' id=h1 > <p class=MsoHeader style='text-align:center'>Confidential</p> </div> </td> <td> <div style='mso-element:footer' id=f1> <p class=MsoFooter>Draft <span style=mso-tab-count:2'></span><span style='mso-field-code:\" PAGE \"'></span> of <span style='mso-field-code:\" NUMPAGES \"'></span></p></div> /td></tr> </table> </body></html>";

            var converted = htmlDocx.asBlob(fullContent);
            var filename = $filter('uppercase')($scope.formtype) + " Report " + $scope.report.data.bginfo.firstname + " " + $scope.report.data.bginfo.lastname + ".docx";
            saveAs(converted, filename);


        };

        $scope.downloadPdf = function () {
           
            /*var html = document.getElementById('reportHtmlData').innerHTML;
            //var html = 'test';
            var pdf = new jsPDF('p', 'pt', 'letter')

	                // source can be HTML-formatted string, or a reference
	                // to an actual DOM element from which the text will be scraped.
	                , source = html

	                // we support special element handlers. Register them with jQuery-style 
	                // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
	                // There is no support for any other type of selectors 
	                // (class, of compound) at this time.
	                , specialElementHandlers = {
	                    // element with id of "bypass" - jQuery style selector
	                    '#bypassme': function (element, renderer) {
	                        // true = "handled elsewhere, bypass text extraction"
	                        return true
	                    }
	                }

            var margins = {
                top: 80,
                bottom: 60,
                left: 40,
                width: 522
            };
            // all coords and widths are in jsPDF instance's declared units
            // 'inches' in this case
            pdf.fromHTML(
                source // HTML string or DOM elem ref.
                , margins.left // x coord
                , margins.top // y coord
                , {
                    'width': margins.width // max width of content on PDF
                    , 'elementHandlers': specialElementHandlers
                },
                function (dispose) {
                    // dispose: object with X, Y of the last line add to the PDF 
                    //          this allow the insertion of new lines after html
                    pdf.save('Test.pdf');
                },
                margins
            )*/
        };

        $scope.currentUser = $rootScope.currentUser;
        $scope.currentUserid = $rootScope.currentUser.id;
        $scope.currentUserlevel = $rootScope.currentUser.role;
        $scope.currentUsername = $rootScope.currentUser.practicename;
        $scope.currentReportStatus = $rootScope.currentReportStatus;

        //Check free report
        $scope.submittedReportcount = submittedreportcount;
       
        //if ($scope.submittedReportcount >= 2 && $scope.formtype !='dfr' && $scope.formtype !='pr4') {
        if ($scope.submittedReportcount >= 2) {
            $scope.freereportsLeft = 0;
        } else {
            $scope.freereportsLeft = 1;
        }


        //if ($scope.submittedReportcount == 'null') {
        //    $scope.freereportsLeft = 0;
        //}
        //else {
        //    if ($scope.submittedReportcount) {
        //        if ($scope.submittedReportcount >= 2) {
        //            $scope.freereportsLeft = $scope.submittedReportcount;
        //            $scope.reportsCharged = true;
        //            $scope.freereportsLeft = 0;
        //        }
        //        else {
        //            $scope.freereportsLeft = 2 - $scope.submittedReportcount;
        //            $scope.reportsLeft = true;
        //        }
        //    }
        //    else {
        //        $scope.freereportsLeft = 0;
        //        $scope.reportsLeft = true;
        //    }
        //}
        //End of check free Report

        $scope.close = function () {
            $modalInstance.close(false);
        };

        $scope.ok = function () {
            $modalInstance.close('submit');
        };

        getdatafromAPI.query({ currentuserid: $scope.currentUsername, currentuserlevel: $scope.currentUserlevel }, function (response) {
            if (response[0]) {
                $scope.practices = response[0].userList;

                for (var i = 0; i < $scope.practices.length; i++) {
                    if ($scope.practices[i]._id == $scope.report.data['patientcomplaints'].treatphynamedropdown) {
                        $scope.treatingPhysicianName = $scope.practices[i].firstname + ' ' + $scope.practices[i].lastname;
                        $scope.treatingPhysicianProfession = $scope.practices[i].profession;
                    }
                }

            }
        });


        if ($scope.report.data['patientcomplaints'].cliniclocation)
            $scope.treatingPhysicianClinicLocation = $scope.report.data['patientcomplaints'].cliniclocation;

        //Personal Signature and Letter head
        //if ($scope.report.data['patientcomplaints'].treatphynamedropdown) {
        //    $scope.treatphynamedropdownId = $scope.report.data['patientcomplaints'].treatphynamedropdown;
        //    if ($scope.treatphynamedropdownId) {
        //        currentLoggedinUserdata.query({ userid: $scope.treatphynamedropdownId }, function (response) {

        //        }).$promise.then(function (response) {

        //            $scope.treatingphyFirstname = response[0].userData[0].firstname;
        //            $scope.treatingphyLastname = response[0].userData[0].lastname;
        //            $scope.treatingphyLicensenumber = response[0].userData[0].licensenumber;
        //            $scope.treatingphyProfession = response[0].userData[0].profession;
        //            $scope.treatingphyPersonalsignature = response[0].userData[0].personalsignature;
        //            // Upload Personal Signature
        //            if ($scope.treatingphyPersonalsignature) {
        //                var data = {
        //                    id: $scope.treatingphyPersonalsignature
        //                };

        //                UpdateSignature.getLogo().query(data, function (res) {
        //                    $scope.signature_img = 'data:image/jpeg;base64,' + res.data;
        //                });
        //            }
        //            PracticeGetDataByName.query({ practicename: $rootScope.currentUser.practicename }, function (response) {

        //            }).$promise.then(function (response) {

        //                $scope.treatingphyPhonenumber = response[0].practices[0].phonenumber;
        //                $scope.treatingphyLetterhead = response[0].practices[0].letterhead;
        //                if ($scope.treatingphyLetterhead) {
        //                    var data = {
        //                        id: $scope.treatingphyLetterhead
        //                    }
        //                    Practices.getLogo().query(data, function (res) {

        //                        $scope.letterhead_img = 'data:image/jpeg;base64,' + res.data;
        //                    });
        //                }
        //            });
        //        });
        //    }
        //}

        //$scope.downloadpdf = function () {
        //    var blob = new Blob([document.getElementById('reportHtmlData').innerHTML], {
        //        type: "application/pdf"
        //    });
      
        //    var doc = new jsPDF();
       
        //    doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
        //    doc.text(20, 20, '<h1> sd</h1>Do you like that?');
        //    //doc.save('Test.pdf');
        //    // Making Data URI
        //    var out = doc.output();
        //    var url = 'data:application/pdf;base64,' + Base64.encode(out);
        //    document.location.href = url;
        //    //saveAs(blob, "Report.pdf");
        //};


        $scope.compiledReportdata = function () {
            //$scope.CompiledHtml = $interpolate($scope.currentreport)($scope);
            //$scope.CompiledHtml = $interpolate('<p>tesadsadhjsadbjksadbjk</p>');

            //$scope.FinalCompiled = $compile($scope.CompiledHtml)($scope);
        };
        //var content = $scope.CompiledHtml;
        //var blob = new Blob([content], { Type: 'application/doc' });
        //$scope.url = (window.URL || window.webkitURL).createObjectURL(blob);

        $scope.download = function (resource) {
            window.open(resource);
        };
       
        $scope.report = (report);

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.displayBodyPartName = function (bodypart) {

            var bodyPartName;

            if (bodypart) {
                if (bodypart.text == 'other' || bodypart.text == 'Other') {
                    if (bodypart.bdpartother) {
                        bodyPartName = $filter('capitalize')(bodypart.bdpartother);
                    }
                } else {
                    bodyPartName = bodypart.text;
                }

                if (bodypart.bodysystem == 'Spine') {
                    bodyPartName = bodyPartName + ' Spine';
                }

                if (bodypart.bodysystem == 'Skin') {
                    bodyPartName = 'Skin - ' + bodyPartName;
                }

                if (bodypart.bdsides != 'none' && bodypart.bdsides != 'n/a') {
                    bodyPartName = bodyPartName + ' - ' + $filter('capitalize')(bodypart.bdsides);
                }
            }
            return bodyPartName;
        };

        $scope.getLowerCase = function (data) {
            var lowerSection = data.toLowerCase();
            return lowerSection;
        };

        $scope.findChangeInTreatment = function (data) {
            var status = false;

            $.each(data, function (index, item) {
                if (report.data['treatment' + item.id]) {
                    if (report.data['treatment' + item.id]['treatcurrentradio']) {
                        if (report.data['treatment' + item.id]['treatcurrentradio'] == 'Yes') {
                            status = true;
                        }
                    }
                } else if (report.data['treatment' + item.id + item.bdsides]) {
                    if (report.data['treatment' + item.id + item.bdsides]['treatcurrentradio']) {
                        if (report.data['treatment' + item.id + item.bdsides]['treatcurrentradio'] == 'Yes') {
                            status = true;
                        }
                    }
                }
            });
            return status;
        };

        $scope.findNeedForReferral = function (data) {

            var status = false;

            $.each(data, function (index, item) {

                if (report.data['treatment' + item.id]) {
                    if (report.data['treatment' + item.id]['treatmentreferral']) {
                        if (report.data['treatment' + item.id]['treatmentreferral'].length > 0) {
                            status = true;
                        }
                    }
                } else if (report.data['treatment' + item.id + item.bdsides]) {
                    if (report.data['treatment' + item.id + item.bdsides]['treatmentreferral']) {
                        if (report.data['treatment' + item.id + item.bdsides]['treatmentreferral'].length > 0) {
                            status = true;
                        }
                    }
                }
            });
            return status;
        };

        $scope.findChangeInPC = function (data) {
            var status = false;

            $.each(data, function (index, item) {
                if (report.data['patientcomplaints' + item.id]) {
                    if (report.data['patientcomplaints' + item.id]['disableradio']) {
                        if (report.data['patientcomplaints' + item.id]['disableradio'] == 'Yes') {
                            status = true;
                        }
                    }
                } else if (report.data['patientcomplaints' + item.id + item.bdsides]) {
                    if (report.data['patientcomplaints' + item.id + item.bdsides]['disableradio']) {
                        if (report.data['patientcomplaints' + item.id + item.bdsides]['disableradio'] == 'Yes') {
                            status = true;
                        }
                    }
                }
            });
            return status;
        };

        $scope.diagnosesCoverpage = function () {

            $scope.diagnosesValue = "";
            $scope.isarray = false;
            var checkIn = ['diagnoses', 'diagnoseshandleft', 'diagnoseshandright'];

            // first it will check in main diagnoses form and subsections
            for (var j = 0; j < checkIn.length; j++) {

                if (report.data[checkIn[j]]) {
                    angular.forEach(report.data[checkIn[j]], function (value, key) {
                        if (!$scope.diagnosesValue) {
                            if (value && value.length > 0) {

                                $scope.diagnosesValue = value;
                                $scope.isarray = angular.isArray($scope.diagnosesValue);
                                return value;
                            }
                        }
                    });
                }
            }
            // check in body part
            if (!$scope.diagnosesValue) {
                for (var i = 0; i < report.data.selectinjuries.concatedbodypart.length; i++) {
                    var bodypart = report.data.selectinjuries.concatedbodypart[i];

                    if (report.data['diagnoses' + bodypart.concateId]) {
                        angular.forEach(report.data['diagnoses' + bodypart.concateId], function (value, key) {

                            if (!$scope.diagnosesValue) {
                                if (value && value.length > 0) {

                                    $scope.diagnosesValue = value;
                                    $scope.isarray = angular.isArray($scope.diagnosesValue);
                                    return value;
                                }
                            }
                        });
                    }
                }
            }

        };

        $scope.diagnosesCheck = function () {

            if ($scope.report) {
                var returnValue = false;
                var checkIn = ['diagnoses', 'diagnoseshandleft', 'diagnoseshandright'];

                // first it will check in main diagnoses form and subsections
                for (var j = 0; j < checkIn.length; j++) {

                    if ($scope.report.data[checkIn[j]]) {
                        angular.forEach($scope.report.data[checkIn[j]], function (value, key) {
                            if (!returnValue) {
                                if (value && value.length > 0) {
                                    returnValue = true;
                                }
                            }
                        });
                    }
                }
                // check in body part
                if (!returnValue) {

                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            if ($scope.report.data['diagnoses' + bodypart.concateId]) {
                                angular.forEach($scope.report.data['diagnoses' + bodypart.concateId], function (value, key) {

                                    if (!returnValue) {
                                        if (value && value.length > 0) {
                                            returnValue = true;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
                return returnValue;
            }
        };

        $scope.diagnosesCheckPr2 = function () {
            if ($scope.report) {
                var returnValue = false;
                var checkIn = ['diagnoses', 'diagnoseshandleft', 'diagnoseshandright'];
				var treatmentPresent=false;

                // first it will check in main diagnoses form and subsections
                for (var j = 0; j < checkIn.length; j++) {
                    if ($scope.report.data[checkIn[j]]) {
                        angular.forEach($scope.report.data[checkIn[j]], function (value, key) {
                            if (!returnValue) {
                                if ((value && value.length > 0) && ($scope.report.data[checkIn[j]].disableradio != 1 && $scope.report.data[checkIn[j]].disableradio != 'No')) {
                                    returnValue = true;
                                }
                            }
                        });
                    }
                }
                // check in body part
                if (!returnValue) {

                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            //if ($scope.report.data['diagnoses' + bodypart.concateId].disableradio && $scope.report.data['diagnoses' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnoses' + bodypart.concateId].disableradio != 'No') {
                            //Check in treatment section first
							if ($scope.report.data['treatment' + bodypart.concateId]) {
                                angular.forEach($scope.report.data['treatment' + bodypart.concateId], function (value, key) {

                                    if (!returnValue) {
                                        if ((value && value.length > 0) && ($scope.report.data['treatment' + bodypart.concateId].disableradio != 1 && $scope.report.data['treatment' + bodypart.concateId].disableradio != 'No')) {
                                            treatmentPresent = true;
                                        }
                                    }
                                });
                            }
							
							if(treatmentPresent)
							{
								if ($scope.report.data['diagnoses' + bodypart.concateId]) {
                                angular.forEach($scope.report.data['diagnoses' + bodypart.concateId], function (value, key) {

                                    if (!returnValue) {
                                        if (value && value.length > 0) {
                                            returnValue = true;
                                        }
                                    }
                                });
								}
							}
							else
							{
								if ($scope.report.data['diagnoses' + bodypart.concateId]) {
									angular.forEach($scope.report.data['diagnoses' + bodypart.concateId], function (value, key) {

										if (!returnValue) {
											if ((value && value.length > 0) && ($scope.report.data['diagnoses' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnoses' + bodypart.concateId].disableradio != 'No')) {
												returnValue = true;
											}
										}
									});
								}
                            }
							//}
                        }
                    }
                }
                return returnValue;
            }
        };

        $scope.diagnosesHandsCheckPr2 = function (side) {
            if ($scope.report) {
                var returnValue = false;
                var checkIn = 'diagnoseshand' + side;

                if ($scope.report.data[checkIn]) {
                    angular.forEach($scope.report.data[checkIn], function (value, key) {
                        if (!returnValue) {
                            if ((value && value.length > 0) && ($scope.report.data[checkIn].disableradio != 1 && $scope.report.data[checkIn].disableradio != 'No')) {
                                returnValue = true;
                            }
                        }
                    });
                }
                return returnValue;
            }
        };

        $scope.checkImpairmentExist = function (item, section) {
            if ($scope) {
                if ($scope.report) {
                    if ($scope.report.data[section + item.concateId]) {
                        if ($scope.report.data[section + item.concateId].txtUsrInput.length > 0 || $scope.report.data[section + item.concateId].txtAlmaraz.toString().length > 0 || $scope.report.data[section + item.concateId].txtAlmarazWPI.toString().length > 0) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };

        $scope.checkImpairmentExistAll = function () {
            if ($scope) {
                if ($scope.report) {
                    if ($scope.report.data) {
                        if ($scope.report.data.selectinjuries) {
                            if ($scope.report.data.selectinjuries.concatedbodypart) {
                                for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                    var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                                    if ($scope.report.data['impairmentrating' + bodypart.concateId]) {
                                     
                                        if (typeof ($scope.report.data['impairmentrating' + bodypart.concateId].txtUsrInput) != 'undefined') {
                                            if ($scope.report.data['impairmentrating' + bodypart.concateId].txtUsrInput.length > 0) {
                                                return true;
                                            }
                                        }
                                        if (typeof ($scope.report.data['impairmentrating' + bodypart.concateId].txtUsrInput) != 'undefined') {
                                            if ($scope.report.data['impairmentrating' + bodypart.concateId].txtAlmaraz.toString().length > 0) {
                                                return true;
                                            }
                                        }
                                        if (typeof ($scope.report.data['impairmentrating' + bodypart.concateId].txtUsrInput) != 'undefined') {
                                            if ($scope.report.data['impairmentrating' + bodypart.concateId].txtAlmarazWPI.toString().length > 0) {
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if ($scope.report.data['impairmentratingfinalclaim']) {
                            if (typeof ($scope.report.data['impairmentratingfinalclaim'].txtUsrInput) != 'undefined') {
                                if ($scope.report.data['impairmentratingfinalclaim'].txtUsrInput.length > 0) {
                                    return true;
                                }
                            }
                            if (typeof ($scope.report.data['impairmentratingfinalclaim'].txtUsrInput) != 'undefined') {
                                if ($scope.report.data['impairmentratingfinalclaim'].txtAlmaraz.toString().length > 0) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        };

        $scope.showImpairmentPublish = function (item) {
            if ($rootScope.currentUser.role != 'rater1' && $rootScope.currentUser.role != 'rater2')
                return true;
            else {
                if (item.dateOfRating != '' && item.ratebodyYesNoRadio == 'Yes')
                    return true;
                else
                    return false;
            }

        }

        $scope.addNums = function (num1, num2) {
            var a, b;
            if (num1 == '')
                a = 0;
            else
                a = parseInt(num1);

            if (num2 == '')
                b = 0;
            else
                b = parseInt(num2);
            return Math.abs(a + b).toString() + '%';
        };

        $scope.getSpeciality = function (speciality) {

            if (speciality) {
                var ret_text = '';


                if (speciality.length == 1) {

                    ret_text = speciality[0].name + '.';
                }
                if (speciality.length > 1) {
                    for (var k = 0; k < speciality.length; k++) {

                        if (speciality[k].name) {

                            if (k == speciality.length - 1) {
                                ret_text = ret_text + speciality[k].name;
                            }
                            if (k != speciality.length - 1) {
                                ret_text = ret_text + speciality[k].name + ', ';
                            }
                        }
                    }
                }

                return ret_text;

            }

        };

        $scope.getProfession = function (data, otherprof) {
            if (data) {
                var ret_text = '';

                if (data.length == 1) {
                    if (data[0] != 'other') {
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

        //Storing practice name from rootscope to display in RFA report
        $scope.mypracticename = $rootScope.currentUser.practicename;

        //Function to split the practice address into city, street, etc.
        $scope.getPracticeAdd = function (i) {
            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data['patientcomplaints']) {
                        if ($scope.report.data['patientcomplaints'].cliniclocation) {

                            var clinicLocation = $scope.report.data['patientcomplaints'].cliniclocation;
                            var addressArray = clinicLocation.split(",");
                            if (i) {
                                return addressArray[i];
                            } else {
                                return addressArray[0];
                            }

                        }
                    }
                }
            }
        }

        //Functions to get diagnoses text and ICD codes in RFA       

        $scope.getDiagnosesText = function (text) {
           
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';

            var arrIDs = [];
            var arrText = [];

            /*angular.forEach(text, function (value, key) {
                if (key == 'disableradio') {
                    if (value == 'Yes')
                        flag = true;
                    else if (value != 'Yes')
                        flag = false;
                }
            });*/

            if (flag) {
                angular.forEach(text, function (value, key) {
                    if (value.length > 0 && value.indexOf('<p>') == -1 && value.indexOf('Industrial') == -1 && value.indexOf('Non-industrial') == -1){// && key != 'disableradio') {
                        arrIDs.push(key);
                        arrText.push(value);
                    }
                });

                //arrIDs.reverse();
                //arrText.reverse();

                for (var j = 0; j < arrText.length; j++) {
                    if ($scope.checkArray(arrText[j]).length > 1) {
                        var diagnosesName = '';
                        var icdCode = '';
                        var textArray = $scope.checkArray(arrText[j]).split(' ');
                        for (var i = 0; i < textArray.length; i++) {
                            if (isNaN(textArray[i].substr(0, 1)))
                                diagnosesName += textArray[i] + ' ';
                            if (diagnosesName.indexOf('.') > -1)
                                diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));
                            if (diagnosesName != '')
                                diagnosesName = diagnosesName + '<br/>';
                            else {
                                icdCode = textArray[i];
                            }
                        }
                    }
                }
                return diagnosesName;
            }
            else
                diagnosesName = '';
            return diagnosesName;
        }

        $scope.getDiagnosesTextV2 = function (text) {
          
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';

            var arrIDs = [];
            var arrText = [];

            /*angular.forEach(text, function (value, key) {
                if (key == 'disableradio') {
                    if (value == 'Yes')
                        flag = true;
                    else if (value != 'Yes')
                        flag = false;
                }
            });*/

            if (flag) {
                angular.forEach(text, function (value, key) {
                    if (value.length > 0 && value.indexOf('<p>') == -1 && key.indexOf('rdo') == -1){// && key != 'disableradio') {
                        arrIDs.push(key);
                        arrText.push(value);
                    }
                });

                //arrIDs.reverse();
                //arrText.reverse();

                //var textArray = $scope.checkArray(arrText[0]).split(' ICD');
                //	diagnosesName = textArray[0];
                //	if (diagnosesName.indexOf('.') > -1)
                //		diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));		

                var flag = false;
                for (var i = 0; i < arrText.length; i++) {
                    if (!flag) {
                        var textArray = $scope.checkArray(arrText[i]).split(' ICD');
                        diagnosesName = diagnosesName + textArray[0];
                        if (diagnosesName.indexOf('.') > -1)
                            diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));
                        if (diagnosesName != '')
                            diagnosesName = diagnosesName + '<br/>';
                        //flag=true;	
                    }
                }
            }
            else
                diagnosesName = '';
            return diagnosesName;
        }

        $scope.getDiagnosesTextSkin = function (text) {
         
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';

            var arrIDs = [];
            var arrText = [];

            /*angular.forEach(text, function (value, key) {
                if (key == 'disableradio') {
                    if (value == 'Yes')
                        flag = true;
                    else if (value != 'Yes')
                        flag = false;
                }
            });*/

            if (flag) {
                angular.forEach(text, function (value, key) {
                    if (value.length > 0 && value.indexOf('<p>') == -1 && key.indexOf('rdo') == -1 && value != 'Industrial' && value != 'Non-industrial'){// && key != 'disableradio') {
                        arrIDs.push(key);
                        arrText.push(value);
                    }
                });

                //arrIDs.reverse();
                //arrText.reverse();

                //var textArray = $scope.checkArray(arrText[0]).split(' ICD');
                //	diagnosesName = textArray[0];
                //	if (diagnosesName.indexOf('.') > -1)
                //		diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));		

                var flag = false;
                for (var i = 0; i < arrText.length; i++) {
                    if (!flag) {
                        if ($scope.checkArray(arrText[i]).indexOf('ICD') > -1) {
                            var textArray = $scope.checkArray(arrText[i]).split(' ICD');
                            diagnosesName = diagnosesName + textArray[0];
                            if (diagnosesName.indexOf('.') > -1)
                                diagnosesName = diagnosesName.substring(0, diagnosesName.lastIndexOf('.'));
                            if (diagnosesName != '')
                                diagnosesName = diagnosesName + '<br/>';
                            //flag=true;	
                        }
                    }
                }
            }
            else
                diagnosesName = '';
            return diagnosesName;
        }        

        $scope.getDiagnosesICDCode = function (text) {
           
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';

            var arrIDs = [];
            var arrText = [];

            /*angular.forEach(text, function (value, key) {
                if (key == 'disableradio') {
                    if (value == 'Yes')
                        flag = true;
                    else if (value != 'Yes')
                        flag = false;
                }
            });*/

            if (flag) {
                angular.forEach(text, function (value, key) {
                    if (value.length > 0 && value.indexOf('<p>') == -1 && value.indexOf('Industrial') == -1 && value.indexOf('Non-industrial') == -1){//} && key != 'disableradio') {
                        arrIDs.push(key);
                        arrText.push(value);
                    }
                });

                //arrIDs.reverse();
                //arrText.reverse();

                for (var j = 0; j < arrText.length; j++) {
                    if ($scope.checkArray(arrText[j]).length > 1) {
                        var diagnosesName = '';
                        var icdCode = '';
                        var textArray = $scope.checkArray(arrText[j]).split(' ');
                        for (var i = 0; i < textArray.length; i++) {
                            if (isNaN(textArray[i].substr(0, 1)))
                                diagnosesName += textArray[i] + ' ';
                            else {
                                icdCode = textArray[i];
                                if (icdCode.indexOf('.') > -1)
                                    icdCode = icdCode.substring(0, icdCode.lastIndexOf('.'));
                                icdCode = icdCode + '<br/>';
                            }
                        }
                    }
                }
                return icdCode;
            }
            else
                icdCode = '';
            return icdCode;
        }

        $scope.getDiagnosesICDCodeV2 = function (text) {
           
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';

            var arrIDs = [];
            var arrText = [];

            /*angular.forEach(text, function (value, key) {
                if (key == 'disableradio') {
                    if (value == 'Yes')
                        flag = true;
                    else if (value != 'Yes')
                        flag = false;
                }
            });*/

            if (flag) {
                angular.forEach(text, function (value, key) {
                    if (value.length > 0 && value.indexOf('<p>') == -1){//} && key != 'disableradio') {
                        arrIDs.push(key);
                        arrText.push(value);
                    }
                });

                //arrIDs.reverse();
                //arrText.reverse();

                var textArray;

                //if(arrIDs[0].substr(3)==arrIDs[1].substr(3))
                //	textArray = $scope.checkArray(arrText[0]);
                //else
                //	textArray = $scope.checkArray(arrText[1]).split(' ICD')[1];

                //icdCode = 'ICD ' + textArray;
                //if (icdCode.indexOf('.') > -1)
                //    icdCode = icdCode.substring(0, icdCode.lastIndexOf('.'));	

                var textArray;
                var flag = false;
                for (var i = 0; i < arrText.length; i++) {
                    if (!flag) {
                        if ($scope.checkArray(arrText[i]).indexOf('ICD') > -1) {
                            if ($scope.checkArray(arrIDs[i]).indexOf('chk') > -1) {
                                textArray = $scope.checkArray(arrText[i]).split(' ICD');
                                icdCode = icdCode + 'ICD ' + textArray[1];
                                icdCode = icdCode + '<br/>';
                                //flag=true;
                            }
                            else if ($scope.checkArray(arrIDs[i]).indexOf('rdo') > -1) {
                                textArray = $scope.checkArray(arrText[i]);
                                icdCode = icdCode + textArray;
                                icdCode = icdCode + '<br/>';
                                //flag=true;
                            }
                        }
                    }
                }
            }
            else
                icdCode = '';
            //icdCode='ICD code: ' + icdCode + '<br/><br/><br/> \n End';
            return icdCode;

            //icdCode='ICD code:&nbsp;' + icdCode + '<br/>End';
            //var htmlObject = document.createElement('div');
            //htmlObject.innerHTML = '<p>' + icdCode + '</p>';
           
            //return 	htmlObject.innerHTML;	
        }

        $scope.getDiagnosesICDCodeSkin = function (text) {
           
            var diagnosesName = '';
            var icdCode = '';
            var flag = true;
            var tempID = '';

            var arrIDs = [];
            var arrText = [];

            /*angular.forEach(text, function (value, key) {
                if (key == 'disableradio') {
                    if (value == 'Yes')
                        flag = true;
                    else if (value != 'Yes')
                        flag = false;
                }
            });*/

            if (flag) {
                angular.forEach(text, function (value, key) {
                    if (value.length > 0 && value.indexOf('<p>') == -1 && value != 'Industrial' && value != 'Non-industrial'){// && key != 'disableradio') {
                        arrIDs.push(key);
                        arrText.push(value);
                    }
                });

                //arrIDs.reverse();
                //arrText.reverse();

                var textArray;

                //if(arrIDs[0].substr(3)==arrIDs[1].substr(3))
                //	textArray = $scope.checkArray(arrText[0]);
                //else
                //	textArray = $scope.checkArray(arrText[1]).split(' ICD')[1];

                //icdCode = 'ICD ' + textArray;
                //if (icdCode.indexOf('.') > -1)
                //    icdCode = icdCode.substring(0, icdCode.lastIndexOf('.'));	

                var textArray;
                var flag = false;
                for (var i = 0; i < arrText.length; i++) {
                    if (!flag) {
                        if ($scope.checkArray(arrText[i]).indexOf('ICD') > -1) {
                            textArray = $scope.checkArray(arrText[i]).split(' ICD')[1];
                            icdCode = icdCode + 'ICD' + textArray;
                            icdCode = icdCode + '<br/>';
                            //flag=true;																		
                        }
                    }
                }
            }
            else
                icdCode = '';
            return icdCode;
        }

        /*$scope.isTreatmentInputted = function (bodypart, treatmentarray) {	
			
			var returnval = false;
            if (treatmentarray) {
                angular.forEach(treatmentarray, function (value, key) {					
					if (value['diagnosticnecessary']!='undefined' || value['injectionsnecessary']!='undefined' || value['therapynecessary']!='undefined' || value['referalnecessary']!='undefined' || $scope.report.data['treatment' + bodypart]['tensunitradio'] !='undefined' || $scope.report.data['treatment' + bodypart]['waveradio']!='undefined' || $scope.report.data['treatment' + bodypart]['wheelunititradio']!='undefined' || $scope.report.data['treatment' + bodypart]['durablecraneradio']!='undefined' || $scope.report.data['treatment' + bodypart]['durableCrutch_radio']!='undefined' || $scope.report.data['treatment' + bodypart]['AFO_radio']!='undefined' || $scope.report.data['treatment' + bodypart]['KAFO_radio']!='undefined' || $scope.report.data['treatment' + bodypart]['tenniselbowstrapradiolabel']!='undefined' || $scope.report.data['treatment' + bodypart]['Neoprenestrapradiolabel']!='undefined' || $scope.report.data['treatment' + bodypart]['splintsradio']!='undefined' || $scope.report.data['treatment' + bodypart]['wristsupportradio']!='undefined' || $scope.report.data['treatment' + bodypart]['lumbarsupportradio']!='undefined')
					{									
						if (value['diagnosticnecessary']=='Yes' || value['injectionsnecessary']=='Yes' || value['therapynecessary']=='Yes' || value['referalnecessary']=='Yes' || $scope.report.data['treatment' + bodypart]['tensunitradio']=='Yes' || $scope.report.data['treatment' + bodypart]['waveradio']=='Yes' || $scope.report.data['treatment' + bodypart]['wheelunititradio']=='Yes' || $scope.report.data['treatment' + bodypart]['durablecraneradio']=='Yes' || $scope.report.data['treatment' + bodypart]['durableCrutch_radio']=='Yes' || $scope.report.data['treatment' + bodypart]['AFO_radio']=='Yes' || $scope.report.data['treatment' + bodypart]['KAFO_radio']=='Yes' || $scope.report.data['treatment' + bodypart]['tenniselbowstrapradiolabel']=='Yes' || $scope.report.data['treatment' + bodypart]['Neoprenestrapradiolabel']=='Yes' || $scope.report.data['treatment' + bodypart]['splintsradio']=='Yes' || $scope.report.data['treatment' + bodypart]['wristsupportradio']=='Yes' || $scope.report.data['treatment' + bodypart]['lumbarsupportradio']=='Yes'  )						
							returnval = true;
						else
							returnval = false;
					}
					else
						returnval = true;		
				});
            }
			return returnval;
        };*/

        $scope.isTreatmentInputted = function (bodypart, mediValue, treatmentarray) {
            //var returnval = false;
            if (treatmentarray) {
                //angular.forEach(treatmentarray, function (value, key) {	
                switch (mediValue) {
                    case 'treatmenttherapy':
                        var therapyreturn = false;
                        angular.forEach(treatmentarray, function (value, key) {
                            if (value['therapynecessary'] != 'undefined') {
                                if (value['therapynecessary'] == 'Yes') {
                                    therapyreturn = true;
                                    return therapyreturn;
                                }
                                else
                                    therapyreturn = false;
                            }
                        });
                        return therapyreturn;
                        break;

                    case 'treatmentinjections':
                        var injectionsreturn = false;
                        angular.forEach(treatmentarray, function (value, key) {
                            if (value['injectionsnecessary'] != 'undefined') {
                                if (value['injectionsnecessary'] == 'Yes') {
                                    injectionsreturn = true;
                                    return injectionsreturn;
                                }
                                else
                                    injectionsreturn = false;
                            }
                        });
                        return injectionsreturn;
                        break;

                    case 'treatmentdiagnostic':
                        var diagnosticreturn = false;
                        angular.forEach(treatmentarray, function (value, key) {
                            if (value['diagnosticnecessary'] != 'undefined') {
                                if (value['diagnosticnecessary'] == 'Yes') {
                                    diagnosticreturn = true;
                                    return diagnosticreturn;
                                }
                                else
                                    diagnosticreturn = false;
                            }
                        });
                        return diagnosticreturn;
                        break;

                    case 'treatmentreferral':
                        var referralreturn = false;
                        angular.forEach(treatmentarray, function (value, key) {
                            if (value['referalnecessary'] != 'undefined') {
                                if (value['referalnecessary'] == 'Yes') {
                                    referralreturn = true;
                                    return referralreturn;
                                }
                                else
                                    referralreturn = false;
                            }
                        });
                        return referralreturn;
                        break;

                    case 'durabletensunit':
                        if ($scope.report.data['treatment' + bodypart]['tensunitradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['tensunitradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durablehwaveunit':
                        if ($scope.report.data['treatment' + bodypart]['waveradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['waveradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durablewheelchair':
                        if ($scope.report.data['treatment' + bodypart]['wheelunititradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['wheelunititradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durablecane':
                        if ($scope.report.data['treatment' + bodypart]['durablecaneradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['durablecaneradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durableCrutch':
                        if ($scope.report.data['treatment' + bodypart]['durableCrutch_radio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['durableCrutch_radio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;


                    case 'durableAFO':
                        if ($scope.report.data['treatment' + bodypart]['AFO_radio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['AFO_radio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durableKAFO':
                        if ($scope.report.data['treatment' + bodypart]['KAFO_radio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['KAFO_radio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durabletenniselbowstrap':
                        if ($scope.report.data['treatment' + bodypart]['tenniselbowstrapradiolabel'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['tenniselbowstrapradiolabel'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durableneoprenesleeve':
                        if ($scope.report.data['treatment' + bodypart]['Neoprenestrapradiolabel'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['Neoprenestrapradiolabel'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durablesplints':
                        if ($scope.report.data['treatment' + bodypart]['splintsradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['splintsradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durablewristsupport':
                        if ($scope.report.data['treatment' + bodypart]['wristsupportradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['wristsupportradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durablelumbarsupport':
                        if ($scope.report.data['treatment' + bodypart]['lumbarsupportradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['lumbarsupportradio'] == 'Yes')
                                return true;
                            else
                                return false;
                        }
                        break;

                    case 'durableother':
                        if ($scope.report.data['treatment' + bodypart]['durableotherradio'] != 'undefined') {
                            if ($scope.report.data['treatment' + bodypart]['durableotherradio'] == 'Yes') {
                                if ($scope.report.data['treatment' + bodypart]['txtEquipmentName'] != '') {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                            else
                                return false;
                        }
                        break;

                }

                /*if (value['diagnosticnecessary']!='undefined' || value['injectionsnecessary']!='undefined' || value['therapynecessary']!='undefined' || value['referalnecessary']!='undefined' || $scope.report.data['treatment' + bodypart]['tensunitradio'] !='undefined' || $scope.report.data['treatment' + bodypart]['waveradio']!='undefined' || $scope.report.data['treatment' + bodypart]['wheelunititradio']!='undefined' || $scope.report.data['treatment' + bodypart]['durablecraneradio']!='undefined' || $scope.report.data['treatment' + bodypart]['durableCrutch_radio']!='undefined' || $scope.report.data['treatment' + bodypart]['AFO_radio']!='undefined' || $scope.report.data['treatment' + bodypart]['KAFO_radio']!='undefined' || $scope.report.data['treatment' + bodypart]['tenniselbowstrapradiolabel']!='undefined' || $scope.report.data['treatment' + bodypart]['Neoprenestrapradiolabel']!='undefined' || $scope.report.data['treatment' + bodypart]['splintsradio']!='undefined' || $scope.report.data['treatment' + bodypart]['wristsupportradio']!='undefined' || $scope.report.data['treatment' + bodypart]['lumbarsupportradio']!='undefined')
                {									
                    if (value['diagnosticnecessary']=='Yes' || value['injectionsnecessary']=='Yes' || value['therapynecessary']=='Yes' || value['referalnecessary']=='Yes' || $scope.report.data['treatment' + bodypart]['tensunitradio']=='Yes' || $scope.report.data['treatment' + bodypart]['waveradio']=='Yes' || $scope.report.data['treatment' + bodypart]['wheelunititradio']=='Yes' || $scope.report.data['treatment' + bodypart]['durablecraneradio']=='Yes' || $scope.report.data['treatment' + bodypart]['durableCrutch_radio']=='Yes' || $scope.report.data['treatment' + bodypart]['AFO_radio']=='Yes' || $scope.report.data['treatment' + bodypart]['KAFO_radio']=='Yes' || $scope.report.data['treatment' + bodypart]['tenniselbowstrapradiolabel']=='Yes' || $scope.report.data['treatment' + bodypart]['Neoprenestrapradiolabel']=='Yes' || $scope.report.data['treatment' + bodypart]['splintsradio']=='Yes' || $scope.report.data['treatment' + bodypart]['wristsupportradio']=='Yes' || $scope.report.data['treatment' + bodypart]['lumbarsupportradio']=='Yes'  )						
                        returnval = true;
                    else
                        returnval = false;
                }
                else
                    returnval = true;	*/
                //});
            }
            //return returnval;
        };

        $scope.getDoctordata = function (userid) {

            if (userid) {
                currentLoggedinUserdata.query({ userid: userid }, function (response) {
                    $scope.doctorInfo = response[0].userData[0];
                });
            }
        };

        $scope.dingnosticCoverpage = function () {

            $scope.DTSValue = false;

            var checkIn = ['diagnostictestresults', 'diagnostictestresultslimblength'];

            // first it will check in main diagnoses form and subsections
            for (var j = 0; j < checkIn.length; j++) {

                if (report.data[checkIn[j]]) {
                    angular.forEach(report.data[checkIn[j]], function (value, key) {
                        if (!$scope.diagnosesValue) {
                            if (value && value.length > 0) {
                                $scope.DTSValue = true;
                            }
                        }
                    });
                }
            }

            for (var i = 0; i < report.data.selectinjuries.concatedbodypart.length; i++) {
                var bodypart = report.data.selectinjuries.concatedbodypart[i];

                if (report.data['diagnostictestresults' + bodypart.concateId]) {

                    angular.forEach(report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                        if (!$scope.DTSValue) {
                            if (value && value.length > 0) {
                                $scope.DTSValue = true;
                            }
                        }
                    });
                }
            }
        };

        $scope.diagnosticFullCheck = function () {
            if ($scope.report) {

                var returnValue = false;

                var checkIn = ['diagnostictestresults', 'diagnostictestresultslimblength'];

                // first it will check in main diagnoses form and subsections
                for (var j = 0; j < checkIn.length; j++) {

                    if ($scope.report.data[checkIn[j]]) {
                        angular.forEach($scope.report.data[checkIn[j]], function (value, key) {
                            if (!returnValue) {
                                if (value && value.length > 0) {
                                    returnValue = true;
                                }
                            }
                        });
                    }
                }

                if ($scope.report.data.selectinjuries) {
                    for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                        var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                        if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                            angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                if (!returnValue) {
                                    if (value && value.length > 0) {
                                        returnValue = true;
                                    }
                                }
                            });
                        }
                    }
                }
                return returnValue;
            }
        };

        //Added by Unais dated 31-01-2015 for handling disable radio button for PR2
        $scope.diagnosticFullCheckPr2 = function () {
            if ($scope.report) {

                var returnValue = false;

                var checkIn = ['diagnostictestresults', 'diagnostictestresultslimblength'];

                // first it will check in main diagnoses form and subsections
                for (var j = 0; j < checkIn.length; j++) {

                    if ($scope.report.data[checkIn[j]]) {
                        angular.forEach($scope.report.data[checkIn[j]], function (value, key) {
                            if (!returnValue) {
                                if ((value && value.length > 0) && ($scope.report.data[checkIn[j]].disableradio != 1 && $scope.report.data[checkIn[j]].disableradio != 'No')) {
                                    returnValue = true;
                                }
                            }
                        });
                    }
                }

                if ($scope.report.data.selectinjuries) {
                    for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                        var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                        if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                            angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                if (!returnValue) {
                                    if ((value && value.length > 0) && ($scope.report.data['diagnostictestresults'].disableradio != 1 && $scope.report.data['diagnostictestresults'].disableradio != 'No')) {
                                        returnValue = true;
                                    }
                                }
                            });
                        }
                    }
                }
                return returnValue;
            }
        };

        $scope.diagnosticBodyPartCheck = function (type) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            if (bodypart.bodysystem != 'Skin') {

                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                        if (type == 'xray') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnXrayAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnXrayAddAnother.length > 0) {
                                                    returnValue = true;
                                                }
                                            }
                                        } else if (type == 'mri') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnMriAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnMriAddAnother.length > 0) {
                                                    returnValue = true;
                                                }
                                            }
                                        }
                                        else if (type == 'ctscan') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnCTScanAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnCTScanAddAnother.length > 0) {
                                                    returnValue = true;
                                                }
                                            }
                                        }
                                    });
                                }
                            } else if (bodypart.bodysystem == 'Skin') {

                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                        if (type == 'pathology') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnSkinPathologyAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnSkinPathologyAddAnother.length > 0) {
                                                    returnValue = true;
                                                }
                                            }
                                        } else if (type == 'officebased') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnOfficeBasedAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnOfficeBasedAddAnother.length > 0) {
                                                    returnValue = true;
                                                }
                                            }
                                        }

                                    });
                                }

                            }

                        }
                    }
                }
            }

            return returnValue;
        };

        //Added by Unais dated 31-01-2015 for handling disable radio button for PR2      
        $scope.diagnosticBodyPartCheckPr2 = function (type) {
            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            if($scope.checkIfReadyForRating(bodypart))
                            {
                                if (bodypart.bodysystem != 'Skin') {

                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                        angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                            if (type == 'xray') {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnXrayAddAnother) {
                                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnXrayAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                        returnValue = true;
                                                    }
                                                }
                                            } else if (type == 'mri') {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnMriAddAnother) {
                                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnMriAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                        returnValue = true;
                                                    }
                                                }
                                            }
                                            else if (type == 'ctscan') {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnCTScanAddAnother) {
                                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnCTScanAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                        returnValue = true;
                                                    }
                                                }
                                            }
                                        });
                                    }
                                } else if (bodypart.bodysystem == 'Skin') {

                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                        angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                            if (type == 'pathology') {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnSkinPathologyAddAnother) {
                                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnSkinPathologyAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                        returnValue = true;
                                                    }
                                                }
                                            } else if (type == 'officebased') {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnOfficeBasedAddAnother) {
                                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnOfficeBasedAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                        returnValue = true;
                                                    }
                                                }
                                            }

                                        });
                                    }

                                }
                            }
                        }
                    }
                }
            }

            return returnValue;
        };

        /*$scope.diagnosticBodyPartCheckPr2 = function (type) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            if (bodypart.bodysystem != 'Skin') {

                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                        if (type == 'xray') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnXrayAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnXrayAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                    returnValue = true;
                                                }
                                            }
                                        } else if (type == 'mri') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnMriAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnMriAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                    returnValue = true;
                                                }
                                            }
                                        }
                                        else if (type == 'ctscan') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnCTScanAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnCTScanAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                    returnValue = true;
                                                }
                                            }
                                        }
                                    });
                                }
                            } else if (bodypart.bodysystem == 'Skin') {

                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['diagnostictestresults' + bodypart.concateId], function (value, key) {

                                        if (type == 'pathology') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnSkinPathologyAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnSkinPathologyAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                    returnValue = true;
                                                }
                                            }
                                        } else if (type == 'officebased') {
                                            if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnOfficeBasedAddAnother) {
                                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId].btnOfficeBasedAddAnother.length > 0 && ($scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 1 && $scope.report.data['diagnostictestresults' + bodypart.concateId].disableradio != 'No')) {
                                                    returnValue = true;
                                                }
                                            }
                                        }

                                    });
                                }

                            }
                        }
                    }
                }
            }

            return returnValue;
        };*/

        $scope.diagnosticSkinBodyPartCheck = function () {
            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data.selectinjuries) {
                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                            if (bodypart.bodysystem == 'Skin') {

                                if ($scope.report.data['diagnostictestresults' + bodypart.concateId]) {

                                    if ($scope.report.data['diagnostictestresults' + bodypart.concateId].mainTextA.length > 0) {
                                        returnValue = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return returnValue;
        }


        $scope.checkOnlySectionExist = function (section) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data[section]) {

                        angular.forEach($scope.report.data[section], function (value, key) {

                            if (!returnValue) {
                                if (value && value.length > 0) {
                                    returnValue = true;
                                }
                            }

                        });
                    }
                }
            }

            return returnValue;
        };

        //Added by Unais dated 31-01-2015 for handling disable radio button for PR2
        $scope.checkOnlySectionExistPr2 = function (section) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data[section]) {

                        angular.forEach($scope.report.data[section], function (value, key) {
                            if (!returnValue) {
                                if ((value && value.length > 0) && ($scope.report.data[section].disableradio != 1 && $scope.report.data[section].disableradio != 'No')) {
                                    returnValue = true;
                                }
                            }

                        });
                    }
                }
            }

            return returnValue;
        };

        $scope.checkWholeBDPartExist = function (section) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data.selectinjuries) {

                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            if ($scope.report.data[section + bodypart.concateId]) {
                                angular.forEach($scope.report.data[section + bodypart.concateId], function (value, key) {

                                    if (!returnValue) {
                                        if (key!='treatcurrentradio' && (value && value.length > 0)) {											
											returnValue = true;											                                           
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }

            return returnValue;
        };
		
		$scope.checkWholeBDPartExist2 = function (section, bdpart) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {

                    //if ($scope.report.data.selectinjuries) {

                        //for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            //var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            if ($scope.report.data[section + bdpart.concateId]) {
                                angular.forEach($scope.report.data[section + bdpart.concateId], function (value, key) {

                                    if (!returnValue) {
                                        if (key!='treatcurrentradio' && (value && value.length > 0)) {											
											returnValue = true;											                                           
                                        }
                                    }
                                });
                            }
                        //}
                    //}
                }
            }

            return returnValue;
        };

        //Added by Unais dated 31-01-2015 for handling disable radio button for PR2
        $scope.checkWholeBDPartExistPr2 = function (section) {

            var returnValue = false;

            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data.selectinjuries) {

                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            if ($scope.report.data[section + bodypart.concateId]) {
                                angular.forEach($scope.report.data[section + bodypart.concateId], function (value, key) {

                                    if (!returnValue) {
                                        if ((value && value.length > 0) && ($scope.report.data[section + bodypart.concateId].disableradio != 1 && $scope.report.data[section + bodypart.concateId].disableradio != 'No')) {
                                            returnValue = true;
                                        }
                                    }

                                });
                            }
                        }
                    }
                }
            }

            return returnValue;
        };

        $scope.checkWholeBDPartExistPR2 = function (section) {
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data.selectinjuries) {

                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            if (bodypart.bodysystem != 'Other') {
                                if ($scope.report.data[section + bodypart.concateId]) {
                                    angular.forEach($scope.report.data[section + bodypart.concateId], function (value, key) {
                                        if (!returnValue) {
                                            if (key != 'treatcurrentradio') {
                                                if (value && value.length > 0) {
                                                    returnValue = true;
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }

            return returnValue;
        };

        $scope.objectivefindingsCoverpage = function () {

            $scope.ofValue = false;
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if ($scope.report.data['objectivefindingsgeneral']['OfGeneral'] && $scope.report.data['objectivefindingsgeneral']['OfGeneral'] != 'Choose') {
                            $scope.ofValue = true;
                            returnValue = true;
                        }
                    }
                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindingsgait'], function (value, key) {

                            if (!$scope.OfValue) {
                                if (value && value.length > 0) {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindings'], function (value, key) {

                            if (!$scope.OfValue && key != 'OfTempratureRadio') {
                                if (value && value.length > 0 && value != 'Choose') {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                    if (!$scope.ofValue) {
                        if ($scope.report.data.selectinjuries) {
                            for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                                if ($scope.report.data['objectivefindings' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['objectivefindings' + bodypart.concateId], function (value, key) {
                                        if (!$scope.ofValue) {
                                            if (value && value.length > 0 && value != 'Choose') {
                                                $scope.ofValue = true;
                                                returnValue = true;
                                            }
                                        }
                                    });

                                }
                            }
                        }
                    }
                }
                return returnValue;
            }
        };

        //Added by Unais dated 31-01-2015 for handling disable radio button for PR2
        $scope.objectivefindingsCoverpagePr2 = function () {

            $scope.ofValue = false;
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if (($scope.report.data['objectivefindingsgeneral']['OfGeneral'] && $scope.report.data['objectivefindingsgeneral']['OfGeneral'] != 'Choose') && ($scope.report.data['objectivefindingsgeneral'].disableradio != 1 && $scope.report.data['objectivefindingsgeneral'].disableradio != 'No')) {
                            $scope.ofValue = true;
                            returnValue = true;
                        }
                    }
                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindingsgait'], function (value, key) {

                            if (!$scope.OfValue) {
                                if ((value && value.length > 0) && ($scope.report.data['objectivefindingsgait'].disableradio != 1 && $scope.report.data['objectivefindingsgait'].disableradio != 'No')) {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindings'], function (value, key) {

                            if (!$scope.OfValue && key != 'OfTempratureRadio') {
                                if ((value && value.length > 0 && value != 'Choose')) {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if (($scope.report.data['objectivefindingsgeneral']['objfindingstxtSummary'] && $scope.report.data['objectivefindingsgeneral']['objfindingstxtSummary'] != '') && ($scope.report.data['objectivefindingsgeneral'].disableradio != 1 && $scope.report.data['objectivefindingsgeneral'].disableradio != 'No')) {
                            $scope.ofValue = true;
                            returnValue = true;
                        }
                    }
                    if (!$scope.ofValue) {
                        if ($scope.report.data.selectinjuries) {
                            for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                                if ($scope.report.data['objectivefindings' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['objectivefindings' + bodypart.concateId], function (value, key) {
                                        if (!$scope.ofValue) {
                                            if ((value && value.length > 0 && value != 'Choose') && ($scope.report.data['objectivefindings' + bodypart.concateId].disableradio != 1 && $scope.report.data['objectivefindings' + bodypart.concateId].disableradio != 'No')) {
                                                $scope.ofValue = true;
                                                returnValue = true;
                                            }
                                        }
                                    });

                                }
                            }
                        }
                    }
                }
                return returnValue;
            }
        };
		
		$scope.objectivefindingsCoverpagePr2V4 = function () {

           $scope.ofValue = false;
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if (($scope.report.data['objectivefindingsgeneral']['objfindingsrdoComment'] && $scope.report.data['objectivefindingsgeneral']['objfindingsrdoComment'] != '') && ($scope.report.data['objectivefindingsgeneral'].disableradio != 1 && $scope.report.data['objectivefindingsgeneral'].disableradio != 'No')) {
                            $scope.ofValue = true;
                            returnValue = true;
                        }
                    }
                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindingsgait'], function (value, key) {

                            if (!$scope.OfValue) {
                                if ((value && value.length > 0) && ($scope.report.data['objectivefindingsgait'].disableradio != 1 && $scope.report.data['objectivefindingsgait'].disableradio != 'No')) {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindings'], function (value, key) {

                            if (!$scope.OfValue && key != 'OfTempratureRadio') {
                                if ((value && value.length > 0 && value != 'Choose')) {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if (($scope.report.data['objectivefindingsgeneral']['objfindingstxtSummary'] && $scope.report.data['objectivefindingsgeneral']['objfindingstxtSummary'] != '') && ($scope.report.data['objectivefindingsgeneral'].disableradio != 1 && $scope.report.data['objectivefindingsgeneral'].disableradio != 'No')) {
                            $scope.ofValue = true;
                            returnValue = true;
                        }
                    }
                    if (!$scope.ofValue) {
                        if ($scope.report.data.selectinjuries) {
                            for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                                if ($scope.report.data['objectivefindings' + bodypart.concateId]) {

                                    angular.forEach($scope.report.data['objectivefindings' + bodypart.concateId], function (value, key) {
                                        if (!$scope.ofValue) {
                                            if ((value && value.length > 0 && value != 'Choose') && ($scope.report.data['objectivefindings' + bodypart.concateId].disableradio != 1 && $scope.report.data['objectivefindings' + bodypart.concateId].disableradio != 'No')) {
                                                $scope.ofValue = true;
                                                returnValue = true;
                                            }
                                        }
                                    });

                                }
                            }
                        }
                    }
                }
                return returnValue;
            }
        };

        $scope.objectivefindingsGeneralMain = function () {

            $scope.ofValue = false;
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if ($scope.report.data['objectivefindingsgeneral']['OfGeneral'])
						{
							if ($scope.report.data['objectivefindingsgeneral']['OfGeneral'] && $scope.report.data['objectivefindingsgeneral']['OfGeneral'] != 'Choose') {
								$scope.ofValue = true;
								returnValue = true;
							}
						}	
                    }

                    if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindings'], function (value, key) {

                            if (!$scope.OfValue && key != 'OfTempratureRadio') {
                                if (value && value.length > 0 && value != 'Choose') {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    }
                }
                return returnValue;
            }
        };
		
		$scope.objectivefindingsGeneralMainV4 = function () {

            $scope.ofValue = false;
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data['objectivefindingsgeneral']) {
                        if ($scope.report.data['objectivefindingsgeneral']['OfGeneral'])
						{
							if ($scope.report.data['objectivefindingsgeneral']['OfGeneral'] && $scope.report.data['objectivefindingsgeneral']['OfGeneral'] != 'Choose') {
								$scope.ofValue = true;
								returnValue = true;
							}
						}	
                    }

                    //if (!$scope.ofValue) {
                        angular.forEach($scope.report.data['objectivefindings'], function (value, key) {

                            if (!$scope.OfValue && key != 'OfTempratureRadio') {
                                if (value && value.length > 0 && value != 'Choose') {
                                    $scope.ofValue = true;
                                    returnValue = true;
                                }
                            }
                        });
                    //}
                }
                return returnValue;
            }
        };

        $scope.appendPeriod = function (data) {

            if (data) {
                if (data.length > 0) {

                    var removedPtags = data.replace(/(<p>|<\/p>|&nbsp;)/g, "");
                    var cleanText = data.replace(/<\/?[^>]+(>|$)/g, "");
                    cleanText = cleanText.replace(/&nbsp;/g, '').trim();
                    var lastChar = cleanText.substr(cleanText.length - 1);
                    var form_replacechar = (String(removedPtags).replace(/<[^>]+>/gm, ''));
                    var to_replacechar = form_replacechar.substring(0, 1).toUpperCase() + form_replacechar.substring(1);
                    removedPtags = removedPtags.replace(form_replacechar, to_replacechar);
                    if (lastChar == '.' || lastChar == '!' || lastChar == '?' || removedPtags.trim() == "") {
                        return removedPtags.trim();
                    } else {
                        return removedPtags.trim() + '. ';
                    }
                } else {

                    return data;
                }
            }

            return '';
        };

        $scope.appendPeriodWithoutTrailingSpace = function (data) {

            if (data) {
                if (data.length > 0) {

                    var removedPtags = data.replace(/(<p>|<\/p>|&nbsp;)/g, "");
                    var cleanText = data.replace(/<\/?[^>]+(>|$)/g, "");
                    cleanText = cleanText.replace(/&nbsp;/g, '').trim();
                    var lastChar = cleanText.substr(cleanText.length - 1);
                    var form_replacechar = (String(removedPtags).replace(/<[^>]+>/gm, ''));
                    var to_replacechar = form_replacechar.substring(0, 1).toUpperCase() + form_replacechar.substring(1);
                    removedPtags = removedPtags.replace(form_replacechar, to_replacechar);
                    if (lastChar == '.' || lastChar == '!' || lastChar == '?') {
                        return removedPtags.trim();
                    } else {
                        return removedPtags.trim() + '.';
                    }
                } else {

                    return data;
                }
            }

            return '';
        };

        $scope.checkExist = function (item, section) {

            var isSectiondataExist = false;
            if (report.data[section + item.concateId]) {
                angular.forEach(report.data[section + item.concateId], function (val, k) {

                    if (val.length > 0 && !isSectiondataExist) {
                        isSectiondataExist = true;
                    }
                });

                return isSectiondataExist;
            }
        };

        $scope.checkExistSkin = function (item, section) {

            if ($scope.report) {
                var isSectiondataExist = false;
                if (item.bdsides != 'none' && item.bdsides != '' && item.bdsides != 'n/a') {
                    if ($scope.report.data[section + item.id + item.bdsides]) {
                        if ($scope.report.data[section + item.id + item.bdsides].btnMode == 'Comment' || $scope.report.data[section + item.id + item.bdsides].btnMode == 'Normal') {
                            isSectiondataExist = true;
                            return isSectiondataExist;
                        }
                    }
                }
                else {
                    if ($scope.report.data[section + item.id]) {
                        if ($scope.report.data[section + item.id].btnMode == 'Comment' || $scope.report.data[section + item.id].btnMode == 'Normal') {
                            isSectiondataExist = true;
                            return isSectiondataExist;
                        }
                    }
                }
            }
        };

        $scope.checkExistById = function (item, section, id) {

            if ($scope.report) {
                var isSectiondataExist = false;
                if ($scope.report.data[section + item.concateId]) {

                    angular.forEach($scope.report.data[section + item.concateId], function (val, k) {
                        if ($scope.report.data[section + item.concateId][id]) {
                            if ($scope.report.data[section + item.concateId][id].length > 0 && !isSectiondataExist) {
                                isSectiondataExist = true;
                            }
                        }
                    });

                    return isSectiondataExist;
                }
            }
        };

        $scope.findbodysystem = function (data) {
            return eval("$filter('filter')(report.data['selectinjuries'].sibodypart, { bodysystem: data }).length > 0");
        };

        $scope.findbodypart = function (bdpart) {

            return eval("$filter('filter')(report.data['selectinjuries'].sibodypart, { id: bdpart }).length > 0");
        };

        $scope.checkIfReadyForRating = function (bdpart) {
            
            
            if ($cookies.formType == 'pr4') {
                var j = 0
                if (typeof $scope.report.data.selectinjuries != 'undefined') {
                    //var newdata = $scope.report.data.selectinjuries.sibodypart;

                    //var bdpart = eval("$filter('filter')($scope.report.data['selectinjuries'].sibodypart, { concateId: currentId })");                                       

                    if (bdpart.ratebodypart == true) {
                        if (typeof bdpart.dateOfRating == "undefined" || bdpart.dateOfRating == '') {
                            return false;
                        }
                    }

                    if (typeof bdpart.ratebodyYesNoRadio != "undefined") {
                        if (bdpart.ratebodyYesNoRadio == 'Yes') {
                            return true;
                        }
                    }
                }
                return false;
            }
			else
				return true;
        };
		
		$scope.checkIfReadyForRatingById = function (bdpartid) {
			
            return "($scope.report.data['selectinjuries'].concatedbodypart, {'concateId' : '" + bdpartid + "', 'ratebodyYesNoRadio': 'Yes'}).ratebodyYesNoRadio=='Yes'";
        };

        $scope.getAge = function (dateString) {
            var today = new Date();
            var birthDate = new Date(dateString);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };

        $scope.getCommmaString = function (data) {

            var returnStringArray = new Array();

            $.each(data, function (index, item) {

                if (item.value == true) {
                    returnStringArray.push(item.id);
                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1)
                ret_text = returnStringArray[0].toLowerCase();
            if (returnStringArray.length > 1) {
                for (var k = 0; k < returnStringArray.length; k++) {
                    if (k == returnStringArray.length - 1)
                        ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                    if (k != returnStringArray.length - 1)
                        ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                }
            }

            return ret_text;

        };

        $scope.getdurable = function (data) {
            var appendValue = '';
            if (eval(data) >= 1) {
                appendValue = ' (number of devices used: ' + eval(data) + ')';
            }
            return appendValue;

        };

        $scope.getCommmaStringCheck = function (data) {

            var returnStringArray = new Array();
            var captialValue = ["AFO", "KAFO", "H-Wave unit", "TENS unit"];

            angular.forEach(data, function (value, key) {
                if (value) {
                    if (eval(value).length > 0) {
                        var actualValue = eval(value);
                        var appendValue = '';

                        if (actualValue[0]) {
                            if (actualValue == 'Cane') {
                                appendValue = $scope.getdurable(report.data['relevantmedicalsocialhistory'].durableMedicalCaneSelect);
                            } else if (actualValue == 'Crutch') {

                                appendValue = $scope.getdurable(report.data['relevantmedicalsocialhistory'].durableMedicalCrutchSelect);
                            } else if (actualValue == 'AFO') {
                                appendValue = $scope.getdurable(report.data['relevantmedicalsocialhistory'].durableMedicalAFOSelect);
                            } else if (actualValue == 'KAFO') {
                                appendValue = $scope.getdurable(report.data['relevantmedicalsocialhistory'].durableMedicalKAFOSelect);
                            }
                        }
                        if (captialValue.indexOf(actualValue[0]) != '-1') {
                            returnStringArray.push(actualValue[0] + appendValue);
                        } else {
                            returnStringArray.push(actualValue[0].toLowerCase() + appendValue);
                        }
                    }

                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1)
                ret_text = returnStringArray[0];
            if (returnStringArray.length > 1) {
                for (var k = 0; k < returnStringArray.length; k++) {

                    if (k == returnStringArray.length - 1) {
                        ret_text = ret_text + 'and ' + returnStringArray[k];
                    }
                    if (k != returnStringArray.length - 1) {
                        ret_text = ret_text + returnStringArray[k] + ', ';
                    }
                }
            }

            return ret_text;

        };

        //ADL Publish text manipulating functions
        $scope.adlText = function (section, bodypart, activity, compare) {

            var returnStringArray = new Array();

            var activities = [];

            switch (activity) {

                case 'selfcare':
                    {
                        activities = [{ 'id': 'ADLselfCareUrinBody', 'value': 'Urinating', 'subsection': 'ADLselfCare1' }, { 'id': 'ADLselfCareDefeBody', 'value': 'Defecating', 'subsection': 'ADLselfCare2' }, { 'id': 'ADLselfCareTeethBody', 'value': 'Brushing teeth', 'subsection': 'ADLselfCare3' }, { 'id': 'ADLselfCareHairBody', 'value': 'Combing hair', 'subsection': 'ADLselfCare4' }, { 'id': 'ADLselfCareDressBody', 'value': 'Dressing oneself', 'subsection': 'ADLselfCare6' }, { 'id': 'ADLselfCareBathBody', 'value': 'Bathing', 'subsection': 'ADLselfCare5' }, { 'id': 'ADLselfCareEatBody', 'value': 'Eating', 'subsection': 'ADLselfCare7' }];
                        break;
                    }
                case 'communication':
                    {
                        activities = [{ 'id': 'ADLcommWritBody', 'value': 'Writing', 'subsection': 'ADLcomm1' }, { 'id': 'ADLcommTypingBody', 'value': 'Typing', 'subsection': 'ADLcomm2' }, { 'id': 'ADLcommSeeingBody', 'value': 'Seeing', 'subsection': 'ADLcomm3' }, { 'id': 'ADLcommHearingBody', 'value': 'Hearing', 'subsection': 'ADLcomm4' }, { 'id': 'ADLcommSpeakingBody', 'value': 'Speaking', 'subsection': 'ADLcomm5' }];
                        break;
                    }
                case 'physical activity':
                    {
                        activities = [{ 'id': 'ADLPhysicalStandBody', 'value': 'Standing', 'subsection': 'ADLphysicalActivity1' }, { 'id': 'ADLPhysicalSitBody', 'value': 'Sitting', 'subsection': 'ADLphysicalActivity2' }, { 'id': 'ADLPhysicalRecliBody', 'value': 'Reclining', 'subsection': 'ADLphysicalActivity3' }, { 'id': 'ADLPhysicalWalkBody', 'value': 'Walking', 'subsection': 'ADLphysicalActivity4' }, { 'id': 'ADLPhysicalClimbBody', 'value': 'Climbing stairs', 'subsection': 'ADLphysicalActivity5' }];
                        break;
                    }
                case 'sensory function':
                    {
                        activities = [{ 'id': 'ADLsensoryHearBody', 'value': 'Hearing', 'subsection': 'ADLsensory1' }, { 'id': 'ADLsensorySeeBody', 'value': 'Seeing', 'subsection': 'ADLsensory2' }, { 'id': 'ADLsensoryTactileBody', 'value': 'Tactile feeling', 'subsection': 'ADLsensory3' }, { 'id': 'ADLsensoryTastBody', 'value': 'Tasting', 'subsection': 'ADLsensory4' }, { 'id': 'ADLsensorySmellBody', 'value': 'Smelling', 'subsection': 'ADLsensory5' }];
                        break;
                    }
                case 'non-specialized hand activites':
                    {
                        activities = [{ 'id': 'ADLnonSpecGraspBody', 'value': 'Grasping', 'subsection': 'ADLnonSpec1' }, { 'id': 'ADLnonSpecLiftBody', 'value': 'Lifting', 'subsection': 'ADLnonSpec2' }, { 'id': 'ADLnonSpecTactBody', 'value': 'Tactile discrimination', 'subsection': 'ADLnonSpec3' }];
                        break;
                    }
                case 'travel':
                    {
                        activities = [{ 'id': 'ADLtravelRidBody', 'value': 'Riding', 'subsection': 'ADLtravel1' }, { 'id': 'ADLtravelDrivBody', 'value': 'Driving', 'subsection': 'ADLtravel2' }, { 'id': 'ADLtravelFlyBody', 'value': 'Flying', 'subsection': 'ADLtravel3' }];
                        break;
                    }
                case 'sexual functioning':
                    {
                        if ($scope.report.data['bginfo'].gender == '') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                        }
                        else if ($scope.report.data['bginfo'].gender == 'Male') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                        }
                        else if ($scope.report.data['bginfo'].gender == 'Female') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }];
                        }
                        break;
                    }
                case 'sleep':
                    {
                        activities = [{ 'id': 'ADLsleepRestBody', 'value': 'Restful sleep', 'subsection': 'ADLsleep1' }, { 'id': 'ADLsleepNoctBody', 'value': 'Nocturnal sleep patterns', 'subsection': 'ADLsleep2' }];
                        break;
                    }
            }

            $.each(activities, function (index, item) {
                if ($scope.report.data[section][item.subsection] == 'Comment' && $scope.report.data[section][item.id + bodypart + 'radio'] == compare) {
                    returnStringArray.push(item.value);
                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1)
                ret_text = returnStringArray[0].toLowerCase();
            if (returnStringArray.length > 1) {
                for (var k = 0; k < returnStringArray.length; k++) {
                    if (k == returnStringArray.length - 1)
                        ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                    if (k != returnStringArray.length - 1)
                        ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                }
            }

            return ret_text;

        };

        $scope.adlCheck = function (activity) {
            if ($scope.report) {

                var returnValue = true; //return true when all the values are not equal to 'Comment'

                var activities = [];

                switch (activity) {

                    case 'selfcare':
                        {
                            activities = [{ 'id': 'ADLselfCareUrinBody', 'value': 'Urinating', 'subsection': 'ADLselfCare1' }, { 'id': 'ADLselfCareDefeBody', 'value': 'Defecating', 'subsection': 'ADLselfCare2' }, { 'id': 'ADLselfCareTeethBody', 'value': 'Brushing teeth', 'subsection': 'ADLselfCare3' }, { 'id': 'ADLselfCareHairBody', 'value': 'Combing hair', 'subsection': 'ADLselfCare4' }, { 'id': 'ADLselfCareDressBody', 'value': 'Dressing oneself', 'subsection': 'ADLselfCare6' }, { 'id': 'ADLselfCareBathBody', 'value': 'Bathing', 'subsection': 'ADLselfCare5' }, { 'id': 'ADLselfCareEatBody', 'value': 'Eating', 'subsection': 'ADLselfCare7' }];
                            break;
                        }
                    case 'communication':
                        {
                            activities = [{ 'id': 'ADLcommWritBody', 'value': 'Writing', 'subsection': 'ADLcomm1' }, { 'id': 'ADLcommTypingBody', 'value': 'Typing', 'subsection': 'ADLcomm2' }, { 'id': 'ADLcommSeeingBody', 'value': 'Seeing', 'subsection': 'ADLcomm3' }, { 'id': 'ADLcommHearingBody', 'value': 'Hearing', 'subsection': 'ADLcomm4' }, { 'id': 'ADLcommSpeakingBody', 'value': 'Speaking', 'subsection': 'ADLcomm5' }];
                            break;
                        }
                    case 'physical activity':
                        {
                            activities = [{ 'id': 'ADLPhysicalStandBody', 'value': 'Standing', 'subsection': 'ADLphysicalActivity1' }, { 'id': 'ADLPhysicalSitBody', 'value': 'Sitting', 'subsection': 'ADLphysicalActivity2' }, { 'id': 'ADLPhysicalRecliBody', 'value': 'Reclining', 'subsection': 'ADLphysicalActivity3' }, { 'id': 'ADLPhysicalWalkBody', 'value': 'Walking', 'subsection': 'ADLphysicalActivity4' }, { 'id': 'ADLPhysicalClimbBody', 'value': 'Climbing stairs', 'subsection': 'ADLphysicalActivity5' }];
                            break;
                        }
                    case 'sensory function':
                        {
                            activities = [{ 'id': 'ADLsensoryHearBody', 'value': 'Hearing', 'subsection': 'ADLsensory1' }, { 'id': 'ADLsensorySeeBody', 'value': 'Seeing', 'subsection': 'ADLsensory2' }, { 'id': 'ADLsensoryTactileBody', 'value': 'Tactile feeling', 'subsection': 'ADLsensory3' }, { 'id': 'ADLsensoryTastBody', 'value': 'Tasting', 'subsection': 'ADLsensory4' }, { 'id': 'ADLsensorySmellBody', 'value': 'Smelling', 'subsection': 'ADLsensory5' }];
                            break;
                        }
                    case 'non-specialized hand activites':
                        {
                            activities = [{ 'id': 'ADLnonSpecGraspBody', 'value': 'Grasping', 'subsection': 'ADLnonSpec1' }, { 'id': 'ADLnonSpecLiftBody', 'value': 'Lifting', 'subsection': 'ADLnonSpec2' }, { 'id': 'ADLnonSpecTactBody', 'value': 'Tactile discrimination', 'subsection': 'ADLnonSpec3' }];
                            break;
                        }
                    case 'travel':
                        {
                            activities = [{ 'id': 'ADLtravelRidBody', 'value': 'Riding', 'subsection': 'ADLtravel1' }, { 'id': 'ADLtravelDrivBody', 'value': 'Driving', 'subsection': 'ADLtravel2' }, { 'id': 'ADLtravelFlyBody', 'value': 'Flying', 'subsection': 'ADLtravel3' }];
                            break;
                        }
                    case 'sexual functioning':
                        {
                            if ($scope.report.data['bginfo'].gender == '') {
                                activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                            }
                            else if ($scope.report.data['bginfo'].gender == 'Male') {
                                activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                            }
                            else if ($scope.report.data['bginfo'].gender == 'Female') {
                                activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }];
                            }
                            break;
                        }
                    case 'sleep':
                        {
                            activities = [{ 'id': 'ADLsleepRestBody', 'value': 'Restful sleep', 'subsection': 'ADLsleep1' }, { 'id': 'ADLsleepNoctBody', 'value': 'Nocturnal sleep patterns', 'subsection': 'ADLsleep2' }];
                            break;
                        }
                }

                $.each(activities, function (index, item) {
                    if ($scope.report.data['ActivitiesofDailyLiving'][item.subsection] == 'Comment') {
                        returnValue = false;
                    }
                });

                return returnValue;
            }
        };

        //ADL Publish text manipulating function for Flavor A
        $scope.adlTextFlavorA = function (section, bodypart, activity, compare) {
            var returnStringArray = new Array();

            var activities = [];

            switch (activity) {

                case 'selfcare':
                    {
                        activities = [{ 'id': 'ADLselfCareUrinBody', 'value': 'Urinating', 'subsection': 'ADLselfCare1' }, { 'id': 'ADLselfCareDefeBody', 'value': 'Defecating', 'subsection': 'ADLselfCare2' }, { 'id': 'ADLselfCareTeethBody', 'value': 'Brushing teeth', 'subsection': 'ADLselfCare3' }, { 'id': 'ADLselfCareHairBody', 'value': 'Combing hair', 'subsection': 'ADLselfCare4' }, { 'id': 'ADLselfCareDressBody', 'value': 'Dressing oneself', 'subsection': 'ADLselfCare6' }, { 'id': 'ADLselfCareBathBody', 'value': 'Bathing', 'subsection': 'ADLselfCare5' }, { 'id': 'ADLselfCareEatBody', 'value': 'Eating', 'subsection': 'ADLselfCare7' }];
                        break;
                    }
                case 'communication':
                    {
                        activities = [{ 'id': 'ADLcommWritBody', 'value': 'Writing', 'subsection': 'ADLcomm1' }, { 'id': 'ADLcommTypingBody', 'value': 'Typing', 'subsection': 'ADLcomm2' }, { 'id': 'ADLcommSeeingBody', 'value': 'Seeing', 'subsection': 'ADLcomm3' }, { 'id': 'ADLcommHearingBody', 'value': 'Hearing', 'subsection': 'ADLcomm4' }, { 'id': 'ADLcommSpeakingBody', 'value': 'Speaking', 'subsection': 'ADLcomm5' }];
                        break;
                    }
                case 'physical activity':
                    {
                        activities = [{ 'id': 'ADLPhysicalStandBody', 'value': 'Standing', 'subsection': 'ADLphysicalActivity1' }, { 'id': 'ADLPhysicalSitBody', 'value': 'Sitting', 'subsection': 'ADLphysicalActivity2' }, { 'id': 'ADLPhysicalRecliBody', 'value': 'Reclining', 'subsection': 'ADLphysicalActivity3' }, { 'id': 'ADLPhysicalWalkBody', 'value': 'Walking', 'subsection': 'ADLphysicalActivity4' }, { 'id': 'ADLPhysicalClimbBody', 'value': 'Climbing stairs', 'subsection': 'ADLphysicalActivity5' }];
                        break;
                    }
                case 'sensory function':
                    {
                        activities = [{ 'id': 'ADLsensoryHearBody', 'value': 'Hearing', 'subsection': 'ADLsensory1' }, { 'id': 'ADLsensorySeeBody', 'value': 'Seeing', 'subsection': 'ADLsensory2' }, { 'id': 'ADLsensoryTactileBody', 'value': 'Tactile feeling', 'subsection': 'ADLsensory3' }, { 'id': 'ADLsensoryTastBody', 'value': 'Tasting', 'subsection': 'ADLsensory4' }, { 'id': 'ADLsensorySmellBody', 'value': 'Smelling', 'subsection': 'ADLsensory5' }];
                        break;
                    }
                case 'non-specialized hand activites':
                    {
                        activities = [{ 'id': 'ADLnonSpecGraspBody', 'value': 'Grasping', 'subsection': 'ADLnonSpec1' }, { 'id': 'ADLnonSpecLiftBody', 'value': 'Lifting', 'subsection': 'ADLnonSpec2' }, { 'id': 'ADLnonSpecTactBody', 'value': 'Tactile discrimination', 'subsection': 'ADLnonSpec3' }];
                        break;
                    }
                case 'travel':
                    {
                        activities = [{ 'id': 'ADLtravelRidBody', 'value': 'Riding', 'subsection': 'ADLtravel1' }, { 'id': 'ADLtravelDrivBody', 'value': 'Driving', 'subsection': 'ADLtravel2' }, { 'id': 'ADLtravelFlyBody', 'value': 'Flying', 'subsection': 'ADLtravel3' }];
                        break;
                    }
                case 'sexual functioning':
                    {
                        if ($scope.report.data['bginfo'].gender == '') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                        }
                        else if ($scope.report.data['bginfo'].gender == 'Male') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                        }
                        else if ($scope.report.data['bginfo'].gender == 'Female') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }];
                        }
                        break;
                    }
                case 'sleep':
                    {
                        activities = [{ 'id': 'ADLsleepRestBody', 'value': 'Restful sleep', 'subsection': 'ADLsleep1' }, { 'id': 'ADLsleepNoctBody', 'value': 'Nocturnal sleep patterns', 'subsection': 'ADLsleep2' }];
                        break;
                    }
            }

            $.each(activities, function (index, item) {
                if ($scope.report.data[section][item.subsection] == 'Comment' && $scope.report.data[section][item.id + bodypart + 'radio'] == compare) {
                    returnStringArray.push(item.value);
                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1) {
                ret_text = 'activity of ' + returnStringArray[0].toLowerCase();
            }
            else if (returnStringArray.length > 1) {
                ret_text = 'activities of ';
                for (var k = 0; k < returnStringArray.length; k++) {
                    if (k == returnStringArray.length - 1)
                        ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                    if (k != returnStringArray.length - 1)
                        ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                }
            }
            return ret_text;

        };

        //ADL Publish text manipulating function for Flavor B
        $scope.adlTextFlavorB = function (section, bodypart, activity, compare) {
            var returnStringArray = new Array();

            var activities = [];

            switch (activity) {

                case 'selfcare':
                    {
                        activities = [{ 'id': 'ADLselfCareUrinBody', 'value': 'Urinating', 'subsection': 'ADLselfCare1' }, { 'id': 'ADLselfCareDefeBody', 'value': 'Defecating', 'subsection': 'ADLselfCare2' }, { 'id': 'ADLselfCareTeethBody', 'value': 'Brushing teeth', 'subsection': 'ADLselfCare3' }, { 'id': 'ADLselfCareHairBody', 'value': 'Combing hair', 'subsection': 'ADLselfCare4' }, { 'id': 'ADLselfCareDressBody', 'value': 'Dressing oneself', 'subsection': 'ADLselfCare6' }, { 'id': 'ADLselfCareBathBody', 'value': 'Bathing', 'subsection': 'ADLselfCare5' }, { 'id': 'ADLselfCareEatBody', 'value': 'Eating', 'subsection': 'ADLselfCare7' }];
                        break;
                    }
                case 'communication':
                    {
                        activities = [{ 'id': 'ADLcommWritBody', 'value': 'Writing', 'subsection': 'ADLcomm1' }, { 'id': 'ADLcommTypingBody', 'value': 'Typing', 'subsection': 'ADLcomm2' }, { 'id': 'ADLcommSeeingBody', 'value': 'Seeing', 'subsection': 'ADLcomm3' }, { 'id': 'ADLcommHearingBody', 'value': 'Hearing', 'subsection': 'ADLcomm4' }, { 'id': 'ADLcommSpeakingBody', 'value': 'Speaking', 'subsection': 'ADLcomm5' }];
                        break;
                    }
                case 'physical activity':
                    {
                        activities = [{ 'id': 'ADLPhysicalStandBody', 'value': 'Standing', 'subsection': 'ADLphysicalActivity1' }, { 'id': 'ADLPhysicalSitBody', 'value': 'Sitting', 'subsection': 'ADLphysicalActivity2' }, { 'id': 'ADLPhysicalRecliBody', 'value': 'Reclining', 'subsection': 'ADLphysicalActivity3' }, { 'id': 'ADLPhysicalWalkBody', 'value': 'Walking', 'subsection': 'ADLphysicalActivity4' }, { 'id': 'ADLPhysicalClimbBody', 'value': 'Climbing stairs', 'subsection': 'ADLphysicalActivity5' }];
                        break;
                    }
                case 'sensory function':
                    {
                        activities = [{ 'id': 'ADLsensoryHearBody', 'value': 'Hearing', 'subsection': 'ADLsensory1' }, { 'id': 'ADLsensorySeeBody', 'value': 'Seeing', 'subsection': 'ADLsensory2' }, { 'id': 'ADLsensoryTactileBody', 'value': 'Tactile feeling', 'subsection': 'ADLsensory3' }, { 'id': 'ADLsensoryTastBody', 'value': 'Tasting', 'subsection': 'ADLsensory4' }, { 'id': 'ADLsensorySmellBody', 'value': 'Smelling', 'subsection': 'ADLsensory5' }];
                        break;
                    }
                case 'non-specialized hand activites':
                    {
                        activities = [{ 'id': 'ADLnonSpecGraspBody', 'value': 'Grasping', 'subsection': 'ADLnonSpec1' }, { 'id': 'ADLnonSpecLiftBody', 'value': 'Lifting', 'subsection': 'ADLnonSpec2' }, { 'id': 'ADLnonSpecTactBody', 'value': 'Tactile discrimination', 'subsection': 'ADLnonSpec3' }];
                        break;
                    }
                case 'travel':
                    {
                        activities = [{ 'id': 'ADLtravelRidBody', 'value': 'Riding', 'subsection': 'ADLtravel1' }, { 'id': 'ADLtravelDrivBody', 'value': 'Driving', 'subsection': 'ADLtravel2' }, { 'id': 'ADLtravelFlyBody', 'value': 'Flying', 'subsection': 'ADLtravel3' }];
                        break;
                    }
                case 'sexual functioning':
                    {
                        if ($scope.report.data['bginfo'].gender == '') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                        }
                        else if ($scope.report.data['bginfo'].gender == 'Male') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualEjacBody', 'value': 'Ejaculation', 'subsection': 'ADLsexual2' }, { 'id': 'ADLsexualErecBody', 'value': 'Erection', 'subsection': 'ADLsexual4' }];
                        }
                        else if ($scope.report.data['bginfo'].gender == 'Female') {
                            activities = [{ 'id': 'ADLsexualOrgaBody', 'value': 'Orgasm', 'subsection': 'ADLsexual1' }, { 'id': 'ADLsexualLubriBody', 'value': 'Lubrication', 'subsection': 'ADLsexual3' }];
                        }
                        break;
                    }
                case 'sleep':
                    {
                        activities = [{ 'id': 'ADLsleepRestBody', 'value': 'Restful sleep', 'subsection': 'ADLsleep1' }, { 'id': 'ADLsleepNoctBody', 'value': 'Nocturnal sleep patterns', 'subsection': 'ADLsleep2' }];
                        break;
                    }
            }

            $.each(activities, function (index, item) {
                if ($scope.report.data[section][item.subsection] == 'Comment' && $scope.report.data[section][item.id + bodypart + 'radio'] == compare) {
                    returnStringArray.push(item.value);
                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1) {
                if (compare == 'Cannot perform activity at all')
                    ret_text = 'The activity of ' + returnStringArray[0].toLowerCase() + ' is limited by the ';
                else if (compare == 'Only Pain')
                    ret_text = 'The activity of ' + returnStringArray[0].toLowerCase() + ' causes pain to the ';
                else if (compare == 'No limitations')
                    ret_text = 'neither limits nor causes pain during the activity of ' + returnStringArray[0].toLowerCase();
            }
            else if (returnStringArray.length > 1) {
                if (compare == 'Cannot perform activity at all') {
                    ret_text = 'The activities of ';
                    for (var k = 0; k < returnStringArray.length; k++) {
                        if (k == returnStringArray.length - 1)
                            ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                        if (k != returnStringArray.length - 1)
                            ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                    }
                    ret_text = ret_text + ' are limited by the ';
                }
                else if (compare == 'Only Pain') {
                    ret_text = 'The activities of ';
                    for (var k = 0; k < returnStringArray.length; k++) {
                        if (k == returnStringArray.length - 1)
                            ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                        if (k != returnStringArray.length - 1)
                            ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                    }
                    ret_text = ret_text + ' cause pain to the ';
                }
                else if (compare == 'No limitations') {
                    ret_text = 'neither limits nor cause pain during the activities of ';
                    for (var k = 0; k < returnStringArray.length; k++) {
                        if (k == returnStringArray.length - 1)
                            ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                        if (k != returnStringArray.length - 1)
                            ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                    }
                }
            }
            return ret_text;
        };

        //Makes sentence from the input string
        $scope.makeSentence = function (input) {
         
            var ret_text = '';
            var arr = input.split('~');
            var arr2 = new Array();

            for (var k = 0; k < arr.length; k++) {
                if (arr[k] != '' && arr[k] != 'false')
                    arr2.push(arr[k]);
            }

            if (arr2.length == 0)
                return ret_text;
            if (arr2.length == 1) {
                if (arr2[0] == 'TENS unit' || arr2[0] == 'H-Wave unit' || arr2[0] == 'AFO' || arr2[0] == 'KAFO') {
                    ret_text = arr2[0] + '.';
                } else {
                    ret_text = arr2[0].toLowerCase() + '.';
                }
            }
            if (arr2.length > 1) {
                for (var k = 0; k < arr2.length; k++) {
                    if (arr2[k] != '') {
                        if (k == arr2.length - 1) {
                            if (arr2[k] == 'TENS unit' || arr2[k] == 'H-Wave unit' || arr2[k] == 'AFO' || arr2[k] == 'KAFO') {
                                ret_text = ret_text + 'and ' + arr2[k] + '.';
                            } else {
                                ret_text = ret_text + 'and ' + arr2[k].toLowerCase() + '.';
                            }
                        }
                        if (k != arr2.length - 1) {
                            if (arr2[k] == 'TENS unit' || arr2[k] == 'H-Wave unit' || arr2[k] == 'AFO' || arr2[k] == 'KAFO') {
                                ret_text = ret_text + arr2[k] + ', ';
                            } else {
                                ret_text = ret_text + arr2[k].toLowerCase() + ', ';
                            }

                        }
                    }
                }
            }
            return ret_text;
        };

        $scope.makeStatementNevi = function (input) {

            var ret_text = '';
            var arr = input.split('~');
            var arr2 = new Array();

            for (var k = 0; k < arr.length; k++) {
                if (arr[k] != '' && arr[k] != 'false')
                    arr2.push(arr[k].toLowerCase());
            }

            if (arr2.length == 0)
                return ret_text.charAt(0).toUpperCase() + ret_text.slice(1).toLowerCase();
            if (arr2.length == 1) {
                ret_text = arr2[0] + ' ';
            }
            if (arr2.length > 1) {
                for (var k = 0; k < arr2.length; k++) {
                    if (arr2[k] != '') {
                        if (k == arr2.length - 1) {
                            ret_text = ret_text + 'and ' + arr2[k] + ' ';
                        }
                        if (k != arr2.length - 1) {
                            ret_text = ret_text + arr2[k] + ', ';
                        }
                    }
                }
            }
            return ret_text.charAt(0).toUpperCase() + ret_text.slice(1).toLowerCase();
        };

        $scope.makeKneeSentence = function (data) {

            var returnStringArray = new Array();

            $.each(data, function (index, item) {
                if (item.subsection != '') {
                    returnStringArray.push(item.section + '; ' + item.subsection);
                } else {
                    returnStringArray.push(item.section);
                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1)
                ret_text = returnStringArray[0].toLowerCase();
            if (returnStringArray.length > 1) {
                for (var k = 0; k < returnStringArray.length; k++) {
                    if (k == returnStringArray.length - 1)
                        ret_text = ret_text + 'and ' + returnStringArray[k].toLowerCase();
                    if (k != returnStringArray.length - 1)
                        ret_text = ret_text + returnStringArray[k].toLowerCase() + ', ';
                }
            }

            return ret_text;


        };

        $scope.makeKneeSentence2 = function (data) {
            var returnStringArray = new Array();

            $.each(data, function (index, item) {
                if (item.section != undefined) {
                    if (item.section != '' && item.section != undefined && item.section != 'undefined' && item.section != 'false' && item.section != false) {
                        if (item.subsection != '' && item.subsection != 'false' && item.subsection != false && item.subsection != 'undefined' && item.subsection != undefined) {

                            //Replaced the above four lines of code by Unais dated 16-Feb-2015 with below one as per suggestion of the client to reverse the punctuations
                            //if (item.subsection.split(' ')[0] == 'With' || item.subsection.split(' ')[0] == 'Without') {

                            //returnStringArray.push(item.section + ', ' + item.subsection.charAt(0).toLowerCase() + item.subsection.slice(1));
                            if (item.section.split(' ').length == 2)
                                returnStringArray.push(item.section.split(' ')[0] + ' ' + item.section.split(' ')[1].charAt(0).toLowerCase() + item.section.split(' ')[1].slice(1) + ', ' + item.subsection.charAt(0).toLowerCase() + item.subsection.slice(1));
                            else
                                returnStringArray.push(item.section + ', ' + item.subsection.toLowerCase());
                            //}
                            //else {
                            //    returnStringArray.push(item.section + ', ' + item.subsection);
                            //}
                        } else {
                            //returnStringArray.push(item.section);
                            if (item.section.split(' ').length == 2)
                                returnStringArray.push(item.section.split(' ')[0] + ' ' + item.section.split(' ')[1].charAt(0).toLowerCase() + item.section.split(' ')[1].slice(1));
                            else
                                returnStringArray.push(item.section);
                        }
                    }
                }
            });

            var ret_text = '';

            if (returnStringArray.length == 1)
                ret_text = returnStringArray[0];
            if (returnStringArray.length > 1) {
                for (var k = 0; k < returnStringArray.length; k++) {

                    //Replaced the above four lines of code by Unais dated 16-Feb-2015 with below one as per suggestion of the client to reverse the punctuations
                    if (k == returnStringArray.length - 1)
                        ret_text = ret_text + returnStringArray[k];
                    if (k != returnStringArray.length - 1)
                        ret_text = ret_text + returnStringArray[k] + '. ';
                }
            }
            if (ret_text == '')
                return ret_text;
            else
                return ret_text + '.';
        };

        $scope.makeStatement = function (input) {
            var ret_text = '';
            var arr = input.split('~');
            var arr2 = new Array();

            for (var k = 0; k < arr.length; k++) {
                if (arr[k] != '' && arr[k] != 'false')
                    arr2.push(arr[k].toLowerCase());
            }

            if (arr2.length == 0)
                return ret_text;
            if (arr2.length == 1) {
                ret_text = arr2[0] + '.';
            }
            if (arr2.length > 1) {
                for (var k = 0; k < arr2.length; k++) {
                    if (arr2[k] != '') {
                        if (k == arr2.length - 1) {
                            ret_text = ret_text + 'and ' + arr2[k] + '.';
                        }
                        if (k != arr2.length - 1) {
                            ret_text = ret_text + arr2[k] + ', ';
                        }
                    }
                }
            }
            return ret_text;
        };

        //Makes sentence from the input string (with first letter as capital)
        $scope.makeSentenceCapitalizeFirst = function (input) {
          
            var ret_text = '';
            var arr = input.split('~');
            var arr2 = new Array();

            for (var k = 0; k < arr.length; k++) {
                if (arr[k] != '' && arr[k] != 'false')
                    arr2.push(arr[k]);
            }

            if (arr2.length == 0)
                return ret_text;
            if (arr2.length == 1) {
                if (arr2[0] == 'TENS unit' || arr2[0] == 'H-Wave unit' || arr2[0] == 'AFO' || arr2[0] == 'KAFO') {
                    ret_text = arr2[0] + '.';
                } else {
                    ret_text = arr2[0].toLowerCase() + '.';
                }
            }
            if (arr2.length > 1) {
                for (var k = 0; k < arr2.length; k++) {
                    if (arr2[k] != '') {
                        if (k == arr2.length - 1) {
                            if (arr2[k] == 'TENS unit' || arr2[k] == 'H-Wave unit' || arr2[k] == 'AFO' || arr2[k] == 'KAFO') {
                                ret_text = ret_text + 'and ' + arr2[k] + '.';
                            } else {
                                ret_text = ret_text + 'and ' + arr2[k].toLowerCase() + '.';
                            }

                        }
                        if (k != arr2.length - 1) {
                            if (arr2[k] == 'TENS unit' || arr2[k] == 'H-Wave unit' || arr2[k] == 'AFO' || arr2[k] == 'KAFO') {
                                ret_text = ret_text + arr2[k] + ', ';
                            } else {
                                ret_text = ret_text + arr2[k].toLowerCase() + ', ';
                            }

                        }
                    }
                }
            }
            ret_text = ret_text.charAt(0).toUpperCase() + ret_text.slice(1);
            return ret_text;
        };

        $scope.makePathologyStatement = function (input) {

            var ret_text = '';
            var arr = input.split('~');
            var arr2 = new Array();

            for (var k = 0; k < arr.length; k++) {
                if (arr[k] != '' && arr[k] != 'false')
                    arr2.push(arr[k]);
            }

            if (arr2.length == 0)
                return ret_text.charAt(0).toUpperCase() + ret_text.slice(1).toLowerCase();
            if (arr2.length == 1) {
                ret_text = arr2[0] + ' is reported.';
            }
            //if (arr2.length == 2) {
            //    ret_text = arr2[0] + 'and ' + arr2[1] + ' are reported.';
            //}
            if (arr2.length > 1) {
                for (var k = 0; k < arr2.length; k++) {
                    if (arr2[k] != '') {
                        if (k == arr2.length - 1) {
                            ret_text = ret_text + 'and ' + arr2[k] + ' are reported.';
                        }
                        if (k != arr2.length - 1) {
                            ret_text = ret_text + arr2[k] + ', ';
                        }
                    }
                }
            }
            //return ret_text;
            return ret_text.charAt(0).toUpperCase() + ret_text.slice(1).toLowerCase();
        };

        $scope.makeSemiColonSeparatedWithPeriod = function (input, inputval) {

            var ret_text = '';
            var arr = input.split('~');
            var arr2 = new Array();
            var arr3 = inputval.split('~');
            var arr4 = new Array();

            for (var k = 0; k < arr.length; k++) {
                if (arr[k] != '' && arr[k] != 'false')
                    arr2.push(arr[k]);
            }

            for (var k = 0; k < arr3.length; k++) {
                if (arr[k] != 'false')// || arr3[k] != '')
                    arr4.push(arr3[k]);
            }

            if (arr4.length == 0)
                return ret_text;
            if (arr4.length == 1) {
                ret_text = arr4[0] + '.';
            }
            //if (arr4.length == 2) {
            //    ret_text = arr4[0] + '; ' + arr4[1] + '.';
            //}
            if (arr4.length > 1) {
                for (var k = 0; k < arr4.length; k++) {
                    if (arr4[k] != '') {
                        if (k == arr4.length - 1) {
                            ret_text = ret_text + arr4[k] + '.';
                        }
                        if (k != arr4.length - 1) {
                            ret_text = ret_text + arr4[k] + '; ';
                        }
                    }
                }
            }
            return ret_text;
        };

        $scope.treatmentCoverPage = function () {

            var NoCount = 0;
            for (var i = 0; i < report.data.selectinjuries.concatedbodypart.length; i++) {
                var a = report.data['treatment' + report.data.selectinjuries.concatedbodypart[i].concateId];
                if (report.data['treatment' + report.data.selectinjuries.concatedbodypart[i].concateId]) {

                    if (report.data['treatment' + report.data.selectinjuries.concatedbodypart[i].concateId].treatcurrentradio == 'Yes') {
                        return true;
                    }
                    if (report.data['treatment' + report.data.selectinjuries.concatedbodypart[i].concateId].treatcurrentradio == 'No') {
                        NoCount = NoCount + 1;
                    }
                }
            }
            if (NoCount == report.data.selectinjuries.concatedbodypart.length) {
                $scope.NoCount = true;
            }
        }

        $scope.workRestrictionCoverPage = function () {
            for (var i = 0; i < report.data.selectinjuries.concatedbodypart.length; i++) {
                if (report.data['workrestriction']) {
                    return true;
                }
            }
        }

        //GT:RISHU 24th November 2014 Code for date format
        $scope.dateFilter = function (input) {

            if (input == null) { return ""; }

            var date = $filter('date')(new Date(input), 'dd-MMM-yyyy');
            return date;
        }

        $scope.datenewFormat = function (input) {
            if (input == null) { return ""; }

            var date = $filter('date')(new Date(input), 'MM/dd/yyyy');
            return date;
        }

        $scope.getTotalPage = function () {

            var divHeight = document.getElementById('rptHtmlData').offsetHeight;
            var lineHeight = parseInt(document.getElementById('rptHtmlData').style.lineHeight);
            var lines = divHeight / lineHeight;

            $scope.totalpages = Math.ceil(lines / 42);
            if (!$scope.report.data.documentation) {
                $scope.report.data.documentation = new Object();
            }

            if ($scope.report.data.documentation) {
                $scope.report.data.documentation.noofpages = $scope.totalpages;
            }
        }

        /*$scope.getTotalPage = function () {
            
            var divHeight = document.getElementById('reportHtmlData').offsetHeight;
            var lineHeight = parseInt(document.getElementById('reportHtmlData').style.lineHeight);
            var lines = divHeight / lineHeight;
            
            $scope.totalpages = Math.ceil(lines / 42);
            if (!$scope.report.data.documentation) {
                $scope.report.data.documentation = new Object();
            }

            if ($scope.report.data.documentation) {
                $scope.report.data.documentation.noofpages = $scope.totalpages;
            }
        }*/

        $scope.getBillingCalPath = function () {

            try {
                if ($rootScope.billingcalculatoromfs == "off" && $scope.report.data.bc.length == 0) {
                   
                    $(".hide_calc_off").hide();
                }
            } catch (e) {
                        	
            }
            if(typeof $cookies.selectedStatecode=='undefined')
			{
				return 'partials/billingcalculatorCA.html';
			}
			else
			{
				if($cookies.selectedStatecode=='')
				{
					return 'partials/billingcalculatorCA.html';
				}
				else
					return 'partials/billingcalculator' + $cookies.selectedStatecode + '.html';
			}
        }

        $scope.showHideBillingCal = function () {
           
            try {
                if ($rootScope.billingcalculatoromfs == "on") {
                    return false;
                }
                else {
                    return true;
                }
            }
            catch (e) {
                return true;
            }
        }


        $scope.getTotal = function () {

            var total = 0;
            for (var i = 0; i < $scope.report.data.bc.length; i++) {
                if ($scope.report.data.bc[i].billing.price) {
                    var price = parseFloat($scope.report.data.bc[i].billing.price);
                    total += price;
                }
            }
            return total.toFixed(2);
        };

        //Below 3 functions used to check checkboxes on PR2 upper section
        $scope.checkNeedForSurgery = function (section) {
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data.selectinjuries) {

                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            //if (bodypart.bodysystem != 'Other') {
                            if ($scope.report.data[section + bodypart.concateId]) {
                                angular.forEach($scope.report.data[section + bodypart.concateId], function (value, key) {
                                    if (!returnValue) {
                                        if (key != 'treatcurrentradio' && key != 'maintextA') {
                                            if (value && value.length > 0) {
                                                returnValue = true;
                                            }
                                        }
                                    }
                                });
                            }
                            //}
                        }
                    }
                }
            }

            return returnValue;
        };

        $scope.checkTreatmentIndicated = function (section) {
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data.selectinjuries) {

                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            if (bodypart.bodysystem != 'Other') {
                                if ($scope.report.data[section + bodypart.concateId]) {
                                    angular.forEach($scope.report.data[section + bodypart.concateId], function (value, key) {
                                        if (!returnValue) {
                                            if (key == 'treatcurrentradio') {
                                                if (value && value.length > 0 && value == 'Yes') {
                                                    returnValue = true;
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }

            return returnValue;
        };

        $scope.checkReferral = function (section) {
            var returnValue = false;
            if ($scope.report) {
                if ($scope.report.data) {

                    if ($scope.report.data.selectinjuries) {

                        for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {

                            var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                            if (bodypart.bodysystem != 'Other') {
                                if (bodypart.id == 'thoracic') {
                                    if ($scope.report.data[section + bodypart.concateId]) {
                                        angular.forEach($scope.report.data[section + bodypart.concateId], function (value, key) {
                                            if (!returnValue) {
                                                if (key != 'treatcurrentradio') {
                                                    if (key == 'treatmentreferral' || key == 'treatmenttherapy') {
                                                        //if (typeof $scope.report.data[section + bodypart.concateId][key] == "object") {
                                                        //    angular.forEach($scope.report.data[section + bodypart.concateId][key], function (key2, value2) {
                                                        //        if (key2['othertextareaTherapytext'] !='')
                                                        //            returnValue = true;
                                                        //    });
                                                        //}
                                                        //else {
                                                        //    if(key.length>0)
                                                        //        returnValue = true;
                                                        //}
                                                        if (value && value.length > 0)
                                                            returnValue = true;
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return returnValue;
        };

        $scope.setCounty = function () {
            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data['patientcomplaints']) {
                        if ($scope.report.data['patientcomplaints'].cliniclocation) {

                            var clinicLocation = $scope.report.data['patientcomplaints'].cliniclocation;
                            var countyArray = clinicLocation.split(",", 1);
                            var county = countyArray[0];
                            return county;
                        }
                    }
                }
            }
        }

        $scope.mypracticename = $rootScope.currentUser.practicename;

        $scope.setAddress = function () {
            try {
                if ($scope.report) {
                    if ($scope.report.data) {
                        if ($scope.report.data['patientcomplaints']) {
                            if ($scope.report.data['patientcomplaints'].cliniclocation) {

                                /*var clinicLocation = $scope.report.data['patientcomplaints'].cliniclocation;
								var addressArray = clinicLocation.split(",");
								addressArray.splice(0, 1);
								return addressArray.join(', ');*/

                                var clinicLocation = $scope.report.data['patientcomplaints'].cliniclocation;
                                var addressArray = clinicLocation.split(",");
                                addressArray.splice(0, 1);
                                var finalLoc = addressArray.join(', ');
                                if (typeof report.data['patientcomplaints'].cliniclocationobj.location != "undefined") {
                                    if (report.data['patientcomplaints'].cliniclocationobj.location != "") {
                                        finalLoc = report.data['patientcomplaints'].cliniclocationobj.location + ", " + finalLoc;
                                    }
                                }
                                return finalLoc;

                            }
                        }
                    }
                }
            }
            catch (err) {
                return "";
            }
        }

        $scope.checkExistHip = function (section) {
            var isSectiondataExist = false;
            if ($scope.report) {
                if ($scope.report.data) {
                    if ($scope.report.data['hipactivities']) {
                        if ($scope.report.data['hipactivities'].ADLhipActivities != 'Choose' && $scope.report.data['hipactivities'].ADLhipActivities != 'Normal')
                            if ($scope.report.data['hipactivities'].ddlWalkingOptions.length > 0 || $scope.report.data['hipactivities'].ddlClimbingOptions.length > 0 || $scope.report.data['hipactivities'].ddlSittingOptions || $scope.report.data['hipactivities'].ddlPuttingShoesOptions || $scope.report.data['hipactivities'].ddlPublicTransportationOptions) {
                                isSectiondataExist = true;
                            }
                        return isSectiondataExist;
                    }
                }
            }
        };

        $scope.getAbsValue = function (item) {
            if (typeof (item) != 'undefined') {
                if (item.toString().indexOf("-") > -1)
                    return item;
                else
                    return Math.abs(item);
            }
        };

        $scope.checkArray = function (inputValue) {
            if (inputValue) {
                if (typeof inputValue === 'string') {
                    return inputValue;
                }
                else {
                    if (Object.prototype.toString.call(inputValue) === '[object Array]') {
                        return inputValue[0];
                    }
                }
            }
        };

        $scope.treatmentCheckTotalRemission = function () {
            if ($scope.report) {
                var returnValue = false;
                if (!returnValue) {
                    if ($scope.report.data) {
                        if ($scope.report.data.selectinjuries) {
                            if ($scope.report.data.selectinjuries.concatedbodypart) {
                                for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                    var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                                    if ($scope.report.data['patientcomplaints' + bodypart.concateId]) {
                                        if ($scope.report.data['patientcomplaints' + bodypart.concateId].totalremissionradio) {
                                            if ($scope.report.data['patientcomplaints' + bodypart.concateId].totalremissionradio == 'Yes') {
                                                returnValue = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return returnValue;
        };

        $scope.checkApportionmentExistAll = function () {
            if ($scope) {
                if ($scope.report) {
                    if ($scope.report.data) {
                        if ($scope.report.data['apportionment']) {
                            if ($scope.report.data['apportionment'].rdopainassessment) {
                                if ($scope.report.data['apportionment'].rdopainassessment.length > 0) {
                                    return true;
                                }
                            }
                        }
                        if ($scope.report.data.selectinjuries) {
                            if ($scope.report.data.selectinjuries.concatedbodypart) {
                                for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                    var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];

                                    if ($scope.report.data['apportionment' + bodypart.concateId]) {
                                        if (typeof ($scope.report.data['apportionment' + bodypart.concateId].txtPreExisitng) != 'undefined') {
                                            if ($scope.report.data['apportionment' + bodypart.concateId].txtPreExisitng.toString().length > 0) {
                                                return true;
                                            }
                                        }
                                        if (typeof ($scope.report.data['apportionment' + bodypart.concateId].txtImaging) != 'undefined') {
                                            if ($scope.report.data['apportionment' + bodypart.concateId].txtImaging.toString().length > 0) {
                                                return true;
                                            }
                                        }
                                        if (typeof ($scope.report.data['apportionment' + bodypart.concateId].txtObesity) != 'undefined') {
                                            if ($scope.report.data['apportionment' + bodypart.concateId].txtObesity.toString().length > 0) {
                                                return true;
                                            }
                                        }
                                        if (typeof ($scope.report.data['apportionment' + bodypart.concateId].txtOther2) != 'undefined') {
                                            if ($scope.report.data['apportionment' + bodypart.concateId].txtOther2.length > 0) {
                                                return true;
                                            }
                                        }
                                        if (typeof ($scope.report.data['apportionment' + bodypart.concateId].textareaComment) != 'undefined') {
                                            if ($scope.report.data['apportionment' + bodypart.concateId].textareaComment.length > 0) {
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return false;
        };

        $scope.checkDaysDifference = function (dateParam1, dateParam2) {

            var date1 = new Date();
            var date2 = new Date();

            if (dateParam1)
                date1 = new Date(dateParam1);
            if (dateParam2)
                date2 = new Date(dateParam2);
            var timeDiff = 0;
            if (typeof dateParam1 != 'undefined' && typeof dateParam2 != 'undefined')
                timeDiff = Math.abs(date2.getTime() - date1.getTime());
            else
                return false;
            var diffDays;
            if (timeDiff > 0)
                diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diffDays >= 0)
                return true;
            else
                return false;
        };
		
		$scope.checkMedicalHistoryBodyPartSelection = function (){
        	// @shridhar : to print medical heading when no general data for medical history but body part selected
       
        	if ($scope) {
                if ($scope.report) {
                    if ($scope.report.data) {                    	
                        if ($scope.report.data.selectinjuries) {
                            if ($scope.report.data.selectinjuries.concatedbodypart) {
                                for (var i = 0; i < $scope.report.data.selectinjuries.concatedbodypart.length; i++) {
                                    var bodypart = $scope.report.data.selectinjuries.concatedbodypart[i];
                                   if(typeof $scope.report.data['relevantmedicalsocialhistory' + bodypart.concateId] !='undefined'){
                                	
	                                    if($cookies.formType == 'pr4'){
	                                    	
		                                	 if($scope.report.data.selectinjuries.concatedbodypart[i].ratebodyYesNoRadio=="Yes" && $scope.report.data.selectinjuries.concatedbodypart[i].ratebodypart==true){
			                                	 if($scope.report.data['relevantmedicalsocialhistory' + bodypart.concateId].disableradio !=1 && $scope.report.data['relevantmedicalsocialhistory' + bodypart.concateId].disableradio != 'No'){
			                                     	if ($scope.report.data['relevantmedicalsocialhistory' + bodypart.concateId]) {
			                                     		if($scope.checkExistById(bodypart,'relevantmedicalsocialhistory','btnPriorInjuryAddAnother')){
			                                     	    	return true;
			                                     	    }else if($scope.checkExistById(bodypart,'relevantmedicalsocialhistory','btnSurgeryForInjuryAddAnother')){
			                                     	    	return true;
			                                     	    }                                    	   
			 	                                    }
			                                     }
		                                	 }
		                                 }else{
		                                	 
		                                    if($scope.report.data['relevantmedicalsocialhistory' + bodypart.concateId].disableradio !=1 && $scope.report.data['relevantmedicalsocialhistory' + bodypart.concateId].disableradio != 'No'){
		                                    	if ($scope.report.data['relevantmedicalsocialhistory' + bodypart.concateId]) {
		                                    		if($scope.checkExistById(bodypart,'relevantmedicalsocialhistory','btnPriorInjuryAddAnother')){
		                                    	    	return true;
		                                    	    }else if($scope.checkExistById(bodypart,'relevantmedicalsocialhistory','btnSurgeryForInjuryAddAnother')){
		                                    	    	return true;
		                                    	    }                                    	   
			                                    }
		                                    }	                                   
		                                 }
	                                }
                                    
                                }
                            }
                        }
                    }
                }
            }
            return false;        	
        }
		
    })
    .controller('reportPreviewController', function ($scope, $http, $routeParams, reportdata, report, $modalInstance) {

        $scope.currentreport = reportdata;

        $scope.report = (report);

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('deleteReportPopUpCtrl', function ($scope, $http, $routeParams, reportid, $modalInstance, deletereport) {

        $scope.reportid = reportid;

        $scope.proceed = function () {
            $modalInstance.close('delete');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    })
    .controller('formdataDownloadCtrl', function ($scope, $http, $routeParams) {

    })
    .controller('confirmOpenReportctrl', function ($scope, $http, $routeParams, $cookieStore, $cookies, reportid, $modalInstance, $sce, $rootScope, $filter, socket, $location) {

        $scope.reportid = reportid;

        $scope.close = function () {
            $modalInstance.close('cancel');
        };

        $scope.yes = function () {
            $modalInstance.close('yes');
        };
    });
angular.module('ratefastApp')
.controller('injuryCtrl', function ($scope, $http, $validator, $routeParams, $cookieStore, $route, $modal, $q, $cookies, Auth, Injuries, StatesList, $filter, $rootScope, getExistingdata, getReportCardView, deletereport, openedReportTrack, socket, currentLoggedinUserdata, getdatafromAPI, rfacard,  getReportDataById, $sce, $sessionStorage, $location, $athenaModal) {
    //$scope.injuryplace = "";
    $('#isSpinnerImportInjury').hide();// Athena changes

	if(window.location.pathname!="/unsignedreports" && window.location.pathname!= "/completedpr4report" ){
        if(typeof ($sessionStorage.patientId)=='undefined'){
            debugger;
            $location.url('/admin/dashboard');
        }
    }

    $scope.IsdeleteInjury = false;
    $scope.Searchinjuries = true;
    $scope.isCreateinjury = true;
    $scope.firstpage = true;
    $scope.defaultpage = false;
    $scope.secondpage = false;
	  $scope.activityRFA=false;		//hide rfa activity
    $scope.rfapage = false;
    $scope.reportid = '';
    $scope.search1 = true;
	// Unais' comment: show nav bar when in report - Added check before showing
	if (document.getElementById("hideNavbar")) {
		if (document.getElementById("hideNavbar").style)
			document.getElementById("hideNavbar").style.visibility = "visible";
	}

    //document.getElementById("hideNavbar").style.visibility = "visible";
    $rootScope.reportStarted = false;
    //$scope.selectedbodypart = "asdsadsad";
    $scope.patientId = $rootScope.patientId;
    var patientid = $scope.patientId;
    if (!$scope.patientId) {
        $scope.patientId = $sessionStorage.patientId;
    }
    $scope.timeofinjury = new Date();
    //$scope.timeofinjury = $filter('date')(Date.now(), 'dd-MMMM-yyyy');
    //$scope.timeofinjury = Date.now();
    $scope.isCreateinjuryform = false;
    $scope.isshowcard = true;
    $scope.viewLibrary = true;
    $scope.editsectionfalse = false;
    $scope.injuryAdd = true;
    $scope.reportAddTypes = false;
    $scope.reportAdd = false;
    $scope.reportList = false;
    $scope.selectedIndex = -1;
    $scope.injurydata = new Object();
    $scope.isDone = true;
    $scope.locationaddressinjuryUpdate = false;
	  $rootScope.popupcalled=false;

    //$scope.dateofinjury = new Date();
    //$scope.dateofinjury = $filter('date')(Date.now(), 'dd-MMMM-yyyy');
    //$scope.dateoflastwork = $filter('date')(Date.now(), 'dd-MMMM-yyyy');
    //$scope.dateofpermanent = $filter('date')(Date.now(), 'dd-MMMM-yyyy');
    $scope.hstep = 1;
    $scope.mstep = 15;

	$scope.checkAthenaInjuryPackageID=function(athenapackageData){

    	if(typeof athenapackageData=='undefined'){
    		return false;
    	}else if(athenapackageData==0){
    		return false;
    	}else if(athenapackageData!=0){
    		return true;
    	}else{
    		return false;
    	}

    }


	$scope.checkMMIRateBody=function(){
		/*
		*this checkMMIRateBody() used to set form dirty to true.
		*so when any checkbox checkd, update button becomes visible for update
		*/
		$scope.acceptedbodypartform.$setDirty();
	}

	$scope.popupMessage = function (number) {
		var msg='';
		if(number==1){
			msg="<p>MMI stands for Maximum Medical Improvement. If the injury to this body part has stabilized and is unlikely to change substantially within the next year (with or without medical treatment), then the injury to this body part has reached MMI, or has become Permanent and Stationary.</p>"
		}else if(number==2)
		{
			msg="<p>Please provide the date when the injury/condition for this body part reached MMI. In other words, provide the date when the injury/condition of this body part became permanent and stationary.</p></br><p>If you have just determined that the injury/condition for this body part is unlikely to improve (with or without treatment), then enter today’s date.</p>"
		}

		$rootScope.modalInstance = $modal.open({
			template: '<div class="modal-header"><button type="button" class="close" aria-hidden="true" ng-click="close()">&times;</button><h3>RateFast</h3></div><div class="modal-body"><div class="login-sign"><h3>'+msg+'</h3></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Ok</button></div>',
			controller: 'popupButtonCtrlclose'
		});
	}

	//shri rfa activity data

	//confirm comments before save...call modal popup
		 $scope.confirmActivity = function (isValid) {
				$rootScope.userCommentValue=$("#userCommentTextarea").val();
				debugger;
			    if (isValid && $("#userCommentTextarea").val().length >0) {

					var template = 'partials/cancelPagePopupRFA.html';
					$rootScope.modalInstance = $modal.open({
						templateUrl: template,
						controller: 'injuryCtrl'
					});
					$rootScope.modalInstance.result.then(function() {
						if($rootScope.popupcalled){
							$scope.userComment="";
						}
				      });
				}
		 }

		 //close model popup
		 $scope.closeModel = function () {
			$rootScope.modalInstance.close();
        }

		 //back to rfa view
		 $scope.backInjury = function () {

			$scope.activityRFA=false;
			//$scope.viewLibrary = true;
			$scope.firstpage = true;
			$scope.editsectiontrue=true;
			$scope.isCreateinjuryform=true;
			 $scope.step = 5;
			 $scope.communicationtab = false;
			 $scope.firstpage = false;
			 $scope.secondpage = false;
			 $scope.defaultpage = false;
			 $scope.rfapage = true;
			 $scope.getRfaCard();
			$("#myform").show();

        }

		$scope.rfaStatusChange = function (rdostatus) {
			$scope.saveActivity(true);
		}
		$scope.rfaFaxStatusChange = function (rdofaxstatus) {
			$scope.saveActivity(true);
		}

		//update comments into database
		$scope.saveActivity = function (radiochange) {
			var userProfessionalData='';
			var query = {username: $rootScope.currentUser.username};
			$rootScope.popupcalled=true;

			var ser=rfacard.getUserData();
			ser.query(query, function (res) {}).$promise.then(function (response) {

				try
				{
					if(response[0]){
						userProfessionalData = response[0];
						userProfessionalData = $scope.getProfession(userProfessionalData.profession);
						if(userProfessionalData.length>0){
							userProfessionalData=','+userProfessionalData;
						}
					}
				}
				catch(err)
				{
					//console.log(err);
				}

				if (!$rootScope.objrfacard.rfas[$rootScope.objrfaIndexId].hasOwnProperty('comments')){
					$rootScope.objrfacard.rfas[$rootScope.objrfaIndexId].comments=[];
				}
				var radioCheckedValue=$("input[name='status']:checked").val();
				//if value not coming then use $parent
				var TreatingPhysician=$("#tdValue").text();

				if(radioCheckedValue!=$rootScope.oldselectedrfastatus)
				{
					debugger
					var objStatusInsert = {};
					objStatusInsert.comment 		= 	"Status change: "+TreatingPhysician+" changed status from "+ $rootScope.oldselectedrfastatus +" to "+ radioCheckedValue+"."
					objStatusInsert.submittedby 	= 	response[0].firstname+' '+response[0].lastname+''+userProfessionalData;
					objStatusInsert.createdDate		=	new Date();
					$rootScope.objrfacard.rfas[$rootScope.objrfaIndexId].comments.push(objStatusInsert);
				}
				/*
				*Update the comment only if any comment has been entered in the comment section
				*/

				if(typeof($rootScope.userCommentValue)!="undefined" && $rootScope.userCommentValue!=""){
					var objInsert 			= 	{};
					objInsert.comment 		= 	"Comment: "+$rootScope.userCommentValue;
					objInsert.submittedby 	= 	response[0].firstname+' '+response[0].lastname+''+userProfessionalData;
					objInsert.createdDate	=	new Date();
					$rootScope.objrfacard.rfas[$rootScope.objrfaIndexId].comments.push(objInsert);
				}



				//Change the fax status and save in the current RFA.
				$rootScope.objrfacard.rfas[$rootScope.objrfaIndexId].faxed	=	$("input[name='faxstatus']:checked").val();
				$rootScope.objrfacard.rfas[$rootScope.objrfaIndexId].status	=	$("input[name='status']:checked").val();
				$rootScope.oldfaxstatus										=	$("input[name='faxstatus']:checked").val();
				$scope.selectedRfacomment 									=	$rootScope.objrfacard.rfas[$rootScope.objrfaIndexId].comments;
				var serviceRfa=rfacard.updateRfaCard();
				serviceRfa.save($rootScope.objrfacard,function(){
					$("#userCommentTextarea").val('');
					$scope.userComment = null;
					$rootScope.userCommentValue='';
				});
				if(!radiochange){
					 $scope.closeModel();
				}
				$rootScope.oldselectedrfastatus =radioCheckedValue;
			});
		}

		//Added by Unais to load report dynamically from HTML
		$scope.getHTMLTemplatePreviewSubmit=function(formtype,version,flavor){
	    	/*
	    	 * this function return the template url
	    	 * url used to load file as per version and flavor defined
	    	 */
	    	var strTemplate="";

		    //if(typeof flavor=='undefined')
				flavor='a';
			 strTemplate="partials/"+formtype+"/v"+version+"/"+flavor+"/" + formtype + "-main.html";
		     return strTemplate;
	    }
		//preview

		//preview
		 $scope.reportPreviewRFA = function (newReportStatus) {
			 debugger;
			var formid = $rootScope.objrfacard.patientid;
			var reportstatus = $rootScope.objrfacard.formtype;
			$rootScope.currentUser;
			$scope.report=$rootScope.objrfacard;
			$scope.reportList2			={};

			//Added by Unais to populate template for report through HTML
			$scope.strTemplate =$scope.getHTMLTemplatePreviewSubmit($scope.report.formtype,$scope.report.version,'a');

			$scope.currentReportStatus=$rootScope.objrfacard.status;

			 getReportDataById.query({ reportid: $rootScope.objrfacard.reportpublishid }).$promise.then(function (result) {

				if (result[0].reportList.length > 0) {
					$scope.reportList2 = result[0].reportList[0].reportdata;
					$scope.reportFlavor = result[0].reportList[0].reportformat;

				}
				else {
					$scope.reportList = 'Blankdata';
				}
			    $rootScope.modalPreview = $modal.open({
					templateUrl: 'partials/reportpreview.html',
					windowClass: 'app-modal-window',
					controller: 'formdataPreviewCtrl',
					resolve: {
						report: function () {

							return $scope.report;
						},
						reportdata: function () {
							return $scope.reportList2;
						},
						reportFlavor: function () {
							return $scope.reportFlavor;
						},
						closedreport: function () {
							return $scope.closedreport;
						},
						submittedreportcount: function () {
							return '';
						},
						chargeReport: function () {
							return '';
						},
						newReportStatus: function () {
							return newReportStatus;
						},
						submitStatus: function () {
							return '';
						},
						submittedDate: function () {
							return $scope.submittedDate;
						},
						currentReportStatus: function () {

							return $scope.currentReportStatus;
						},
						strTemplate: function () {
							return $scope.strTemplate;
						}
					}
				});
				 $rootScope.modalPreview.result.then(function () {
					 $scope.reportList = false;
				}, function () {
					 $scope.reportList = false;
				});
			});
		};

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
		// end rfa activity

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };
    $scope.ismeridian = true;

    //$scope.isCreateinjury = false;
    $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy",
        showAnim: "clip",
        maxDate: new Date()
        //showOn: "button",
        //buttonImage: "../../images/Calendar.png",
        //buttonImageOnly: true
    };

    $scope.dateOptions2 = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy",
        showAnim: "clip",
    };


    /*
    $scope.InjurydateOptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "mm/dd/yy",
        showAnim: "clip",
        maxDate: new Date()
        //showOn: "button",
        //buttonImage: "../../images/Calendar.png",
        //buttonImageOnly: true
    };
    */
    $scope.UpdateHandedness = function () {
        debugger;
        Injuries.updateEmployeehandedness().save({ ptid: $scope.patientId, handedness: $scope.basicinformation.employeehandedness }, function () {
            debugger;
            alert('Employee Handedness Succesfully Updated!');
            $scope.updatehandedness = false;
        });
    };
    $scope.toggleMode = function () {
        $scope.ismeridian = !$scope.ismeridian;
    };

    $scope.update = function () {
        debugger;
        var d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        $scope.timeofinjury = d;
    };

    $scope.changed = function () {

    };

    $scope.openpopup = function (type) {
        var template = 'partials/createinjuryPopup.html';
        $rootScope.modalInstance = $modal.open({
            templateUrl: template,
            controller: 'ModalInstanceCtrll'
        });
    };

    $scope.editsection = false;
    $scope.select2Options = {
        allowClear: true,
        'multiple': true
    };

    $scope.next = function (pagee) {

    }

    $scope.tinymceOptions = {
        resize: false,
        menubar: false,
        plugins: '',
        browser_spellcheck: true,
        contextmenu: false,
        toolbar: "bold italic underline"
    };

    $scope.getTreatphyinfo = function (userId) {

        var treatPhy = 'Pending';
        if (userId) {
            var info = $filter('filter')($scope.allUserinfo, { _id: userId })[0];
            if (info) {
                treatPhy = $filter('capitalize')(info.firstname) + ' ' + $filter('capitalize')(info.lastname);
            }
        }
        return treatPhy;

    }
    //Global Scope
    $scope.currentUserid = $rootScope.currentUser.id;
    $scope.currentUserlevel = $rootScope.currentUser.role;
    $scope.currentUsername = $rootScope.currentUser.practicename;

    $scope.getPracticeUserList = function () {

        getdatafromAPI.query({ currentuserid: $scope.currentUsername, currentuserlevel: $scope.currentUserlevel }, function (response) {
            debugger;
            if (response[0]) {
                $scope.allUserinfo = response[0].userList;
            }
        });
    }

    $scope.setinjuryid = function (injid) {
        debugger;
        $scope.injuryid = injid;
    }

    $scope.OpenCommunicationtab = function () {
        $scope.InjuryDemographic($scope.injuryid);
        $scope.getcommunicationtab();
    }

    $scope.InjuryDemographic = function (injuryId) {
        debugger;

        $scope.getfirstpage();
        $scope.employercontactform.$setValidity('required', false);
        $scope.search2 = false;
        $scope.reportAddTypes = false;
        $scope.searchBox = false;
        $scope.searchReportBox = false;
        $scope.searchcolor = "";
        $scope.searchcolor1 = "";
        $scope.reportList = false;
        $scope.menushow = false;
        $scope.isLoad = true;

        var countobject = 0;
        $scope.injuryId = injuryId;
        debugger;

        Injuries.getidpinfo().query({ 'ptid': $sessionStorage.patientId, skip: 0 }, function (res) {

        }).$promise.then(function (response) {
            debugger;
            $scope.isLoad = false;
            $scope.editsectiontrue = true;

            $scope.InjuriesDate = response[0].injury;

            for (var i = 0; i < $scope.InjuriesDate.length; i++) {
                if ($scope.InjuriesDate[i]._id == injuryId) {
                    try {
                        $scope.selectedbodypart = $filter("filter")($scope.InjuriesDate[i].injurydata.acceptedbodyparts, { status: "current" })[0].injuredbodypart;
                    } catch (err) {
                        $scope.InjuriesDate[i].injurydata.acceptedbodyparts = $scope.injurydata.selectedbodypart = [{
                            injuredbodypart: [],
                            status: "current",
                            updateddate: Date.now(),
                            //timeofpriorevaluation: dtime,
                            updatedby: $rootScope.currentUser.username
                        }];
                    }
                    $scope.injurydata = $scope.InjuriesDate[i].injurydata;
                    $scope.injurydata.locationaddressinjury = $filter("filter")($scope.injurydata.locationaddressinjury, { status: "current" });

                    $scope.injurydata.acceptedbodyparts = $filter("filter")($scope.injurydata.acceptedbodyparts, { status: "current" });

                    if ($scope.injurydata.acceptedbodyparts[0].injuredbodypart.length > 0) {
                        $scope.isAcceptedbodypart = true;
                    } else {
                        $scope.isAcceptedbodypart = false;
                    }
                    debugger;
                    //$scope.sides = ['Left', 'Right', 'N/A'];
                    //var aaa = angular.fromJson($scope.injurydata.acceptedbodyparts[0].injuredbodypart);
                    for (var j = 0; j < angular.fromJson($scope.injurydata.acceptedbodyparts[0].injuredbodypart).length; j++) {
                        try {
                            $scope.sides[angular.fromJson($scope.injurydata.acceptedbodyparts[0].injuredbodypart[j]).bodypart] = angular.fromJson($scope.injurydata.acceptedbodyparts[0].injuredbodypart[j].bodypart).sides;
                        }
                        catch (err) {

                        }
                    }

                    $scope.injurydata.employer = $filter("filter")($scope.injurydata.employer, { status: "current" }).length > 0 ? $filter("filter")($scope.injurydata.employer, { status: "current" }) : $scope.injurydata.employer;
                    $scope.injurydata.employment = $filter("filter")($scope.injurydata.employment, { status: "current" }).length > 0 ? $filter("filter")($scope.injurydata.employment, { status: "current" }) : $scope.injurydata.employment;
                    $scope.injurydata.employeraddress = $filter("filter")($scope.injurydata.employeraddress, { status: "current" }).length > 0 ? $filter("filter")($scope.injurydata.employeraddress, { status: "current" }) : $scope.injurydata.employeraddress;
                    //$filter("removeblank")($scope.injurydata.employeraddress);
                    $scope.injurydata.employercontact = $filter("filter")($scope.injurydata.employercontact, { status: "current" }).length > 0 ? $filter("filter")($scope.injurydata.employercontact, { status: "current" }) : $scope.injurydata.employercontact;
                    //$filter("removeblank")($scope.injurydata.employercontact);
                    $scope.injurydata.insurance = $filter("filter")($scope.injurydata.insurance, { status: "current" }).length > 0 ? $filter("filter")($scope.injurydata.insurance, { status: "current" }) : $scope.injurydata.insurance;
                    $scope.injurydata.claimsadjuster = $filter("filter")($scope.injurydata.claimsadjuster, { status: "current" }).length > 0 ? $filter("filter")($scope.injurydata.claimsadjuster, { status: "current" }) : $scope.injurydata.claimsadjuster;
                    $scope.injurydata.billreview = $filter("filter")($scope.injurydata.billreview, { status: "current" }).length > 0 ? $filter("filter")($scope.injurydata.billreview, { status: "current" }) : $scope.injurydata.billreview;
                    $scope.injurydata.utilizationreview = $filter("filter")($scope.injurydata.utilizationreview, { status: "current" }).length > 0 ? $filter("filter")($scope.injurydata.utilizationreview, { status: "current" }) : $scope.injurydata.utilizationreview;
                    $scope.injurydata.applicantattorney = $filter("filter")($scope.injurydata.applicantattorney, { status: "current" }).length > 0 ? $filter("filter")($scope.injurydata.applicantattorney, { status: "current" }) : $scope.injurydata.applicantattorney;
                    $scope.injurydata.defenseattorney = $filter("filter")($scope.injurydata.defenseattorney, { status: "current" }).length > 0 ? $filter("filter")($scope.injurydata.defenseattorney, { status: "current" }) : $scope.injurydata.defenseattorney;
                    $scope.injurydata.rncasemanager = $filter("filter")($scope.injurydata.rncasemanager, { status: "current" }).length > 0 ? $filter("filter")($scope.injurydata.rncasemanager, { status: "current" }) : $scope.injurydata.rncasemanager;
                    $scope.dateofinjury = $scope.InjuriesDate[i].injurydata.injuryinformation[0].dateofinjury;
                    $scope.dateoflastwork = $scope.InjuriesDate[i].injurydata.injuryinformation[0].dateoflastwork;
                    $scope.dateofpermanent = $scope.InjuriesDate[i].injurydata.injuryinformation[0].dateofpermanent;
                    $scope.dateofpriorevaluation = $scope.InjuriesDate[i].injurydata.injuryinformation[0].dateofpriorevaluation;

                    $scope.timeofinjury = $scope.InjuriesDate[i].injurydata.injuryinformation[0].timeofinjury;
                    $scope.communication = $scope.InjuriesDate[i].injurydata.communication;

                    $scope.viewLibrary = false;
                    $scope.reportList = false;
                    //$scope.injurydata.employment = [];
                    $scope.isCreateinjuryformclick();

					//Below query added by Unais dated 30th Oct, 2015 to check for number of reports and if 0, then accordingly display "Delete Injury" button
					getReportCardView.query({ patientid: $sessionStorage.patientId, injuryid: injuryId }, function (response) {
						if (response[0]) {
							$scope.IsdeleteInjury = true;
						}
						else
						{
							$scope.IsdeleteInjury = false;
						}
					}).$promise.then(function (response) {
					});


                    break;
                }
            }
        });

        Injuries.addViewer().save({ 'username': $rootScope.currentUser.username, 'injid': injuryId }, function (res) {

        });

        // for update button
        for (var i = 0; i < $scope.injurydata.locationaddressinjury.length; i++) {

            angular.forEach($scope.injurydata.locationaddressinjury[i], function (genre, index) {

                countobject = countobject + 1;
            });
            if (countobject > 4) {
                $scope.locationaddressinjuryUpdate = true;
            }
        }
        countobject = 0;

        for (var i = 0; i < $scope.injurydata.acceptedbodyparts.length; i++) {
            angular.forEach($scope.injurydata.acceptedbodyparts[i], function (genre, index) {
                countobject = countobject + 1;
            });
            if (countobject > 4) {
                $scope.acceptedbodypartsUpdate = true;
            }
            break;
        }
        countobject = 0;
        for (var i = 0; i < $scope.injurydata.employer.length; i++) {
            angular.forEach($scope.injurydata.employer[i], function (genre, index) {
                countobject = countobject + 1;
            });
            if (countobject > 4) {
                $scope.employerUpdate = true;
            }
            break;
        }
        countobject = 0;
        for (var i = 0; i < $scope.injurydata.employeraddress.length; i++) {
            angular.forEach($scope.injurydata.employeraddress[i], function (genre, index) {
                countobject = countobject + 1;
            });
            if (countobject > 4) {
                $scope.employeraddressUpdate = true;
            }
            break;
        }
        countobject = 0;
        for (var i = 0; i < $scope.injurydata.employercontact.length; i++) {
            angular.forEach($scope.injurydata.employercontact[i], function (genre, index) {
                countobject = countobject + 1;
            });
            debugger;
            if (countobject > 3) {
                $scope.employercontactUpdate = true;
            }
            break;
        }
        countobject = 0;
        for (var i = 0; i < $scope.injurydata.insurance.length; i++) {
            angular.forEach($scope.injurydata.insurance[i], function (genre, index) {
                countobject = countobject + 1;
            });
            if (countobject > 4) {
                $scope.insuranceUpdate = true;
            }
            break;
        }
        countobject = 0;
        for (var i = 0; i < $scope.injurydata.claimsadjuster.length; i++) {
            angular.forEach($scope.injurydata.claimsadjuster[i], function (genre, index) {

                countobject = countobject + 1;
            });
            if (countobject > 4) {
                $scope.claimsadjusterUpdate = true;
            }
            break;
        }
        countobject = 0;
        for (var i = 0; i < $scope.injurydata.billreview.length; i++) {

            angular.forEach($scope.injurydata.billreview[i], function (genre, index) {
                countobject = countobject + 1;
            });
            if (countobject > 4) {
                $scope.billreviewUpdate = true;
            }
            break;
        }
        countobject = 0;
        for (var i = 0; i < $scope.injurydata.utilizationreview.length; i++) {
            angular.forEach($scope.injurydata.utilizationreview[i], function (genre, index) {
                countobject = countobject + 1;
            });
            if (countobject > 4) {
                $scope.utilizationreviewUpdate = true;
            }
            break;
        }
        countobject = 0;
        for (var i = 0; i < $scope.injurydata.applicantattorney.length; i++) {
            angular.forEach($scope.injurydata.applicantattorney[i], function (genre, index) {
                countobject = countobject + 1;
            });
            if (countobject > 4) {
                $scope.applicantattorneyUpdate = true;
            }
            break;
        }
        countobject = 0;
        for (var i = 0; i < $scope.injurydata.defenseattorney.length; i++) {
            angular.forEach($scope.injurydata.defenseattorney[i], function (genre, index) {
                countobject = countobject + 1;
            });
            if (countobject > 4) {
                $scope.defenseattorneyUpdate = true;
            }
            break;
        }
        countobject = 0;
        for (var i = 0; i < $scope.injurydata.rncasemanager.length; i++) {
            angular.forEach($scope.injurydata.rncasemanager[i], function (genre, index) {
                countobject = countobject + 1;
            });
            if (countobject > 4) {
                $scope.rncasemanagerUpdate = true;
            }
            break;
        }
        debugger;
        if ($scope.injurydata.injuryinformation[0].additionaldetail) {
            $scope.Isadditionaldetail = true;
        }
        $scope.changedetect.$setPristine();
    }

    $scope.computeCssClass = function (last) {
        if (last && $scope.isReportpage) {
            return "btn btn-primary";
        }
    }

    $scope.openReportCreationMode = function () {
		$('#btnStartReport').attr('disabled', true);
        debugger;
        if ($scope.dateofinjury && $scope.dateofinjury != 'Invalid Date') {
            $scope.editsectiontrue = false;
            $scope.injurydata.injuryinformation[0].dateofinjury = $scope.dateofinjury;
            $scope.injurydata.injuryinformation[0].timeofinjury = $scope.timeofinjury;
            $scope.injurydata.injuryinformation[0].dateoflastwork = $scope.dateoflastwork;
            $scope.injurydata.injuryinformation[0].dateofpermanent = $scope.dateofpermanent;
            Injuries.saveinjuries().save({ injurydata: $scope.injurydata, ptid: $scope.patientId }, function (respp) {
                Injuries.getlatestinjuries().query({ ptid: $scope.patientId, skip: 0 }, function (res) {
                    debugger;
                    $scope.InjuriesDate = $scope.sortDate(res[0].injury);
                    $scope.totalItems = $scope.InjuriesDate.length;
                    //$scope.PopupinjuryId = $filter('orderBy')($scope.InjuriesDate, 'modifieddate', 'reverse');
                    $scope.PopupinjuryId = $scope.InjuriesDate[0]._id;
                    $scope.injuryId = $scope.PopupinjuryId;
                    $scope.basicinformation = res[0].basicinformation[0];
                    $scope.viewLibrary = true;
                    $scope.injuryAdd = false;
                    $scope.reportAdd = false;
                    $scope.reportExit = true;
                    $scope.reportAddTypes = true;
                    $scope.reportList = false;
                    var totaldata = new Array;
                    $scope.dateofInj = new Array();
                    //totaldata = $scope.InjuriesDate;
                    $scope.InjuriesDatelist = totaldata.slice(0, 5);
                    $scope.InjuriesDatelist = totaldata;
                    $scope.totalItems = $scope.InjuriesDate.length;
                    //$scope.selectInjury(0, $scope.injuryId);
                }).$promise.then(function (response) {
                    var totaldata = $scope.InjuriesDate;
                    $scope.InjuriesDatelist = totaldata.slice(0, 5);
                    $scope.totalItems = $scope.InjuriesDate.length;
                    $scope.editsectionfalse = false;
                    $scope.selectInjury(0, $scope.injuryId);
                    $scope.enterReportCreationMode();
                });
            });
            $scope.reportCreationMode = true;
            //$route.reload();
        } else {
            alert('Please enter date of injury!');
			$('#btnStartReport').attr('disabled', false);
        }

    }



    $scope.enterReportCreationMode = function (location) {
        debugger;
        if (location != 'fromparentpage') {
            $scope.checkvalidateBodypart($scope.injurydata.acceptedbodyparts[0]);
            debugger;
        } else {
            $scope.isRepeat = false;
        }
        $scope.searchReportBox = false;
        if ($scope.acceptedbodypartform.$valid && $scope.isRepeat == false) {
            debugger;
            if ($scope.changedetect.$dirty && !location) {
                if (!$scope.UpdateInjuryInfo()) return false;
            }
            if ($scope.employerform.$dirty || $scope.Empinfopageform.$dirty || $scope.acceptedbodypartform.$dirty || $scope.employeraddressform.$dirty || $scope.employercontactform.$dirty || $scope.insuranceform.$dirty || $scope.claimsadjusterform.$dirty || $scope.billreviewform.$dirty || $scope.utilizationreviewform.$dirty || $scope.applicantattorneyform.$dirty || $scope.defenseattorneyform.$dirty || $scope.rncasemanagerform.$dirty || $scope.communicationform.$dirty) {
                $scope.update_Createreport();
            }
            //if ($scope.isFirst_timeinjury) {
            //    debugger;
            //    $scope.injurydata.acceptedbodyparts[0].injuredbodypart = $scope.selectedbodypart;
            //    $scope.injurydata.injuryinformation[0].dateofinjury = $scope.dateofinjury;
            //    $scope.injurydata.injuryinformation[0].dateoflastwork = $scope.dateoflastwork;
            //    $scope.injurydata.injuryinformation[0].dateofpermanent = $scope.dateofpermanent;
            //    $scope.injurydata.injuryinformation[0].timeofinjury = $scope.timeofinjury;

            //    Injuries.updateinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata }, function (res) {
            //        debugger;
            //        $scope.initInjuriesinfo();
            //    }).$promise.then(function () {
            //        debugger;
            //        $scope.editsectiontrue = false;
            //        $scope.editsectionfalse = false;
            //        $scope.viewLibrary = true;
            //        $scope.injuryAdd = false;
            //        $scope.reportAdd = false;
            //        $scope.reportExit = true;
            //        $scope.reportAddTypes = true;
            //        $scope.reportList = false;
            //        $scope.step = 4;
            //    });
            //} else {
            //    debugger;
            //    $scope.editsectiontrue = false;
            //    $scope.editsectionfalse = false;
            //    $scope.viewLibrary = true;
            //    $scope.injuryAdd = false;
            //    $scope.reportAdd = false;
            //    $scope.reportExit = true;
            //    $scope.reportAddTypes = true;
            //    $scope.reportList = false;
            //    $scope.step = 4;
            //}

            $scope.editsectiontrue = false;
            $scope.editsectionfalse = false;
            $scope.viewLibrary = true;
            $scope.injuryAdd = false;
            $scope.reportAdd = false;
            $scope.reportExit = true;
            $scope.reportAddTypes = true;
            $scope.reportList = false;
            $scope.step = 4;

        } else {
            if ($scope.isRepeat == false) {
                alert('Please enter valid Injured Body System!');
            }
        }

        //$scope.selectInjury(0, $scope.injuryId);
    }

    $scope.exitReportCreationMode = function () {
        $scope.injuryAdd = true;
        $scope.reportExit = false;
        $scope.reportAddTypes = false;
        $scope.isDone = false;
    }

    $scope.addInjury = function () {
        debugger;
        //$scope.searchBoxmethod();
        //$scope.searchBoxmethod1();
        $scope.isCreateinjuryform = false;
        $scope.isDone = true;
        $scope.hideSelectInjury = false;
        $scope.search1 = false;
        $scope.searchBox = false;
        $scope.searchReportBox = false;
        $scope.searchcolor = "";
        $scope.searchcolor1 = "";
        $scope.menushow = true;
        $scope.editsectionfalse = true;
        $scope.viewLibrary = false;
        $scope.reportList = false;
        //$scope.dateofinjury = new Date();
		$scope.dateofinjury = '';
    }

    $scope.selectInjury = function ($index, selectedInjuryId, injuryDate) {
        debugger;

        $scope.isLoad = true;
        $scope.patients = new Array;

        if (!$scope.isFirst_timeinjury) {

            $scope.searchBox = false;
            $scope.searchReportBox = false;
            $scope.searchcolor = "";
            $scope.searchcolor1 = "";
            $scope.search1 = false;
            $scope.search2 = true;
        }
        var patientid = $scope.patientId;
        var injuryId = selectedInjuryId;
        var reportcategory = reportcategory;
        $scope.selectedInjuryId = selectedInjuryId;
        delete $sessionStorage.InjuryId;
        if ($sessionStorage.InjuryId) {
            delete $sessionStorage.InjuryId;
        }
        if ($cookies.dateofInjury) {
            delete $sessionStorage.InjuryId;
        }
        $sessionStorage.InjuryId = selectedInjuryId;
        $cookies.dateofInjury = injuryDate;
        $scope.selectedIndex = $index;
        debugger

        getReportCardView.query({ patientid: patientid, injuryid: injuryId }, function (response) {
            debugger;
            if (response[0]) {
                debugger;
                $scope.IsdeleteInjury = true;
                $scope.reportid = response[0].patients[0]._id;
            }
        }).$promise.then(function (response) {
            debugger
            $scope.isLoad = false;
            if (response[0]) {
                debugger;
                for (var i = 0; i < response[0].patients.length; i++) {
                    if (response[0].patients[i].state == $cookies.selectedStatecode) {
                        $scope.patients.push(response[0].patients[i]);
                        $scope.noreport = true;
                        $scope.norecords = false;
                    }
                }
            }
            else {
                $scope.noreport = false;
                $scope.norecords = false;
            }
        });

        getExistingdata.query({ patientid: patientid, injuryid: injuryId }, function (response) {
            debugger;
            if (response[0]) {
                debugger;
                $scope.IsdeleteInjury = true;
                $scope.reportid = response[0].patients[0]._id;
            }
        }).$promise.then(function (response) {
            debugger
            $scope.isLoad = false;
            if (response[0]) {
                debugger;
                for (var i = 0; i < response[0].patients.length; i++) {
                    if (response[0].patients[i].state == $cookies.selectedStatecode) {
                        $scope.patients.push(response[0].patients[i]);
                        $scope.noreport = true;
                        $scope.norecords = false;
                    }
                }
            }
            else {
                $scope.noreport = false;
                $scope.norecords = false;
            }
            if ($scope.reportid) {
                Injuries.getreportinfo().query({ repid: $scope.reportid, skip: 0 }, function (res) {
                    $scope.visitdate = res[0].modifieddate;
                    $scope.provider = res[0].modifiedby;
                    debugger;
                });
            }
        });
        if (!$scope.isFirst_timeinjury) {

            if ($rootScope.currentUser.level == 'level1') {
                $scope.reportAdd = false;
            }
            else {
                $scope.reportAdd = true;
            }

            $scope.reportExit = false;
            $scope.reportList = true;
            $scope.reportAddTypes = false;
        }
    }

    // Main Script
    $scope.usersList = new Array();
    $scope.searchBoxmethod = function () {
        debugger
        if ($scope.usersList.length == 0) {
            debugger;
            Injuries.getuserlist().query({ practiceaccnt: $scope.currentUser.practicename }, function (users) {
                debugger
                $scope.usersList = users;
            });
        }
        if (!$scope.searchBox) {
            $scope.searchcolor = "searchborder";
        } else {
            $scope.searchcolor = "";
        }
        $scope.searchBox = !$scope.searchBox;
        $scope.searchcolor1 = "";
        $scope.searchReportBox = false;
    }
    $scope.searchBoxmethod1 = function () {
        debugger
        $scope.searchcolor = "";
        $scope.searchBox = false;
        if ($scope.usersList.length == 0) {
            Injuries.getuserlist().query({ practiceaccnt: $scope.currentUser.practicename }, function (users) {
                debugger;
                $scope.usersList = users;
            });
        }
        if (!$scope.searchReportBox) {
            $scope.searchcolor1 = "searchborder";
        } else {
            $scope.searchcolor1 = "";
        }
        $scope.searchReportBox = !$scope.searchReportBox;
        $scope.search = new Object();
        $scope.search.provider = new Object();
    }
    $scope.createNewInjury = function () {
        $scope.isCreateinjury = false;
    }

    $scope.isCreateinjuryformclick = function (isadd) {
        debugger;
        if ($scope.dateofinjury && $scope.dateofinjury != 'Invalid Date') {

            $scope.menushow = false;
            $scope.search1 = false;
            // Open Report Creation Mode
            if (isadd) {
                $scope.injurydata.injuryinformation[0].dateofinjury = $scope.dateofinjury;
                $scope.injurydata.injuryinformation[0].timeofinjury = $scope.timeofinjury;
                $scope.injurydata.injuryinformation[0].dateoflastwork = $scope.dateoflastwork;
                $scope.injurydata.injuryinformation[0].dateofpermanent = $scope.dateofpermanent;

                Injuries.saveinjuries().save({ injurydata: $scope.injurydata, ptid: $scope.patientId }, function (respp) {
                    debugger;
                    Injuries.getlatestinjuries().query({ ptid: $scope.patientId, skip: 0 }, function (res) {
                        $scope.InjuriesDate = res[0].injury;
                        $scope.totalItems = $scope.InjuriesDate.length;
                        debugger;
                        $scope.PopupinjuryId = $scope.InjuriesDate[$scope.InjuriesDate.length - 1]._id;
                        $scope.injuryId = $scope.InjuriesDate[$scope.InjuriesDate.length - 1]._id;
                        $scope.basicinformation = $filter("filter")(res[0].basicinformation, { 'status': 'current' })[0];
                        $scope.dateofInj = new Array();
                        $scope.InjuriesDate = $scope.sortDate(res[0].injury);
                        var totaldata = $scope.InjuriesDate;
                        $scope.InjuriesDatelist = totaldata.slice(0, 5);
                        $scope.totalItems = $scope.InjuriesDate.length;
                        $scope.isFirst_timeinjury = true;
                        $scope.selectInjury(0, $scope.injuryId);
                    });
                }, function (err) {
                }).$promise.then(function (response) {

                });
            }
            //$scope.injurydata.injuryinformation[0].dateofinjury = $filter('date')($scope.dateofinjury, 'd-MMM-y');
            $scope.hideSelectInjury = true;
            $scope.isCreateinjuryform = true;
        } else {
            alert('Please enter date of injury!');
        }

    }

    $scope.getStates = function () {
        StatesList.query(function (states) {
            $scope.states = states;
        });
    }

    var dtime = new Date();
    dtime.setHours(24);
    dtime.setMinutes(0);


    $scope.initAdmin = function () {
        $scope.injurydata.insurance = [{
            status: "current",
            insurance_claimsadministrator: '',
            insurance_claimsnumber: '',
            insuranceaddressline1: '',
            insuranceaddressline2: '',
            insurancecity: '',
            insurancestate: '',
            insurancezipcode: '',
            updateddate: Date.now(),
            updatedby: $rootScope.currentUser.username
        }];
        $scope.injurydata.claimsadjuster = [{
            status: "current",
            updateddate: Date.now(),
            updatedby: $rootScope.currentUser.username,
            claimsadjuster_firstname: '',
            claimsadjuster_lastname: '',
            claimsadjuster_email: '',
            claimsadjuster_telephoneno: '',
            claimsadjuster_extension: '',
            claimsadjuster_fax: '',
            claimsadjuster_address: '',
            claimsadjuster_city: '',
            claimsadjuster_state: '',
            claimsadjuster_zipcode: '',
            claimsadjuster_company: ''
        }];
        $scope.injurydata.billreview = [{
            status: "current",
            updateddate: Date.now(),
            updatedby: $rootScope.currentUser.username,
            billreview_firstname: '',
            billreview_lastname: '',
            billreview_email: '',
            billreview_telephoneno: '',
            billreview_extension: '',
            billreview_fax: '',
            billreview_address: '',
            billreview_city: '',
            billreview_state: '',
            billreview_zipcode: '',
            billreview_company: ''
        }];
        $scope.injurydata.utilizationreview = [{
            status: "current",
            updateddate: Date.now(),
            updatedby: $rootScope.currentUser.username,
            utilizationreview_firstname: '',
            utilizationreview_lastname: '',
            utilizationreview_email: '',
            utilizationreview_telephoneno: '',
            utilizationreview_extension: '',
            utilizationreview_fax: '',
            utilizationreview_address: '',
            utilizationreview_city: '',
            utilizationreview_state: '',
            utilizationreview_zipcode: '',
            utilizationreview_company: ''
        }];
        $scope.injurydata.applicantattorney = [{
            status: "current",
            updateddate: Date.now(),
            updatedby: $rootScope.currentUser.username,
            applicantattorney_firstname: '',
            applicantattorney_lastname: '',
            applicantattorney_email: '',
            applicantattorney_telephoneno: '',
            applicantattorney_extension: '',
            applicantattorney_fax: '',
            applicantattorney_address: '',
            applicantattorney_city: '',
            applicantattorney_state: '',
            applicantattorney_zipcode: '',
            applicantattorney_company: ''
        }];
        $scope.injurydata.defenseattorney = [{
            status: "current",
            updateddate: Date.now(),
            updatedby: $rootScope.currentUser.username,
            defenseattorney_firstname: '',
            defenseattorney_lastname: '',
            defenseattorney_email: '',
            defenseattorney_telephoneno: '',
            defenseattorney_extension: '',
            defenseattorney_fax: '',
            defenseattorney_address: '',
            defenseattorney_city: '',
            defenseattorney_state: '',
            defenseattorney_zipcode: '',
            defenseattorney_company: ''
        }];
        $scope.injurydata.rncasemanager = [{
            status: "current",
            updateddate: Date.now(),
            updatedby: $rootScope.currentUser.username,
            rncasemanager_firstname: '',
            rncasemanager_lastname: '',
            rncasemanager_email: '',
            rncasemanager_telephoneno: '',
            rncasemanager_extension: '',
            rncasemanager_fax: '',
            rncasemanager_address: '',
            rncasemanager_city: '',
            rncasemanager_state: '',
            rncasemanager_zipcode: '',
            rncasemanager_company: ''
        }];

    };

    $scope.initemployeer = function () {
        $scope.injurydata.locationaddressinjury = [{
            status: "current",
            updateddate: Date.now(),
            updatedby: $rootScope.currentUser.username,
            location_address1: '',
            location_address2: '',
            location_zipcode: '',
            location_city: '',
            location_state: ''
        }];


        $scope.injurydata.acceptedbodyparts = [{
            injuredbodypart: [],
            status: "current",
            updateddate: Date.now(),
            //timeofpriorevaluation: dtime,
            updatedby: $rootScope.currentUser.username
        }];
        $scope.injurydata.employer = [{
            status: "current",
            company: '',
            updateddate: Date.now(),
            othernatureofbusiness: '',
            natureofbusiness: '',
            emp_telephone: '',
            emp_extension: '',
			emp_fax: '',
            updatedby: $rootScope.currentUser.username
        }];
        $scope.injurydata.employment = [{
            status: "current",
            updateddate: Date.now(),
            durationofemployement: '',
            durationtype: '',
            jobtitle: '',
            updatedby: $rootScope.currentUser.username
        }];
        $scope.injurydata.employeraddress = [{
            emp_address1: '',
            emp_address2: '',
            emp_city: '',
            emp_state: '',
            emp_zipcode: '',
            status: "current",
            updateddate: Date.now(),
            updatedby: $rootScope.currentUser.username
        }];
        $scope.injurydata.employercontact = [{
            employercontact_firstname: '',
            employercontact_lastname: '',
            employercontact_email: '',
            employercontact_telephoneno: '',
            employercontact_extension: '',
            employercontact_fax: '',
            employercontact_address: '',
            employercontact_city: '',
            employercontact_state: '',
            employercontact_zipcode: '',
            status: "current",
            updateddate: Date.now(),
            updatedby: $rootScope.currentUser.username
        }];
    }

    $scope.initinjuryinformation = function () {
        $scope.injurydata.injuryinformation = [{
            status: "current",
            updateddate: Date.now(),
            updatedby: $rootScope.currentUser.username
        }];
        $scope.injurydata.viewinformation = [{
            viewdate: Date.now(),
            viewby: $rootScope.currentUser.username
        }];
    }

    $scope.initCommunication = function () {
        $scope.communication = {
            patientcommunicationcomment: '',
            admincommunicationcomment: '',
            diagnostictesting: '',
            othernotes: ''
        }
    }

    $scope.initAdmin();
    $scope.initemployeer();
    $scope.initinjuryinformation();
    $scope.initCommunication();

    $scope.selectedbodypart = new Array();

    // $scope.bodyparts = [{ bodysystem: 'Spine', id: 'cervical', text: 'Cervical', sequence: 7, selectable: true }, { bodysystem: 'Spine', id: 'thoracic', text: 'Thoracic', sequence: 8, selectable: true }, { bodysystem: 'Spine', id: 'lumbar', text: 'Lumbar', sequence: 9, selectable: true }, { bodysystem: 'Upper Extremity', id: 'shoulder', text: 'Shoulder', sequence: 12, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'elbow', text: 'Elbow', sequence: 13, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'wrist', text: 'Wrist', sequence: 14, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'thumb', text: 'Thumb', sequence: 15, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingerindex', text: 'Index Finger', sequence: 16, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingermiddle', text: 'Middle Finger', sequence: 17, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingerring', text: 'Ring Finger', sequence: 18, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingerlittle', text: 'Little Finger', sequence: 19, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'pelviship', text: 'Hip/Pelvis', sequence: 21, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'knee', text: 'Knee', sequence: 22, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'anklefoot', text: 'Ankle/foot', sequence: 23, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'toe', text: 'Toe(s)', sequence: 24, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Other', id: 'other', text: 'Other', sequence: 26, sides: ['Right', 'Left', 'N/A'], selectable: true }, { bodysystem: 'Skin', id: 'neck', text: 'Head/Neck', sequence: 1, selectable: true }, { bodysystem: 'Skin', id: 'upperextremity', text: 'Upper Extremity', sequence: 2, sides: ['Left', 'Right'], selectable: true }, { bodysystem: 'Skin', id: 'trunk', text: 'Trunk', sequence: 3, selectable: true }, { bodysystem: 'Skin', id: 'lowerextremity', text: 'Lower Extremity', sequence: 4, sides: ['Left', 'Right'], selectable: true }, { bodysystem: 'Skin', id: 'groingenitalia', text: 'Groin/Genitalia', sequence: 5, selectable: true }];
    $scope.bodyparts = [{ bodysystem: 'Spine', id: 'cervical', text: 'Cervical', sequence: 1, selectable: true }, { bodysystem: 'Spine', id: 'thoracic', text: 'Thoracic', sequence: 2, selectable: true }, { bodysystem: 'Spine', id: 'lumbar', text: 'Lumbar', sequence: 3, selectable: true }, { bodysystem: 'Upper Extremity', id: 'shoulder', text: 'Shoulder', sequence: 4, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'elbow', text: 'Elbow', sequence: 5, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'wrist', text: 'Wrist', sequence: 6, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'thumb', text: 'Thumb', sequence: 7, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingerindex', text: 'Index Finger', sequence: 8, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingermiddle', text: 'Middle Finger', sequence: 9, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingerring', text: 'Ring Finger', sequence: 10, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingerlittle', text: 'Little Finger', sequence: 11, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'pelviship', text: 'Hip/Pelvis', sequence: 12, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'knee', text: 'Knee', sequence: 13, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'anklefoot', text: 'Ankle/foot', sequence: 14, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'toe', text: 'Toe(s)', sequence: 15, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Other', id: 'other', text: 'Other', sequence: 16, sides: ['Right', 'Left', 'N/A'], selectable: true }, { bodysystem: 'Skin', id: 'neck', text: 'Head/Neck', sequence: 17, selectable: true }, { bodysystem: 'Skin', id: 'upperextremity', text: 'Upper Extremity', sequence: 18, sides: ['Left', 'Right'], selectable: true }, { bodysystem: 'Skin', id: 'trunk', text: 'Trunk', sequence: 19, selectable: true }, { bodysystem: 'Skin', id: 'lowerextremity', text: 'Lower Extremity', sequence: 20, sides: ['Left', 'Right'], selectable: true }, { bodysystem: 'Skin', id: 'groingenitalia', text: 'Groin/Genitalia', sequence: 21, selectable: true }];
    $scope.bodysystem = ['Spine', 'Upper Extremity', 'Lower Extremity', 'Skin', 'Other'];
    $scope.AddanotherImage = true;

    $scope.addAnother = function (iseDeleted) {

        $scope.isAcceptedbodypart = true;
        //NEW
        for (var i = 0; i < $scope.selectedbodypart.length; i++) {
            debugger;
            var isOther = angular.fromJson($scope.selectedbodypart[i].bodypart).text;
            if (isOther.toLowerCase() != 'other') {
                if (!angular.fromJson($scope.selectedbodypart[i].bodypart).sides) {
                    var DDD = $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text });
                    $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text })[0].selectable = false;


                } else {
                    var k = angular.fromJson($scope.selectedbodypart[i].bodypart).sides;
                    var sds = ($scope.selectedbodypart[i].bodypartsides);
                    var p = $scope.sides[$scope.selectedbodypart[i].bodypart].indexOf(sds);
                    if (p != -1) {
                        var lala = $scope.selectedbodypart[i].bodypart;
                        $scope.sides[$scope.selectedbodypart[i].bodypart].splice($scope.sides[$scope.selectedbodypart[i].bodypart].indexOf(sds), 1);
                    }
                    if ($scope.sides[$scope.selectedbodypart[i].bodypart].length == 0) {
                        $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text })[0].selectable = false;
                    } else {
                        $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text })[0].selectable = true;
                    }
                    //$filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text })[0].selectable = false;
                }
            }
        }
        $scope.injurydata.acceptedbodyparts[0].injuredbodypart = $scope.selectedbodypart;
        //$scope.merge(angular.fromJson($scope.selectedbodypart[$scope.selectedbodypart.length - 1].bodypart).id
        if (!iseDeleted) {
            $scope.AddanotherImage = false;
            $scope.selectedbodypart.push({ bodypart: '', bodypart_mechanism: '' });
        }
    };

    $scope.sides = new Object();
    $scope.changebodypart = function (bdpart, index) {

        //if ($filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text })[0].selectable)

        var data = angular.fromJson(bdpart);
        debugger;
        if (!data.sides) {
            //data.sides = 'None';
            index.bodypartsides = 'None';
            index.Hidebdpartsides = true;
            debugger;
        }
        else {

            index.Hidebdpartsides = false;
        }
        if (!$scope.sides[index.bodypart]) {
            $scope.sides[index.bodypart] = data.sides;
        }
        //$scope.sides = angular.fromJson(bdpart).sides;
        //$scope.selectedbodypart = index;
        if (data.sequence == 28) {
            index.otherBodypartshow = true;
        }
        //$scope.addAnotherBlanck();
    }


    $scope.addAnotherBlanck = function () {
        debugger;
        $scope.isAcceptedbodypart = true;
        //NEW
        for (var i = 0; i < $scope.selectedbodypart.length; i++) {
            debugger;
            var isOther = angular.fromJson($scope.selectedbodypart[i].bodypart).text;
            if (isOther.toLowerCase() != 'other') {
                if (!angular.fromJson($scope.selectedbodypart[i].bodypart).sides) {


                    $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text })[0].selectable = false;

                } else {
                    var k = angular.fromJson($scope.selectedbodypart[i].bodypart).sides;
                    var sds = ($scope.selectedbodypart[i].bodypartsides);
                    var p = $scope.sides[$scope.selectedbodypart[i].bodypart].indexOf(sds);
                    if (p != -1) {
                        var lala = $scope.selectedbodypart[i].bodypart;
                        $scope.sides[$scope.selectedbodypart[i].bodypart].splice($scope.sides[$scope.selectedbodypart[i].bodypart].indexOf(sds), 1);
                    }
                    if ($scope.sides[$scope.selectedbodypart[i].bodypart].length == 0) {
                        $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text })[0].selectable = false;
                    } else {
                        $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text })[0].selectable = true;
                    }
                    //$filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[i].bodypart).text })[0].selectable = false;
                }
            }
        }
        $scope.injurydata.acceptedbodyparts[0].injuredbodypart = $scope.selectedbodypart;

        //if (!iseDeleted) {
        //    $scope.AddanotherImage = false;
        //    $scope.selectedbodypart.push({ bodypart: '', bodypart_mechanism: '' });
        //}
    };


    $scope.loadbdpartsides = function (index) {
        debugger;
        //index.bodypart = index.otherBodyparts;
        //$scope.sides[index.bodypart] = ['Left', 'Right', 'N/A'];
        //index.sides[index.bodysystem] = ['Left', 'Right', 'N/A'];
        //index.Hidebdpartsides = false;
    };

    $scope.changebodypartmechanism = function (bdpart, index) {
        $scope.AddanotherImage = true;
        //$scope.selectedbodypart = index;
        if (bdpart == "Other") {
            index.otherbodypart_mechanismshow = true;
        }
    };

    $scope.changebodysystem = function (bdpart, index, arrayindex) {
        debugger;
        if (index.bodypart != "" && index.bodypart) {

            var confi = confirm("If you change the body system, then the other menus for this body part will reset. Are you sure that you want to continue?");
            if (confi) {
                $scope.selectedbodypart[arrayindex] = {}
                $scope.selectedbodypart[arrayindex].bodysystem = index.bodysystem;
            } else {
                index.bodysystem = angular.fromJson(bdpart).bodysystem
            }
        }
        if (index.bodysystem == 'Other') {
            index.bodypart = angular.toJson({ "bodysystem": "Other", "id": "other", "text": "Other", "sequence": 31, "sides": ["Right", "Left", "N/A"] });
            $scope.sides[index.bodypart] = ['Left', 'Right', 'N/A'];
        }
    };

    $scope.clearbodypart = function (index) {
        debugger;
        var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.selectedbodypart[index] = {};
        }
    };

    $scope.deletebodypart = function (index) {

        var confi = confirm("If you delete this row, you will lose all selections you have made for this body part.");
        if (confi) {
            $scope.acceptedbodypartform.$dirty = true;
            $scope.acceptedbodypartsUpdate = true;
            $scope.AddanotherImage = true;
            debugger;
            if ($scope.selectedbodypart[index].bodypartsides) {
                if ($scope.sides[$scope.selectedbodypart[index].bodypart]) {
                    if ($scope.sides[$scope.selectedbodypart[index].bodypart].indexOf($scope.selectedbodypart[index].bodypartsides) == -1) {
                        $scope.sides[$scope.selectedbodypart[index].bodypart].push($scope.selectedbodypart[index].bodypartsides);
                    }
                } else {
                    var aa = angular.fromJson($scope.selectedbodypart[index].bodypart).text;
                    var fdfd = $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[index].bodypart).text })[0];
                    $filter("filter")($scope.bodyparts, { text: angular.fromJson($scope.selectedbodypart[index].bodypart).text })[0].selectable = true;
                }
            }
            $scope.selectedbodypart.splice(index, 1);
            //$scope.sides[$scope.selectedbodypart[i].bodypart].splice($scope.sides[$scope.selectedbodypart[i].bodypart].indexOf(sds), 1);

            debugger;
            if ($scope.selectedbodypart.length == 0) {
                $scope.isAcceptedbodypart = false;
            }
            $scope.addAnother(true);
        }
    };

    var prevdata;
    $scope.copyAddress = function () {
        debugger;
        if ($scope.copy_address == "1") {
            prevdata = $scope.injurydata.locationaddressinjury;
            $scope.injurydata.locationaddressinjury[0].location_address1 = $scope.injurydata.employeraddress[0].emp_address1;
            $scope.injurydata.locationaddressinjury[0].location_address2 = $scope.injurydata.employeraddress[0].emp_address2;
            $scope.injurydata.locationaddressinjury[0].location_city = $scope.injurydata.employeraddress[0].emp_city;
            $scope.injurydata.locationaddressinjury[0].location_state = $scope.injurydata.employeraddress[0].emp_state;
            $scope.injurydata.locationaddressinjury[0].location_zipcode = $scope.injurydata.employeraddress[0].emp_zipcode;
        }
        else {

            //$scope.injurydata.employeraddress[0] = null;
            $scope.injurydata.locationaddressinjury = [{
                status: "current",
                updateddate: Date.now(),
                updatedby: $rootScope.currentUser.username
            }];
        }
    }

    $scope.getLocation = function (val) {

        return $http.get('/api/getclaimadmin', {
            params: {
                q: val,
                sensor: false
            }
        }).then(function (res) {

            var addresses = [];
            angular.forEach(res.data, function (item) {
                addresses.push(item.text);
            });
            return addresses;
        });
    };
    $scope.step = 2;

    $scope.unknown = function (model, ngdisable, check) {

        var disable = "";
        var condi = "";
        if (check == "1") {
            for (var i = 0; i < model.split(',').length; i++) {
                var a = model.split(',')[i];
                debugger;
                if (model.split(',')[i] == 'injurydata.employercontact[0].employercontact_email') {
                    $scope.employercontactform.empcontactemail.$setValidity('required', true);
                    $scope.employercontactform.empcontactemail.$setValidity('email', true);
                    //$scope.employercontactform.$valid = true;
                } else {
                    var value = $scope.$eval(model.split(',')[i]);
                    if (!$scope.$eval(model.split(',')[i])) {
                        //condi = model.split(',')[i] + "=' '";
                        condi = model.split(',')[i] + "=' '";
                        debugger;
                    }
                }
                $scope.$eval(condi);

            }
            //disable = ngdisable + "=true";
            //$scope.$eval(disable);
        } else {
            debugger;
            for (var i = 0; i < model.split(',').length; i++) {
                condi = model.split(',')[i] + "=" + "''";
                $scope.$eval(condi);
            }
            //disable = ngdisable + "=false";
            //$scope.$eval(disable);
        }

    }

    $scope.checkDetail = function (data) {
        debugger;
        if (data.viewby == 'siteadmin') {
            return true;
        } else {
            var a = $scope.dateofInj.indexOf(data);
            $scope.dateofInj.splice(a, 1);
            return false;
        }
        //return Math.random();
    }

    var totaldata = new Array;
    debugger;

	    /*
     * Shridhar 24 oct 2016 :  this function used to set patient confirmed = true
     */
    $scope.setPatientConfirmed= function(confirmed){
    	if(confirmed==false){
        	Injuries.updatePatientConfirmStatus().save({ ptid: $scope.patientId }, function () {
        		$scope.patientConfirmed=true;
        		alert("Patient successfully confirmed.");
        	});
    	}
   }

    //GT:PSHA 06th April 2015
    $scope.injuryLibrary = function () {
        Injuries.getinjurylibrary().query({ ptid: $sessionStorage.patientId, skip: 0 }, function (res) {
            $scope.dateofInj = new Array();
            $scope.InjuriesDate = $scope.sortDate(res[0].injury);
            totaldata = $scope.InjuriesDate;
            $scope.InjuriesDatelist = totaldata.slice(0, 5);
            //$scope.InjuriesDatelist = totaldata;
            $scope.totalItems = $scope.InjuriesDate.length;
            $scope.basicinformation = $filter("filter")(res[0].basicinformation, { status: "current" })[0];
			$scope.patientConfirmed=typeof res[0].confirmed == 'undefined'? true : res[0].confirmed;

			// Athena changes (To get athenapatinetID)
            $scope.athena_patientid = res[0].athena_patientid;
        });
    }
    //End

    $scope.initInjuriesinfo = function () {
        Injuries.getlatestinjuries().query({ ptid: $sessionStorage.patientId, skip: 0 }, function (res) {
            debugger;
            $scope.dateofInj = new Array();
            $scope.InjuriesDate = $scope.sortDate(res[0].injury);
            totaldata = $scope.InjuriesDate;
            $scope.InjuriesDatelist = totaldata.slice(0, 5);
            //$scope.InjuriesDatelist = totaldata;
            $scope.totalItems = $scope.InjuriesDate.length;
            $scope.basicinformation = $filter("filter")(res[0].basicinformation, { status: "current" })[0];
        });
    }

    $scope.getlatestinjuryforReport = function () {
        debugger;
        Injuries.getlatestinjuries().query({ ptid: $scope.patientId, skip: 0 }, function (res) {
            debugger;
            $scope.dateofInj = new Array();
            $scope.InjuriesDate = $scope.sortDate(res[0].injury);
            totaldata = $scope.InjuriesDate;
            $scope.InjuriesDatelist = totaldata.slice(0, 5);
            $scope.totalItems = $scope.InjuriesDate.length;
            $scope.basicinformation = $filter("filter")(res[0].basicinformation, { status: "current" })[0];
            debugger;
            $scope.InjuryDemographic($rootScope.InjuryId);
            debugger;
        }).$promise.then(function () {

        });
    }

    $scope.listinjury = function (page) {
        debugger;
        $scope.InjuriesDatelist = $scope.InjuriesDate;
        $scope.InjuriesDatelist = $scope.InjuriesDatelist.slice(5 * (page - 1), 5 * page);
    };

    var swipecount = 1;

    $scope.swiperight = function () {
        debugger
        //swipecount = swipecount - 1;
        var page = swipecount - 1;
        var list = $scope.InjuriesDate;
        var cnt = list.slice(5 * (page - 1), 5 * page).length;
        if (list.slice(5 * (page - 1), 5 * page).length > 0) {
            $scope.InjuriesDatelist = list.slice(5 * (page - 1), 5 * page);
            swipecount = swipecount - 1;
        }
    };

    $scope.swipeleft = function () {
        debugger
        var page = swipecount + 1;
        var list = $scope.InjuriesDate;
        var cnt = list.slice(5 * (page - 1), 5 * page).length;
        if (list.slice(5 * (page - 1), 5 * page).length > 0) {
            $scope.InjuriesDatelist = list.slice(5 * (page - 1), 5 * page);
            swipecount = swipecount + 1;
        }
    }
    $scope.injurydata.createddate = new Date();

    $scope.getcommunicationtab = function () {
         var ab = $validator.validate($scope, 'injurydata.acceptedbodyparts');
         ab.success(function () {
             debugger;
             $scope.step = 4;
             $scope.communicationtab = true;
             $scope.firstpage = false;
             $scope.secondpage = false;
             $scope.defaultpage = false;
     		//Hide RFASection on other menu click
     		$scope.rfapage = false;
         });
         return ab.error(function () {
             debugger;
             alert('Please complete the Injured Body System(s) section.');

         });
    }

    $scope.getback = function () {
        debugger;
        $scope.firstpage = true;
        $scope.secondpage = false;
    };

    $scope.checkToggleMode = function () {
        debugger;
        var billReviewcnt = Object.keys($scope.injurydata.billreview[0]);
        billReviewcnt.splice(billReviewcnt.indexOf('status'), 1);
        billReviewcnt.splice(billReviewcnt.indexOf("updateddate"), 1);
        billReviewcnt.splice(billReviewcnt.indexOf("updatedby"), 1);
        billReviewcnt.splice(billReviewcnt.indexOf("_id"), 1);
        billReviewcnt.splice(billReviewcnt.indexOf("id"), 1);

        for (var i = 0; i < billReviewcnt.length; i++) {
            var billArray = $scope.injurydata.billreview[0][billReviewcnt[i]];
            if (billArray) {
                $scope.$broadcast('event:togglebill');
                break;
            }
        }

        var utilizationreviewcnt = Object.keys($scope.injurydata.utilizationreview[0]);
        utilizationreviewcnt.splice(utilizationreviewcnt.indexOf('status'), 1);
        utilizationreviewcnt.splice(utilizationreviewcnt.indexOf("updateddate"), 1);
        utilizationreviewcnt.splice(utilizationreviewcnt.indexOf("updatedby"), 1);
        utilizationreviewcnt.splice(utilizationreviewcnt.indexOf("_id"), 1);
        utilizationreviewcnt.splice(utilizationreviewcnt.indexOf("id"), 1);

        for (var i = 0; i < utilizationreviewcnt.length; i++) {
            var utilizationArray = $scope.injurydata.utilizationreview[0][utilizationreviewcnt[i]];
            if (utilizationArray) {
                $scope.$broadcast('event:togglereview');
                break;
            }
        }

        var applicantattorneycnt = Object.keys($scope.injurydata.applicantattorney[0]);
        applicantattorneycnt.splice(applicantattorneycnt.indexOf('status'), 1);
        applicantattorneycnt.splice(applicantattorneycnt.indexOf("updateddate"), 1);
        applicantattorneycnt.splice(applicantattorneycnt.indexOf("updatedby"), 1);
        applicantattorneycnt.splice(applicantattorneycnt.indexOf("_id"), 1);
        applicantattorneycnt.splice(applicantattorneycnt.indexOf("id"), 1);

        for (var i = 0; i < applicantattorneycnt.length; i++) {
            var applicantattorneyArray = $scope.injurydata.applicantattorney[0][applicantattorneycnt[i]];
            if (applicantattorneyArray) {
                $scope.$broadcast('event:toggleattorney');
                break;
            }
        }

        var defenseattorneycnt = Object.keys($scope.injurydata.defenseattorney[0]);
        defenseattorneycnt.splice(defenseattorneycnt.indexOf('status'), 1);
        defenseattorneycnt.splice(defenseattorneycnt.indexOf("updateddate"), 1);
        defenseattorneycnt.splice(defenseattorneycnt.indexOf("updatedby"), 1);
        defenseattorneycnt.splice(defenseattorneycnt.indexOf("_id"), 1);
        defenseattorneycnt.splice(defenseattorneycnt.indexOf("id"), 1);

        for (var i = 0; i < defenseattorneycnt.length; i++) {
            var defenseattorneyArray = $scope.injurydata.defenseattorney[0][defenseattorneycnt[i]];
            if (defenseattorneyArray) {
                $scope.$broadcast('event:toggledattorney');
                break;
            }
        }

        var rncasemanagercnt = Object.keys($scope.injurydata.rncasemanager[0]);
        rncasemanagercnt.splice(rncasemanagercnt.indexOf('status'), 1);
        rncasemanagercnt.splice(rncasemanagercnt.indexOf("updateddate"), 1);
        rncasemanagercnt.splice(rncasemanagercnt.indexOf("updatedby"), 1);
        rncasemanagercnt.splice(rncasemanagercnt.indexOf("_id"), 1);
        rncasemanagercnt.splice(rncasemanagercnt.indexOf("id"), 1);

        for (var i = 0; i < rncasemanagercnt.length; i++) {
            var rncasemanagerArray = $scope.injurydata.rncasemanager[0][rncasemanagercnt[i]];
            if (rncasemanagerArray) {
                $scope.$broadcast('event:togglerncase');
                break;
            }
        }
    }

    $scope.getnextpage = function () {
        var ab = $validator.validate($scope, 'injurydata.acceptedbodyparts');
        ab.success(function () {
            $scope.firstpage = false;
            $scope.step = 3;
            $scope.defaultpage = false;
            $scope.secondpage = true;
            $scope.communicationtab = false;
            $scope.checkToggleMode();
			//Hide RFASection on other menu click
			$scope.rfapage = false;
            //return false;
        });
        return ab.error(function () {
            alert('Please complete the Injured Body System(s) section.');

        });
        //var cll = $scope.employerform.$invalid || $scope.changedetect1.$invalid || $scope.acceptedbodypartform.$invalid || $scope.employeraddressform.$invalid || $scope.employercontactform.$invalid;
        if ($scope.employerform.$valid && $scope.changedetect1.$valid && $scope.acceptedbodypartform.$valid && $scope.employeraddressform.$valid) {
            $scope.firstpage = false;
            $scope.step = 3;
            $scope.defaultpage = false;
            $scope.secondpage = true;
        } else {
            alert("Please fill out all of the required fields");
            //$scope.firstpage = true;
            //$scope.secondpage = false;

            //v = $validator.validate($scope, 'injury');
            //v.success(function () {
            //    debugger;
            //    $scope.firstpage = false;
            //    $scope.secondpage = true;
            //});
            //return v.error(function () {
            //    debugger;

            //});

        }

    };

    $scope.setothervalue = function () {
        debugger;
        $scope.injurydata.employer[0].othernatureofbusiness = ($scope.injurydata.employer[0].natureofbusiness == 'Other') ? $scope.injurydata.employer[0].othernatureofbusiness : ' ';
    };

    $scope.toggleMode = function () {
        $scope.$broadcast('event:togglebill');
    };

    $scope.toggleModetoggleReview = function () {
        debugger;
        $scope.$broadcast('event:togglereview');
    };

    $scope.toggleModetoggleantattorney = function () {
        debugger;
        $scope.$broadcast('event:toggleattorney');
    };

    $scope.toggleModetoggleDefense = function () {
        debugger;
        $scope.$broadcast('event:toggledattorney');
    };

    $scope.toggleModerncasemanager = function () {
        debugger;
        $scope.$broadcast('event:togglerncase');
    };

    $scope.getfirstpage = function () {

		var ab = $validator.validate($scope, 'injurydata.acceptedbodyparts');
        ab.success(function () {
            debugger;
            $scope.step = 2;
            $scope.communicationtab = false;
            $scope.firstpage = true;
            $scope.secondpage = false;
            $scope.defaultpage = false;
    		$scope.rfapage = false;
        });
        return ab.error(function () {
            debugger;
            alert('Please complete the Injured Body System(s) section.');
        });

    };

    $scope.emailattribute = '[email]';
    $scope.getbackdefaultpage = function () {

        if ($scope.Empinfopageform.durationtype.$error.required) {
            alert("Please select Duration Type");
            return false;
        }
        //$scope.addAnotherBlanck();
        debugger;
        /*

        if ($scope.employercontactform.empcontactemail.$error.email) {
            alert('Please fill out all of the required fields');
            return false;
        }
        else if (!$scope.injurydata.employer[0].company) {
            var emp = $validator.validate($scope, 'injurydata.employer');
            return emp.error(function () {
                debugger;
                alert('Please fill out all of the required fields');
                //return console.log('error');
            });
        }
        else if (!$scope.injurydata.employer[0].natureofbusiness) {
            var emp = $validator.validate($scope, 'injurydata.employer');
            return emp.error(function () {
                debugger;
                alert('Please fill out all of the required fields');
                //return console.log('error');
            });
        }
        else {
            var ea = $validator.validate($scope, 'injurydata.employeraddress');
            ea.success(function () {
                debugger;
                var ec = $validator.validate($scope, 'injurydata.employercontact');
                ec.success(function () {
                    debugger;
                    var la = $validator.validate($scope, 'injurydata.locationaddressinjury');
                    la.success(function () {
                        debugger;
                        $scope.step = 1;
                        $scope.secondpage = false;
                        $scope.firstpage = false;
                        $scope.defaultpage = true;
                        return '';

                    });
                    return la.error(function () {
                        debugger;
                        alert('Please fill out all of the required fields');
                        //return console.log('error');
                    });
                });
                return ec.error(function () {
                    debugger;
                    alert('Please fill out all of the required fields');
                    //return console.log('error');
                });
            });
            return ea.error(function () {
                debugger;
                alert('Please fill out all of the required fields');
                //return console.log('error');
            });
        }
        */
        var ec = $validator.validate($scope, 'injurydata.employercontact');
        ec.success(function () {
            debugger;
            var la = $validator.validate($scope, 'injurydata.locationaddressinjury');
            la.success(function () {
                debugger;
                $scope.step = 1;
                $scope.secondpage = false;
                $scope.firstpage = false;
                $scope.defaultpage = true;
                $scope.communicationtab = false;
				//Hide RFASection on other menu click
				$scope.rfapage = false;
                return '';
            });
        });
        return ec.error(function () {
            debugger;
            alert('Please fill out all of the required fields');
            //return console.log('error');
        });
    }

    $scope.saveCommunication = function () {

        $scope.patientcommunicationcomment_condition = false;
        $scope.admincommunicationcomment_condition = false;
        $scope.diagnostictesting_condition = false;
        $scope.othernotes_condition = false;
        $scope.communicationform.$dirty = false;

        Injuries.updatecommunicationinfo().save({ injid: $scope.injuryId, communicationinfo:  $scope.injurydata.communication }, function (res) {
            debugger;
        });
    }

    $scope.CommEval = function (expression) {
        $scope.$eval(expression);
    }

    $scope.UpdateInjuryInfo = function () {
        debugger;
        if ($scope.dateofinjury && $scope.dateofinjury != 'Invalid Date') {
            var witness = {};
            debugger;
            witness;
            $scope.injurydata.injuryinformation[0].dateofinjury = $scope.dateofinjury;
            $scope.injurydata.injuryinformation[0].timeofinjury = $scope.timeofinjury;
            $scope.injurydata.injuryinformation[0].dateoflastwork = $scope.dateoflastwork;
            $scope.injurydata.injuryinformation[0].dateofpermanent = $scope.dateofpermanent;
            Injuries.updateinjuryinfo().save({ injid: $scope.injuryId, injuryinformation: $scope.injurydata.injuryinformation }, function (res) {
                debugger;
            }).$promise.then(function () {
                if ($scope.changedetect) {
                    $scope.changedetect.$setPristine();
                }
            });
        } else {
            alert('Please enter date of injury!');
            return false;
        }
        return true;
    }

    $scope.injury = {

        submit: function () {
            if ($scope.dateofinjury && $scope.dateofinjury != 'Invalid Date') {
                if ($scope.acceptedbodypartform.$valid) {
                    var v;
                    v = $validator.validate($scope, 'injury');
                    v.success(function () {
                        debugger;
                        $scope.injurydata.acceptedbodyparts[0].injuredbodypart = $scope.selectedbodypart;
                        $scope.injurydata.injuryinformation[0].dateofinjury = $scope.dateofinjury;
                        $scope.injurydata.injuryinformation[0].dateoflastwork = $scope.dateoflastwork;
                        $scope.injurydata.injuryinformation[0].dateofpermanent = $scope.dateofpermanent;
                        if ($filter('date')($scope.timeofinjury, 'shortTime')) {
                            $scope.injurydata.injuryinformation[0].timeofinjury = $scope.timeofinjury;
                        } else {
                            $scope.injurydata.injuryinformation[0].timeofinjury = $scope.timeofinjury;
                        }
                        Injuries.updateinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata }, function (res) {
                        }).$promise.then(function () {
                            $route.reload();
                        })
                    });
                    return v.error(function () {
                        return console.log('error');
                    });
                } else {
                    alert('Please enter valid Bodypart System!');
                }
            } else {
                alert('Please enter date of injury!');
            }
        },
        reset: function (modalname) {
            debugger;
            var resetform = confirm("If you continue, you will lose all current information on this form.");
            debugger;
            if (resetform) {
                //$scope.initdata();
                if (modalname == 'employeer') {
                    $scope.initemployeer();
                    $scope.basicinformation.employeehandedness = '';
                    $scope.selectedbodypart = new Array();
                }
                if (modalname == 'injuryinfo') {
                    $scope.initinjuryinformation();
                }
                if (modalname == 'admin') {
                    $scope.initAdmin();
                }
				if (modalname == 'communication') {
                	$scope.initCommunication();
                }
            }
            return $validator.reset($scope, $scope.injurydata);
        }

    };
    $scope.isReload = false;
    debugger;
    $scope.archiveAcceptedbodypartModal = function () {
        var template = 'partials/acceptedBodypartArchive.html';
        $rootScope.modalInstance = $modal.open({
            templateUrl: template,
            windowClass: 'app-modal-window',
            controller: 'archivectrl',
            resolve: {
                text: function () {
                    return 'acceptedbodyparts';
                },
                injuryId: function () {
                    return $scope.injuryId;
                }, page: function () {
                    return '';
                },
                isReload: function () {
                    return false;
                }
            }
        });
        $rootScope.modalInstance.result.then(function (currentdata) {
            debugger
            $scope.sides = new Array();
            $scope.bodyparts = [{ bodysystem: 'Spine', id: 'cervical', text: 'Cervical', sequence: 1, selectable: true }, { bodysystem: 'Spine', id: 'thoracic', text: 'Thoracic', sequence: 2, selectable: true }, { bodysystem: 'Spine', id: 'lumbar', text: 'Lumbar', sequence: 3, selectable: true }, { bodysystem: 'Upper Extremity', id: 'shoulder', text: 'Shoulder', sequence: 4, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'elbow', text: 'Elbow', sequence: 5, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'wrist', text: 'Wrist', sequence: 6, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'thumb', text: 'Thumb', sequence: 7, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingerindex', text: 'Index Finger', sequence: 8, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingermiddle', text: 'Middle Finger', sequence: 9, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingerring', text: 'Ring Finger', sequence: 10, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Upper Extremity', id: 'fingerlittle', text: 'Little Finger', sequence: 11, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'pelviship', text: 'Hip/Pelvis', sequence: 12, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'knee', text: 'Knee', sequence: 13, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'anklefoot', text: 'Ankle/foot', sequence: 14, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Lower Extremity', id: 'toe', text: 'Toe(s)', sequence: 15, sides: ['Right', 'Left'], selectable: true }, { bodysystem: 'Other', id: 'other', text: 'Other', sequence: 16, sides: ['Right', 'Left', 'N/A'], selectable: true }, { bodysystem: 'Skin', id: 'neck', text: 'Head/Neck', sequence: 17, selectable: true }, { bodysystem: 'Skin', id: 'upperextremity', text: 'Upper Extremity', sequence: 18, sides: ['Left', 'Right'], selectable: true }, { bodysystem: 'Skin', id: 'trunk', text: 'Trunk', sequence: 19, selectable: true }, { bodysystem: 'Skin', id: 'lowerextremity', text: 'Lower Extremity', sequence: 20, sides: ['Left', 'Right'], selectable: true }, { bodysystem: 'Skin', id: 'groingenitalia', text: 'Groin/Genitalia', sequence: 21, selectable: true }];
            $scope.bodysystem = ['Spine', 'Upper Extremity', 'Lower Extremity', 'Skin', 'Other'];
            for (var j = 0; j < angular.fromJson(currentdata.injuredbodypart).length; j++) {
                try {
                    $scope.sides[angular.fromJson(currentdata.injuredbodypart[j]).bodypart] = angular.fromJson(currentdata.injuredbodypart[j].bodypart).sides;
                }
                catch (err) {

                }
            }
            $scope.injurydata['acceptedbodyparts'][0] = currentdata;
            $scope.selectedbodypart = currentdata.injuredbodypart;
        }, function () {

        });
    }
    debugger;
    $scope.openarchivepopup = function (text) {
        debugger;
        var template = 'partials/archivepopup.html';
        $rootScope.modalInstance = $modal.open({
            templateUrl: template,
            windowClass: 'pdp-modal-window',
            controller: 'archivectrl',
            resolve: {
                text: function () {
                    return text;
                },
                injuryId: function () {
                    return $scope.injuryId;
                }, page: function () {
                    return ''
                },
                isReload: function () {
                    return false;
                }
            }
        });
        $rootScope.modalInstance.result.then(function (currentdata) {
            debugger
            $scope.injurydata[text][0] = currentdata;
        }, function () {

        });
    };

    $scope.checkvalidateBodypart = function (datamodel) {
        debugger;
        var isRepeat = false;
        var deferred = $q.defer();
        var count = '';
        if (datamodel.injuredbodypart) {
            for (var i = 0; i < datamodel.injuredbodypart.length; i++) {
                var isRepeatbodyPart = $filter('filter')(datamodel.injuredbodypart, { bodysystem: datamodel.injuredbodypart[i].bodysystem, bodypartsides: datamodel.injuredbodypart[i].bodypartsides, bodypart: datamodel.injuredbodypart[i].bodypart }).length;
                if (datamodel.injuredbodypart[i].bodysystem != 'Other') {
                    count = $filter('filter')(datamodel.injuredbodypart, { bodysystem: datamodel.injuredbodypart[i].bodysystem, bodypartsides: datamodel.injuredbodypart[i].bodypartsides, bodypart: datamodel.injuredbodypart[i].bodypart }).length;
                } else {
                    count = $filter('filter')(datamodel.injuredbodypart, { otherBodysystem: datamodel.injuredbodypart[i].otherBodysystem, bodypartsides: datamodel.injuredbodypart[i].bodypartsides, otherBodyparts: datamodel.injuredbodypart[i].otherBodyparts }).length;
                }
                if (count > 1) {
                    isRepeat = true;
                    try {
                        alert('You cannot add the body part "' + angular.fromJson(datamodel.injuredbodypart[i].bodypart).text + '" twice.');
                    } catch (error) {
                        alert("Please complete the Injured Body System(s) section.");
                        return false;
                    }
                    break;
                }
            }
        }
        deferred.resolve(isRepeat);
        $scope.isRepeat = isRepeat;
        return deferred.promise;
    }

    $scope.addEntity = function (text, datamodel, formname, updatefrom) {
        debugger;
		if (typeof(updatefrom)==='undefined') updatefrom = 'Ratefast';

        var promise = $scope.checkvalidateBodypart(datamodel);
        promise.then(function (isRepeat) {
            debugger;
            $scope.isRepeat = isRepeat;
            debugger;
            if (formname == 'employercontactform') {
                var validate = true;
            } else {
                var validate = $scope.$eval(formname + '.$valid');
            }
            if (validate && !isRepeat) {
                datamodel.status = "current";
                delete datamodel._id;
                $scope.$eval(formname + '.$setPristine()');
                Injuries.updatesubinjuriesforbdpart().save({ injid: $scope.injuryId, injurydata: datamodel, text: text, changetoarchive: true }, function (res) {
                }).$promise.then(function () {
                    debugger;
                    Injuries.updatesubinjuriesforbdpart().save({ injid: $scope.injuryId, injurydata: datamodel, text: text, changetoarchive: false }, function (res) {
                        debugger;
                        if(updatefrom !='Athena'){
                           alert("Succesfully updated!");
                       }

                    });
                });
            }
        });
    };

    $scope.gotoDemographics = function (text) {

		//Following code commented as a redirect is also happening on the click of the link. So, the below code is of no use.
        /*if ($scope.reportCreationMode) {
            var template = 'partials/commonPopUp.html';
            $rootScope.modalInstance = $modal.open({
                templateUrl: template,
                controller: 'archivectrl',
                resolve: {
                    text: function () {
                        return text;
                    },
                    injuryId: function () {
                        return $cookies.injuryId;
                    },
                    page: function () {
                        return 'gotopatientpage'
                    },
                    isReload: function () {
                        return false;
                    }
                }
            });
            $rootScope.modalInstance.result.then(function (injuryId) {
                if (injuryId) {
                    $scope.InjuryDemographic(injuryId);
                }
            }, function () {

            });
        }*/
    };

    $scope.gotoPatientpage = function () {
        debugger;
        window.location = 'patientdemographics/' + $scope.patientId;
    };



    $scope.createInjuryCancel = function (text) {
        debugger;
        if ($scope.dateofinjury && $scope.dateofinjury != 'Invalid Date') {

            if ($scope.employerform.$dirty || $scope.Empinfopageform.$dirty || $scope.changedetect1.$dirty || $scope.acceptedbodypartform.$dirty || $scope.employeraddressform.$dirty || $scope.employercontactform.$dirty || $scope.insuranceform.$dirty || $scope.claimsadjusterform.$dirty || $scope.billreviewform.$dirty || $scope.utilizationreviewform.$dirty || $scope.applicantattorneyform.$dirty || $scope.defenseattorneyform.$dirty || $scope.rncasemanagerform.$dirty || $scope.changedetect.$dirty || $scope.updatehandedness || $scope.communicationform.$dirty) {
                debugger;
                $scope.editsectiontrue;//demographic
                $scope.editsectionfalse;//New Injury
                var template = 'partials/cancelPagePopup.html';
                //var template = 'partials/commonPopUp.html';
                $rootScope.modalInstance = $modal.open({
                    templateUrl: template,
                    controller: 'archivectrl',
                    resolve: {
                        text: function () {
                            return text;
                        },
                        injuryId: function () {
                            return $scope.PopupinjuryId;
                        },
                        page: function () {
                            return 'gotoinjurypage'
                        },
                        isReload: function () {
                            return false;
                        }
                    }

                });
                $rootScope.modalInstance.result.then(function (injuryId) {
                    debugger;
                    var v;
                    v = $validator.validate($scope, 'injury');
                    v.success(function () {
                        debugger;
                        if ($scope.communicationform.$dirty) {
                            $scope.saveCommunication();
                        }
                        if ($scope.employerform.$dirty) {
                            $scope.injurydata.employer[0].status = "current";
                            delete $scope.injurydata.employer[0]._id;
                            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employer[0], text: 'injury.$.injurydata.employer' }, function (res) {

                            }).$promise.then();
                        }
                        if ($scope.Empinfopageform.$dirty) {
                            $scope.injurydata.employment[0].status = "current";
                            delete $scope.injurydata.employment[0]._id;
                            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employment[0], text: 'injury.$.injurydata.employment' }, function (res) {

                            }).$promise.then();
                        }

                        if ($scope.changedetect1.$dirty) {
                            $scope.injurydata.locationaddressinjury[0].status = "current";
                            delete $scope.injurydata.locationaddressinjury[0]._id;
                            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.locationaddressinjury[0], text: 'injury.$.injurydata.locationaddressinjury' }, function (res) {

                            })
                        }
                        if ($scope.acceptedbodypartform.$dirty) {
                            $scope.checkvalidateBodypart($scope.injurydata.acceptedbodyparts[0]);
                            debugger;
                            if ($scope.acceptedbodypartform.$valid && $scope.isRepeat == false) {
                                $scope.injurydata.acceptedbodyparts[0].status = "current";
                                delete $scope.injurydata.acceptedbodyparts[0]._id;
                                Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.acceptedbodyparts[0], text: 'injury.$.injurydata.acceptedbodyparts' }, function (res) {

                                })
                            } else {
                                if ($scope.isRepeat == false) {
                                    alert('Please complete the Injured Body System(s) section.');
                                }
                                return false;
                            }
                        }
                        if ($scope.employeraddressform.$dirty) {
                            $scope.injurydata.employeraddress[0].status = "current";
                            delete $scope.injurydata.employeraddress[0]._id;
                            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employeraddress[0], text: 'injury.$.injurydata.employeraddress' }, function (res) {

                            })
                        }
                        if ($scope.employercontactform.$dirty) {
                            $scope.injurydata.employercontact[0].status = "current";
                            delete $scope.injurydata.employercontact[0]._id;
                            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employercontact[0], text: 'injury.$.injurydata.employercontact' }, function (res) {

                            })
                        }
                        if ($scope.insuranceform.$dirty) {
                            $scope.injurydata.insurance[0].status = "current";
                            delete $scope.injurydata.insurance[0]._id;
                            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.insurance[0], text: 'injury.$.injurydata.insurance' }, function (res) {

                            })
                        }
                        if ($scope.claimsadjusterform.$dirty) {
                            $scope.injurydata.claimsadjuster[0].status = "current";
                            delete $scope.injurydata.claimsadjuster[0]._id;
                            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.claimsadjuster[0], text: 'injury.$.injurydata.claimsadjuster' }, function (res) {

                            })
                        }
                        if ($scope.billreviewform.$dirty) {
                            $scope.injurydata.billreview[0].status = "current";
                            delete $scope.injurydata.billreview[0]._id;
                            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.billreview[0], text: 'injury.$.injurydata.billreview' }, function (res) {

                            })
                        }
                        if ($scope.utilizationreviewform.$dirty) {
                            $scope.injurydata.utilizationreview[0].status = "current";
                            delete $scope.injurydata.utilizationreview[0]._id;
                            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.utilizationreview[0], text: 'injury.$.injurydata.utilizationreview' }, function (res) {

                            })
                        }
                        if ($scope.applicantattorneyform.$dirty) {
                            $scope.injurydata.applicantattorney[0].status = "current";
                            delete $scope.injurydata.applicantattorney[0]._id;
                            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.applicantattorney[0], text: 'injury.$.injurydata.applicantattorney' }, function (res) {

                            })
                        }
                        if ($scope.defenseattorneyform.$dirty) {
                            $scope.injurydata.defenseattorney[0].status = "current";
                            delete $scope.injurydata.defenseattorney[0]._id;
                            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.defenseattorney[0], text: 'injury.$.injurydata.defenseattorney' }, function (res) {

                            })
                        }
                        if ($scope.rncasemanagerform.$dirty) {
                            $scope.injurydata.rncasemanager[0].status = "current";
                            delete $scope.injurydata.rncasemanager[0]._id;
                            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.rncasemanager[0], text: 'injury.$.injurydata.rncasemanager' }, function (res) {

                            })
                        }
                        if ($scope.changedetect.$dirty) {
                            $scope.UpdateInjuryInfo();
                        }
                        if ($scope.updatehandedness) {
                            Injuries.updateEmployeehandedness().save({ ptid: $scope.patientId, handedness: $scope.basicinformation.employeehandedness }, function () {
                                $scope.updatehandedness = false;
                            });
                        }
                        $route.reload();
                    });
                    return v.error(function () {
                        //return console.log('error');
                    });


                });
            } else {
                $route.reload();
            }
        } else {
            alert('Please enter date of injury!');
        }

    }


	//this function added by shridhar 12 jan 2017
    $scope.saveInjuryDetails=function(text){

    	 if ($scope.dateofinjury && $scope.dateofinjury != 'Invalid Date') {

             if ($scope.employerform.$dirty || $scope.Empinfopageform.$dirty || $scope.changedetect1.$dirty || $scope.acceptedbodypartform.$dirty || $scope.employeraddressform.$dirty || $scope.employercontactform.$dirty || $scope.insuranceform.$dirty || $scope.claimsadjusterform.$dirty || $scope.billreviewform.$dirty || $scope.utilizationreviewform.$dirty || $scope.applicantattorneyform.$dirty || $scope.defenseattorneyform.$dirty || $scope.rncasemanagerform.$dirty || $scope.changedetect.$dirty || $scope.updatehandedness || $scope.communicationform.$dirty) {
                 debugger;
                 $scope.editsectiontrue;//demographic
                 $scope.editsectionfalse;//New Injury
                 var template = 'partials/cancelPagePopup.html';

                     debugger;
                     var v;
                     v = $validator.validate($scope, 'injury');
                     v.success(function () {
                         debugger;
                         if ($scope.communicationform.$dirty) {
                             $scope.saveCommunication();
                         }
                         if ($scope.employerform.$dirty) {
                             $scope.injurydata.employer[0].status = "current";
                             delete $scope.injurydata.employer[0]._id;
                             Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employer[0], text: 'injury.$.injurydata.employer' }, function (res) {

                             }).$promise.then();
                         }
                         if ($scope.Empinfopageform.$dirty) {
                             $scope.injurydata.employment[0].status = "current";
                             delete $scope.injurydata.employment[0]._id;
                             Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employment[0], text: 'injury.$.injurydata.employment' }, function (res) {

                             }).$promise.then();
                         }

                         if ($scope.changedetect1.$dirty) {
                             $scope.injurydata.locationaddressinjury[0].status = "current";
                             delete $scope.injurydata.locationaddressinjury[0]._id;
                             Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.locationaddressinjury[0], text: 'injury.$.injurydata.locationaddressinjury' }, function (res) {

                             })
                         }
                         if ($scope.acceptedbodypartform.$dirty) {
                             $scope.checkvalidateBodypart($scope.injurydata.acceptedbodyparts[0]);
                             debugger;
                             if ($scope.acceptedbodypartform.$valid && $scope.isRepeat == false) {
                                 $scope.injurydata.acceptedbodyparts[0].status = "current";
                                 delete $scope.injurydata.acceptedbodyparts[0]._id;
                                 Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.acceptedbodyparts[0], text: 'injury.$.injurydata.acceptedbodyparts' }, function (res) {

                                 })
                             } else {
                                 if ($scope.isRepeat == false) {
                                     alert('Please complete the Injured Body System(s) section.');
                                 }
                                 return false;
                             }
                         }
                         if ($scope.employeraddressform.$dirty) {
                             $scope.injurydata.employeraddress[0].status = "current";
                             delete $scope.injurydata.employeraddress[0]._id;
                             Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employeraddress[0], text: 'injury.$.injurydata.employeraddress' }, function (res) {

                             })
                         }
                         if ($scope.employercontactform.$dirty) {
                             $scope.injurydata.employercontact[0].status = "current";
                             delete $scope.injurydata.employercontact[0]._id;
                             Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employercontact[0], text: 'injury.$.injurydata.employercontact' }, function (res) {

                             })
                         }
                         if ($scope.insuranceform.$dirty) {
                             $scope.injurydata.insurance[0].status = "current";
                             delete $scope.injurydata.insurance[0]._id;
                             Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.insurance[0], text: 'injury.$.injurydata.insurance' }, function (res) {

                             })
                         }
                         if ($scope.claimsadjusterform.$dirty) {
                             $scope.injurydata.claimsadjuster[0].status = "current";
                             delete $scope.injurydata.claimsadjuster[0]._id;
                             Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.claimsadjuster[0], text: 'injury.$.injurydata.claimsadjuster' }, function (res) {

                             })
                         }
                         if ($scope.billreviewform.$dirty) {
                             $scope.injurydata.billreview[0].status = "current";
                             delete $scope.injurydata.billreview[0]._id;
                             Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.billreview[0], text: 'injury.$.injurydata.billreview' }, function (res) {

                             })
                         }
                         if ($scope.utilizationreviewform.$dirty) {
                             $scope.injurydata.utilizationreview[0].status = "current";
                             delete $scope.injurydata.utilizationreview[0]._id;
                             Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.utilizationreview[0], text: 'injury.$.injurydata.utilizationreview' }, function (res) {

                             })
                         }
                         if ($scope.applicantattorneyform.$dirty) {
                             $scope.injurydata.applicantattorney[0].status = "current";
                             delete $scope.injurydata.applicantattorney[0]._id;
                             Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.applicantattorney[0], text: 'injury.$.injurydata.applicantattorney' }, function (res) {

                             })
                         }
                         if ($scope.defenseattorneyform.$dirty) {
                             $scope.injurydata.defenseattorney[0].status = "current";
                             delete $scope.injurydata.defenseattorney[0]._id;
                             Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.defenseattorney[0], text: 'injury.$.injurydata.defenseattorney' }, function (res) {

                             })
                         }
                         if ($scope.rncasemanagerform.$dirty) {
                             $scope.injurydata.rncasemanager[0].status = "current";
                             delete $scope.injurydata.rncasemanager[0]._id;
                             Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.rncasemanager[0], text: 'injury.$.injurydata.rncasemanager' }, function (res) {

                             })
                         }
                         if ($scope.changedetect.$dirty) {
                             $scope.UpdateInjuryInfo();
                         }
                         if ($scope.updatehandedness) {
                             Injuries.updateEmployeehandedness().save({ ptid: $scope.patientId, handedness: $scope.basicinformation.employeehandedness }, function () {
                                 $scope.updatehandedness = false;
                             });
                         }
                         $route.reload();
                     });
                     return v.error(function () {
                         //return console.log('error');
                     });


                // });
             } else {
                 $route.reload();
             }
         } else {
             alert('Please enter date of injury!');
         }
    }


    $scope.update_Createreport = function () {
        debugger;
        if ($scope.communicationform.$dirty) {
            $scope.saveCommunication();
        }
        if ($scope.employerform.$dirty) {
            $scope.injurydata.employer[0].status = "current";
            delete $scope.injurydata.employer[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employer[0], text: 'injury.$.injurydata.employer' }, function (res) {

            }).$promise.then();
        }
        if ($scope.Empinfopageform.$dirty) {
            $scope.injurydata.employment[0].status = "current";
            delete $scope.injurydata.employment[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employment[0], text: 'injury.$.injurydata.employment' }, function (res) {

            }).$promise.then();
        }

        if ($scope.changedetect1.$dirty) {
            $scope.injurydata.locationaddressinjury[0].status = "current";
            delete $scope.injurydata.locationaddressinjury[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.locationaddressinjury[0], text: 'injury.$.injurydata.locationaddressinjury' }, function (res) {

            })
        }
        if ($scope.acceptedbodypartform.$dirty) {
            $scope.injurydata.acceptedbodyparts[0].status = "current";
            delete $scope.injurydata.acceptedbodyparts[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.acceptedbodyparts[0], text: 'injury.$.injurydata.acceptedbodyparts' }, function (res) {

            })
        }
        if ($scope.employeraddressform.$dirty) {
            $scope.injurydata.employeraddress[0].status = "current";
            delete $scope.injurydata.employeraddress[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employeraddress[0], text: 'injury.$.injurydata.employeraddress' }, function (res) {

            })
        }
        if ($scope.employercontactform.$dirty) {
            $scope.injurydata.employercontact[0].status = "current";
            delete $scope.injurydata.employercontact[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employercontact[0], text: 'injury.$.injurydata.employercontact' }, function (res) {

            })
        }
        if ($scope.insuranceform.$dirty) {
            $scope.injurydata.insurance[0].status = "current";
            delete $scope.injurydata.insurance[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.insurance[0], text: 'injury.$.injurydata.insurance' }, function (res) {

            })
        }
        if ($scope.claimsadjusterform.$dirty) {
            $scope.injurydata.claimsadjuster[0].status = "current";
            delete $scope.injurydata.claimsadjuster[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.claimsadjuster[0], text: 'injury.$.injurydata.claimsadjuster' }, function (res) {

            })
        }
        if ($scope.billreviewform.$dirty) {
            $scope.injurydata.billreview[0].status = "current";
            delete $scope.injurydata.billreview[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.billreview[0], text: 'injury.$.injurydata.billreview' }, function (res) {

            })
        }
        if ($scope.utilizationreviewform.$dirty) {
            $scope.injurydata.utilizationreview[0].status = "current";
            delete $scope.injurydata.utilizationreview[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.utilizationreview[0], text: 'injury.$.injurydata.utilizationreview' }, function (res) {

            })
        }
        if ($scope.applicantattorneyform.$dirty) {
            $scope.injurydata.applicantattorney[0].status = "current";
            delete $scope.injurydata.applicantattorney[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.applicantattorney[0], text: 'injury.$.injurydata.applicantattorney' }, function (res) {

            })
        }
        if ($scope.defenseattorneyform.$dirty) {
            $scope.injurydata.defenseattorney[0].status = "current";
            delete $scope.injurydata.defenseattorney[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.defenseattorney[0], text: 'injury.$.injurydata.defenseattorney' }, function (res) {

            })
        }
        if ($scope.rncasemanagerform.$dirty) {
            $scope.injurydata.rncasemanager[0].status = "current";
            delete $scope.injurydata.rncasemanager[0]._id;
            Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.rncasemanager[0], text: 'injury.$.injurydata.rncasemanager' }, function (res) {

            })
        }
    }


    $scope.getAge = function (dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    $scope.cancelFirstPage = function () {
        debugger;
        if ($scope.employerform.$dirty || $scope.changedetect1.$dirty || $scope.acceptedbodypartform.$dirty || $scope.employeraddressform.$dirty || $scope.employercontactform.$dirty) {
            var template = 'partials/cancelPagePopup.html';
            $rootScope.modalInstance = $modal.open({
                templateUrl: template,
                controller: 'archivectrl',
                resolve: {
                    text: function () {
                        return "cancel";
                    },
                    injuryId: function () {
                        return $scope.PopupinjuryId;
                    },
                    page: function () {
                        return 'gotoinjurypage'
                    },
                    isReload: function () {
                        return false;
                    }
                }
            });
            $rootScope.modalInstance.result.then(function () {
                debugger;
                var v;
                v = $validator.validate($scope, 'injury');
                v.success(function () {
                    debugger;
                    if ($scope.employerform.$dirty && $scope.employerUpdate) {
                        $scope.injurydata.employer[0].status = "current";
                        delete $scope.injurydata.employer[0]._id;
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employer[0], text: 'injury.$.injurydata.employer' }, function (res) {

                        }).$promise.then();
                    }
                    if ($scope.changedetect1.$dirty && $scope.locationaddressinjuryUpdate) {
                        $scope.injurydata.locationaddressinjury[0].status = "current";
                        delete $scope.injurydata.locationaddressinjury[0]._id;
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.locationaddressinjury[0], text: 'injury.$.injurydata.locationaddressinjury' }, function (res) {

                        })
                    }
                    if ($scope.acceptedbodypartform.$dirty && $scope.acceptedbodypartsUpdate) {
                        $scope.injurydata.acceptedbodyparts[0].status = "current";
                        delete $scope.injurydata.acceptedbodyparts[0]._id;
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.acceptedbodyparts[0], text: 'injury.$.injurydata.acceptedbodyparts' }, function (res) {

                        })
                    }
                    if ($scope.employeraddressform.$dirty && $scope.employeraddressUpdate) {
                        $scope.injurydata.employeraddress[0].status = "current";
                        delete $scope.injurydata.employeraddress[0]._id;
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employeraddress[0], text: 'injury.$.injurydata.employeraddress' }, function (res) {

                        })
                    }
                    if ($scope.employercontactform.$dirty && $scope.employercontactUpdate) {
                        $scope.injurydata.employercontact[0].status = "current";
                        delete $scope.injurydata.employercontact[0]._id;
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.employercontact[0], text: 'injury.$.injurydata.employercontact' }, function (res) {

                        })
                    }
                    $route.reload();
                });
                return v.error(function () {
                    return console.log('error');
                });
            });
        } else { $route.reload(); }

    }

    $scope.patientlibraryClick = function () {
        debugger;
        if ($scope.employerform.$dirty || $scope.changedetect1.$dirty || $scope.acceptedbodypartform.$dirty || $scope.employeraddressform.$dirty || $scope.employercontactform.$dirty) {
            //var template = 'partials/cancelPagePopup.html';
            var template = 'partials/commonPopUp.html';
            $rootScope.modalInstance = $modal.open({
                templateUrl: template,
                controller: 'archivectrl',
                resolve: {
                    text: function () {
                        return "simplepopUp";
                    },
                    injuryId: function () {
                        return $scope.PopupinjuryId;
                    },
                    page: function () {
                        return 'gotoinjurypage'
                    },
                    isReload: function () {
                        return false;
                    }
                }
            });
            $rootScope.modalInstance.result.then(function () {
                debugger;

                $scope.injury.submit();


            });
        } else {
            //$route.reload();
            $route.reload();
        }
    }

    $scope.cancelSecondPage = function () {
        debugger;
        if ($scope.insuranceform.$dirty || $scope.claimsadjusterform.$dirty || $scope.billreviewform.$dirty || $scope.utilizationreviewform.$dirty || $scope.applicantattorneyform.$dirty || $scope.defenseattorneyform.$dirty || $scope.rncasemanagerform.$dirty) {
            var template = 'partials/cancelPagePopup.html';
            $rootScope.modalInstance = $modal.open({
                templateUrl: template,
                controller: 'archivectrl',
                resolve: {
                    text: function () {
                        return "cancel";
                    },
                    injuryId: function () {
                        return $scope.PopupinjuryId;
                    },
                    page: function () {
                        return 'gotoinjurypage'
                    },
                    isReload: function () {
                        return false;
                    }
                }
            });
            $rootScope.modalInstance.result.then(function () {
                debugger;
                var v;
                v = $validator.validate($scope, 'injury');
                v.success(function () {
                    debugger;
                    // Update Injury Before Push..............

                    $scope.injurydata.acceptedbodyparts[0].injuredbodypart = $scope.selectedbodypart;
                    $scope.injurydata.injuryinformation[0].dateofinjury = $scope.dateofinjury;
                    $scope.injurydata.injuryinformation[0].dateoflastwork = $scope.dateoflastwork;
                    $scope.injurydata.injuryinformation[0].dateofpermanent = $scope.dateofpermanent;
                    if ($filter('date')($scope.timeofinjury, 'shortTime')) {
                        $scope.injurydata.injuryinformation[0].timeofinjury = ($filter('date')($scope.timeofinjury, 'shortTime'));;
                    } else {
                        $scope.injurydata.injuryinformation[0].timeofinjury = $scope.dateofinjury;
                    }
                    Injuries.updateinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata }, function (res) { });

                    //..........END..........

                    if ($scope.insuranceform.$dirty && $scope.insuranceUpdate) {
                        $scope.injurydata.insurance[0].status = "current";
                        delete $scope.injurydata.insurance[0]._id;
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.insurance[0], text: 'injury.$.injurydata.insurance' }, function (res) {

                        }).$promise.then();
                    }
                    if ($scope.claimsadjusterform.$dirty && $scope.claimsadjusterUpdate) {
                        $scope.injurydata.claimsadjuster[0].status = "current";
                        delete $scope.injurydata.claimsadjuster[0]._id;
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.claimsadjuster[0], text: 'injury.$.injurydata.claimsadjuster' }, function (res) {

                        })
                    }
                    if ($scope.billreviewform.$dirty && $scope.billreviewUpdate) {
                        $scope.injurydata.billreview[0].status = "current";
                        delete $scope.injurydata.billreview[0]._id;
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.billreview[0], text: 'injury.$.injurydata.billreview' }, function (res) {

                        })
                    }
                    if ($scope.utilizationreviewform.$dirty && $scope.utilizationreviewUpdate) {
                        $scope.injurydata.utilizationreview[0].status = "current";
                        delete $scope.injurydata.utilizationreview[0]._id;
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.utilizationreview[0], text: 'injury.$.injurydata.utilizationreview' }, function (res) {

                        })
                    }
                    if ($scope.applicantattorneyform.$dirty && $scope.applicantattorneyUpdate) {
                        $scope.injurydata.applicantattorney[0].status = "current";
                        delete $scope.injurydata.applicantattorney[0]._id;
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.applicantattorney[0], text: 'injury.$.injurydata.applicantattorney' }, function (res) {

                        })
                    }
                    if ($scope.defenseattorneyform.$dirty && $scope.defenseattorneyUpdate) {
                        $scope.injurydata.defenseattorney[0].status = "current";
                        delete $scope.injurydata.defenseattorney[0]._id;
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.defenseattorney[0], text: 'injury.$.injurydata.defenseattorney' }, function (res) { })
                    }
                    if ($scope.rncasemanagerform.$dirty && rncasemanagerUpdate) {
                        $scope.injurydata.rncasemanager[0].status = "current";
                        delete $scope.injurydata.rncasemanager[0]._id;
                        Injuries.updatesubinjuries().save({ injid: $scope.injuryId, injurydata: $scope.injurydata.rncasemanager[0], text: 'injury.$.injurydata.rncasemanager' }, function (res) { })
                    }
                    $route.reload();

                });
                return v.error(function () {
                    return console.log('error');
                });
            });
        } else { $route.reload(); }
    }
    $scope.formatZip = function (modal, modalData) {
        debugger;
        var modalData = modalData;
        var value = $scope.$eval(modal).length;
        if (modal.length > 5) {
            var zipcodeFirst = modal.slice(0, 5);
            var zipcodeLast = modal.slice(5, 9);
            var alreadyExist = modal.split('-');
            debugger;
            if (!alreadyExist[1]) {
                if (modal.length > 5) {
                    var zipcodeArray = modal.slice(0, 5) + '-' + modal.slice(5, 9);
                    var execute = modal + "='" + zipcodeArray + "'";
                    eval(modalData + '= zipcodeArray');
                    $scope.injurydata;
                }
            }
            else {
                eval(modalData + '= modal');
            }
        }
    };
    // GT:RISHU 27May2014

    $scope.selectInjuryforsearch = function ($index, selectedInjuryId) {
        debugger;
        $scope.isLoad = true;
        $scope.patients = new Array;
        var patientid = $scope.patientId;
        var injuryId = selectedInjuryId;
        var reportcategory = reportcategory;
        $scope.selectedInjuryId = selectedInjuryId;
        delete $sessionStorage.InjuryId;
        if ($sessionStorage.InjuryId) {
            delete $sessionStorage.InjuryId;
        }
        $sessionStorage.InjuryId = selectedInjuryId;
        $scope.selectedIndex = $index;
        debugger

        getReportCardView.query({ patientid: patientid, injuryid: injuryId }, function (response) {
            debugger;
            if (response[0]) {
                debugger;
                $scope.IsdeleteInjury = true;
                $scope.reportid = response[0].patients[0]._id;
            }
        }).$promise.then(function (response) {
            debugger
            $scope.isLoad = false;
            if (response[0]) {
                debugger;
                for (var i = 0; i < response[0].patients.length; i++) {
                    if (response[0].patients[i].state == $cookies.selectedStatecode) {
                        $scope.patients.push(response[0].patients[i]);
                        $scope.noreport = true;
                        $scope.norecords = false;
                    }
                }
            }
            else {
                $scope.noreport = false;
                $scope.norecords = false;
            }
        });
        if (!$scope.isFirst_timeinjury) {
            if ($rootScope.currentUser.level == 'level1') {
                $scope.reportAdd = false;
            }
            else {
                $scope.reportAdd = true;
            }
            $scope.reportExit = false;
            $scope.reportList = true;
            $scope.reportAddTypes = false;
        }
    }


    $scope.selectInjury = function ($index, selectedInjuryId) {
        debugger;
        // mayur code
        $scope.setinjuryid(selectedInjuryId);
        $scope.communicationMaintab = true;
        $scope.isLoad = true;
        $scope.patients = new Array;
        if (!$scope.isFirst_timeinjury) {
            $scope.reportAdd = true;
            $scope.searchBox = false;
            $scope.searchReportBox = false;
            $scope.searchcolor = "";
            $scope.searchcolor1 = "";
            $scope.search1 = false;
            $scope.search2 = true;
        }
        var patientid = $scope.patientId;
        var injuryId = selectedInjuryId;
        var reportcategory = reportcategory;
        $scope.selectedInjuryId = selectedInjuryId;
        delete $sessionStorage.InjuryId;
        if ($sessionStorage.InjuryId) {
            delete $sessionStorage.InjuryId;
        }
        $rootScope.InjuryId = selectedInjuryId;
        $sessionStorage.InjuryId = selectedInjuryId;
        $scope.selectedIndex = $index;

        // mayur code to get report list in the form of cards

        getReportCardView.query({ patientid: patientid, injuryid: injuryId }, function (response) {
            debugger;
            if (response[0]) {
                debugger;
                $scope.IsdeleteInjury = true;
                $scope.reportid = response[0].patients[0]._id;
            }
        }).$promise.then(function (response) {
            debugger
            $scope.isLoad = false;
            if (response[0]) {
                debugger;
                for (var i = 0; i < response[0].patients.length; i++) {
                    if (response[0].patients[i].state == $cookies.selectedStatecode) {
                        $scope.patients.push(response[0].patients[i]);
                        $scope.noreport = true;
                        $scope.norecords = false;
						$scope.noRecordsFoundMsg ='';
                    }
                }
                $scope.patients = $filter('orderBy')($scope.patients, ['status', 'data.patientcomplaints.currentexamdate'], 'reverse');
            }
            else {
                $scope.noreport = false;
                $scope.norecords = false;
				$scope.noRecordsFoundMsg ='<div class="col-sm-12 col-sm-offset alert alert-dismissable alert-danger text-center" ng-hide="noreport">No Records Found for this Injury!</div>';
            }
        });
        if (!$scope.isFirst_timeinjury) {
            //if ($rootScope.currentUser.level == 'level1') {
            //    $scope.reportAdd = false;
            //}
            //else {
            //    $scope.reportAdd = true;
            //}
            $scope.reportExit = false;
            $scope.reportList = true;
            $scope.reportAddTypes = false;
        }
    }

	$scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };

    //For report confirmation dialog
    $scope.reportConfirmation = function (reportid, patientid, reportcategory, formType, formversion, formid, injuryid) {
        debugger;
        $scope.isLoad = true;

        $rootScope.patientId = patientid;
        $sessionStorage.patientId = patientid;
        $rootScope.InjuryId = injuryid;
        $sessionStorage.InjuryId = injuryid;

        openedReportTrack.getopenedreportcount().query({ 'reportid': reportid }).$promise.then(function (response) {
            debugger;
            if (response) {
                if (response[0].count > 0) {
                    $scope.isLoad = false;
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/confirmOpenReport.html',
                        controller: 'confirmOpenReportctrl',
                        resolve: {
                            reportid: function () {
                                return reportid;
                            }
                        }
                    });
                    modalInstance.result.then(function (returnValue) {
                        debugger;
                        $scope.isLoad = false;
                        if (returnValue == 'yes') {
                            socket.reportopened($rootScope.currentUser, reportid);

                            $sessionStorage.InjuryId = injuryid;
                            $scope.reportid = reportid;
                            $scope.patientid = patientid;
                            $scope.reportcategory = reportcategory;
                            $scope.formversion = formversion;
                            $rootScope.formVersion = formversion;
                            $scope.formid = formid;

                            if ($cookies.formType) {
                                delete $cookies.formType;
                            }
                            $cookies.formType = formType;

                            if ($cookies.formVersion) {
                                delete $cookies.formVersion;
                            }
                            $cookies.formVersion = formversion;

                            if ($sessionStorage.reportId) {
                                delete $sessionStorage.reportId;
                            }
                            $sessionStorage.reportId = reportid;

                            $rootScope.modalInstance = $modal.open({
                                templateUrl: 'partials/reportconfirmation.html',
                                controller: 'reportPreviewctrl',
                                resolve: {
                                    patientid: function () {
                                        return $scope.patientid;
                                    },
                                    reportid: function () {
                                        return $scope.reportid;
                                    },
                                    formVersion: function () {
                                        return $scope.formversion;
                                    },
                                    formid: function () {
                                        return $scope.formid;
                                    }
                                }
                            });

                        }
                    });
                }
                else {
                    $scope.isLoad = false;
                    $sessionStorage.InjuryId = injuryid;
                    $scope.reportid = reportid;
                    $scope.patientid = patientid;
                    $scope.reportcategory = reportcategory;
                    $scope.formversion = formversion;
                    $rootScope.formVersion = formversion;
                    $scope.formid = formid;

                    if ($cookies.formType) {
                        delete $cookies.formType;
                    }

                    $cookies.formType = formType;

                    if ($cookies.formVersion) {
                        delete $cookies.formVersion;
                    }

                    $cookies.formVersion = formversion;

                    if ($sessionStorage.reportId) {
                        delete $sessionStorage.reportId;
                    }

                    $sessionStorage.reportId = reportid;

                    $rootScope.modalInstance = $modal.open({
                        templateUrl: 'partials/reportconfirmation.html',
                        controller: 'reportPreviewctrl',
                        resolve: {
                            patientid: function () {
                                return $scope.patientid;
                            },
                            reportid: function () {
                                return $scope.reportid;
                            },
                            formVersion: function () {
                                return $scope.formversion;
                            },
                            formid: function () {
                                return $scope.formid;
                            }
                        }
                    });
                }
            }
        });
    }

    $scope.deleteReportfunc = function (report) {
        debugger;

        $scope.reportid = report._id

        $rootScope.modalInstance = $modal.open({
            templateUrl: 'partials/deletereportpopup.html',
            controller: 'deleteReportPopUpCtrl',
            resolve: {
                reportid: function () {
                    return $scope.reportid;
                }
            }
        });
        $rootScope.modalInstance.result.then(function (returndata) {
            debugger;
            if (returndata == 'delete') {

                deletereport.query({ reportid: $scope.reportid }, function (response) {

                });
            }

            var index = $scope.patients.indexOf(report)
            $scope.patients.splice(index, 1);

        }, function (returndata) {
            debugger;

        });

    }

    $scope.removereport = function (item) {
        var index = $scope.bdays.indexOf(item)
        $scope.bdays.splice(index, 1);
    }

    $scope.newreportConfirmation = function (patientid, formType) {
        debugger;
        $scope.patientid = patientid;
        $scope.formType = formType;
        $rootScope.reportId = '';
        delete $sessionStorage.reportId;
        $rootScope.modalInstance = $modal.open({
            templateUrl: 'partials/reportconfirmation.html',
            controller: 'newreportPreviewctrl',
            resolve: {
                patientid: function () {
                    return $scope.patientid;
                },
                formType: function () {
                    return $scope.formType;
                }
            }
        });
    }

    $scope.sortDate = function (items) {

        var indexA;
        var indexB;
        var isReturnA = false;
        var isReturnB = false;
        var maxlength;
        if (items) {

            $rootScope.currentUser.username;
            items.sort(function (a, b) {
                if (a.injurydata.viewinformation && b.injurydata.viewinformation) {
                    if (a.injurydata.viewinformation.length > b.injurydata.viewinformation.length) {
                        maxlength = a.injurydata.viewinformation.length;
                    } else {
                        maxlength = b.injurydata.viewinformation.length;
                    }
                    for (var i = 0; i < maxlength; i++) {
                        if (a.injurydata.viewinformation.length > i) {
                            if (a.injurydata.viewinformation[i].viewby) {
                                if (a.injurydata.viewinformation[i].viewby == $rootScope.currentUser.username) {
                                    indexA = i;
                                    isReturnA = true;
                                }
                            }
                        }
                        if (b.injurydata.viewinformation.length > i) {
                            if (b.injurydata.viewinformation[i].viewby) {
                                if (b.injurydata.viewinformation[i].viewby == $rootScope.currentUser.username) {
                                    indexB = i;
                                    isReturnB = true;
                                }
                            }
                        }
                    }
                    if (isReturnA && isReturnB) {
                        if (a.injurydata.viewinformation[indexA] && b.injurydata.viewinformation[indexB]) {
                            if (a.injurydata.viewinformation[indexA].viewdate && b.injurydata.viewinformation[indexB].viewdate) {
                                if (a.injurydata.viewinformation[indexA].viewdate > b.injurydata.viewinformation[indexB].viewdate) {
                                    return 1;
                                } else {
                                    return -1;
                                }
                            } else {
                                return -1;
                            }
                        } else {
                            return -1;
                        }
                    } else {
                        if (isReturnA) {
                            for (var i = 0; i < a.injurydata.viewinformation.length; i++) {
                                if (a.injurydata.viewinformation[i].viewby) {
                                    if (a.injurydata.viewinformation[i].viewby == $rootScope.currentUser.username) {
                                        return 1;
                                    } else {
                                        return -1;
                                    }
                                } else {
                                    return -1;
                                }
                            }
                        } else {
                            for (var i = 0; i < a.injurydata.viewinformation.length; i++) {
                                if (b.injurydata.viewinformation[i].viewby) {
                                    if (b.injurydata.viewinformation[i].viewby == $rootScope.currentUser.username) {
                                        return 1;
                                    } else {
                                        return -1;
                                    }
                                } else {
                                    return -1;
                                }
                            }
                        }
                    }
                }
            });
            items.reverse();

            return items;
        }
    }
    $scope.search = null;

    $scope.basicsearch = function () {
        debugger;
        $scope.isLoad = true;
        try {
            $scope.reportList = true;
            $scope.search.reportsatus = ($scope.search.reportsatus) ? $scope.search.reportsatus : "all";
            $scope.search.provider = ($scope.search.provider) ? $scope.search.provider : "all";
            if ($scope.search) {
                Injuries.basicsearch().save({ ptid: $scope.patientId, rstatus: $scope.search.reportsatus, provider: $scope.search.provider }, function (ress) {
                    debugger;
                    $scope.patients = ress.data;
                    if ($scope.search.bodypart) {
                        $scope.patients = $filter('filter')($scope.patients, { 'data.selectinjuries.concatedbodypart': angular.fromJson($scope.search.bodypart).text });

                        if ($scope.search.bodypartsides) {
                            for (var i = 0; i < $scope.patients.length; i++) {
                                var side = $scope.search.bodypartsides.toLowerCase();
                                var cj = $filter('filter')($scope.patients[i].data.selectinjuries.concatedbodypart, { bdsides: side });
                                if ($filter('filter')($scope.patients[i].data.selectinjuries.concatedbodypart, { text: angular.fromJson($scope.search.bodypart).text, bdsides: side }).length == 0) {
                                    delete $scope.patients[i];
                                }
                            }
                        }

                    }

                    debugger;
                    for (var i = 0; i < $scope.patients.length; i++) {
                        if ($scope.search.frominjurydate && $scope.search.toinjurydate) {
                            debugger;
                            var mindate = new Date($scope.search.frominjurydate);
                            var maxdate = new Date($scope.search.toinjurydate);
                            var comparedate = new Date($scope.patients[i].data.bginfo.dateofinjury);
                            //var comparedate = $filter('date')($scope.patients[i].data.patientcomplaints.currentexamdate, 'MM/dd/yyyy');

                            var timeDiff1 = (comparedate.getTime() - mindate.getTime());
                            var diffDays1 = (timeDiff1 / (1000 * 3600 * 24));

                            var timeDiff2 = (maxdate.getTime() - comparedate.getTime());
                            var diffDays2 = (timeDiff2 / (1000 * 3600 * 24));

                            if (diffDays1 >= 0 && diffDays2 >= 0) {

                            } else {
                                delete $scope.patients[i];
                            }
                        }
                    }

                    if ($scope.patients.length > 0) {
                        $scope.noreport = true;
                    }
                    $scope.isLoad = false;
                });
            }
        } catch (err) {

            $scope.All_search_data = [];
            $scope.isLoad = false;
        }

    }

    $scope.basicreportsearch = function () {
        debugger;
        $scope.isLoad = true;
        $scope.search.provider = ($scope.search.provider) ? $scope.search.provider : "all";
        $scope.search.reportsatus = $scope.search.reportsatus ? $scope.search.reportsatus : 'all';
        $scope.search.frominjurydate = $filter('date')($scope.search.frominjurydate, 'MM/dd/yyyy');
        $scope.search.toinjurydate = $filter('date')($scope.search.toinjurydate, 'MM/dd/yyyy');
        $scope.injuryId = $sessionStorage.InjuryId;
        $scope.patientid = $scope.patientId;
        Injuries.basicreportsearch().save({ start: new Date(), end: new Date(), ptid: $scope.patientId, rstatus: $scope.search.reportsatus, injid: $sessionStorage.InjuryId, provider: $scope.search.provider }, function (ress) {
            debugger;
            $scope.isLoad = false;
            if (ress.Data.length > 0) {
                $scope.search_result = ress.Data;
                $scope.All_search_data = new Array();
                for (var i = 0; i < ress.Data.length; i++) {
                    var search_data = new Object();
                    var currentData = ress.Data[i];
                    $scope.All_search_data.push(currentData);
                    debugger;
                    if ($scope.search.frominjurydate && $scope.search.toinjurydate) {
                        search_data['examdate'] = $filter('date')(currentData.data.patientcomplaints.currentexamdate, 'MM/dd/yyyy');
                        var mindate = new Date($scope.search.frominjurydate);
                        var maxdate = new Date($scope.search.toinjurydate);
                        var comparedate = new Date(search_data['examdate']);

                        var timeDiff1 = (comparedate.getTime() - mindate.getTime());
                        var diffDays1 = (timeDiff1 / (1000 * 3600 * 24));

                        var timeDiff2 = (maxdate.getTime() - comparedate.getTime());
                        var diffDays2 = (timeDiff2 / (1000 * 3600 * 24));

                        if (diffDays1 >= 0 && diffDays2 >= 0) {

                        } else {
                            $scope.All_search_data.pop();
                        }
                    }
                }

            } else {
                $scope.All_search_data = [];
            }
            $scope.patients = $scope.All_search_data;

        });
    };

	$scope.getRfaList = function (text) {

		 var ab = $validator.validate($scope, 'injurydata.acceptedbodyparts');
        ab.success(function () {
            debugger;
            $scope.step = 5;
            $scope.communicationtab = false;
            $scope.firstpage = false;
            $scope.secondpage = false;
            $scope.defaultpage = false;
            $scope.rfapage = true;
            $scope.getRfaCard();
        });
        return ab.error(function () {
            debugger;
            alert('Please complete the Injured Body System(s) section.');
        });
    }
    /**
     * Get Request for Inury
     */
    $scope.getRfaCard = function () {
		var query = {
            injuryid: $sessionStorage.InjuryId,
            patientid: $sessionStorage.patientId,
            state: $cookies.selectedStatecode,
        };
		rfacard.getCard(query,$scope.basicinformation).then(function(data){
			 if(typeof(data[0].rfacards)!=undefined){
				$scope.rfacards = data[0].rfacards;
			} else{
				$scope.rfacards = [] ;
			}
		});
    }

    /**
     * Display preview of RFA
     */
    $scope.rfaFullView = function (data,index) {

    	$scope.treatingPhysician	={};
    	//Set RFA current selected object and

    	rfacard.setCurrReport(data);
    	rfacard.setCurrRfaIndex(index);
		//get the treating physician data based on id from user table
		var ser=rfacard.rfacarduser();
		try{
			if(typeof data.data.patientcomplaints.treatphynamedropdown !='undefined' ){
				if(data.data.patientcomplaints.treatphynamedropdown!=''){
					var query = {id: data.data.patientcomplaints.treatphynamedropdown};
					ser.query(query, function (res) {}).$promise.then(function (response) {
						if(response[0]){
							$scope.rfaFullViewUpdate(data,index,response[0]);
						}else{
							$scope.rfaFullViewUpdate(data,index);
						}
					});
				}else{
					$scope.rfaFullViewUpdate(data,index);
				}
			}else{
				$scope.rfaFullViewUpdate(data,index);
			}
		}catch(exception){
			$scope.rfaFullViewUpdate(data,index);
		}

	}
    //Open rfa Full view
	$scope.rfaFullViewUpdate=function(data,index,treatingPhysician){
		//rfa activity
			$rootScope.objrfacard				=	rfacard.getCurrReport();
			$rootScope.objrfaIndexId			=	rfacard.getCurrRfaIndex();
			$scope.signDoctor					=	$rootScope.objrfacard.data.signDoctor;
			$scope.basicinfo					=	$rootScope.objrfacard.data.bginfo;
			$scope.selectedRfa					=	$rootScope.objrfacard.rfas[$rootScope.objrfaIndexId];
			$scope.selectedRfacomment			=	$rootScope.objrfacard.rfas[$rootScope.objrfaIndexId].comments;
			$scope.rdostatus					=	$scope.selectedRfa.status;
			$rootScope.oldselectedrfastatus		=	$scope.selectedRfa.status;
			$scope.rdofaxstatus					=	$rootScope.objrfacard.rfas[$rootScope.objrfaIndexId].faxed;
			$rootScope.oldfaxstatus				=	$scope.rdofaxstatus;
			$scope.dateCreated					=	data.submittedDate;
			$scope.rfaformtype					=	$rootScope.objrfacard.formtype;
			$scope.treatingPhysician			=	treatingPhysician;

			//Show the Rfa full card view
			$scope.viewLibrary 					= 	false;
			$scope.isCreateinjuryform 			= 	false;
			$scope.activityRFA					=	true;
			$scope.editsectiontrue				=	false;
			$scope.userComment					=	"";
			$("#myform").hide();

	}
    $scope.deleteInjury = function () {
        $scope.step = 5;
        if (confirm("Are you sure you want to delete this injury? This action is irreversible!")) {
            Injuries.deleteInjury().save({ injid: $scope.injuryId }, function () {
                debugger;
            });
            $route.reload();
        }
    }

    //GT:RISHU 24th November 2014 Code for date format
    $scope.dateFilter = function (input) {
        var d = new Date();
        var timezone = d.getTimezoneOffset();

        debugger;
        if (input == null) { return ""; }
        debugger;
        var date = $filter('date')(new Date(input), 'dd-MMM-yyyy', timezone);
        return date;
    }

    $scope.datenewFormat = function (input) {
        var d = new Date();
        var timezone = d.getTimezoneOffset();

        if (input == null) { return ""; }

        var date = $filter('date')(new Date(input), 'MM/dd/yyyy', timezone);
        return date;
    }

	/********************** Code for Athena starts from here *******************/

 // Athena changes

	//Checks to see if injury can be imported from Athena
	$scope.checkAthenaInjury = function(){
		debugger;
    	 if ($rootScope.currentUser) {
    		if($rootScope.currentUser.practiceDetails.isAthena){
    			var message="<h3><p>Do you want to import insurance and injury information from Athena, or do you want to add an injury manually in RateFast?</p></h3>"
    		        $rootScope.modalInstance = $athenaModal.open({
    		        	 templateUrl: 'partials/athena/athena-dynamicPopup3Buttons.html',
    			         controller: 'athenaDynamicPopUp3ButtonsCtrl',
    		            resolve: {
    		            	ID: function () {
    		                    return '';
    		                },
    		                confirmButtonText1: function () {
    		                    return "Import from Athena";
    		                },
    		                confirmButtonText2: function () {
    		                    return "Add Manually";
    		                },
    		                cancelButtonText: function () {
    		                    return "Cancel";
    		                },
    		                dispalyMessage: function () {
    		                    return message;
    		                }
    		            }
    		        });
    		        $rootScope.modalInstance.result.then(function (returndata) {
    		            debugger;
    		            if (returndata == 'confirm1') {
    		            	$scope.getAthenaImportedInjury();
    		            }
    		            if (returndata == 'confirm2') {
    		            	$scope.athenaAddManuallyPopup();
    		            }
    		            if (returndata == 'cancel') {
    		            	//Popup will close here
    		            }
    		        }, function (returndata) {

    		        });
    		}
			else
			{
    			 $scope.addInjury();
    		}
    	 }
    }

	$scope.getAthenaImportedInjury = function(){

		$('#isSpinnerImportInjury').show();

		$http.get('/api/athena/getinjurydetails', { params: {patientid: $scope.athena_patientid, practiceid : $rootScope.currentUser.practiceDetails.athena_practiceid, departmentid : $rootScope.currentUser.athena_departmentid }
		}).success(function (athenaInjuryData, status, headers, config) {
		try{

			if(typeof athenaInjuryData != 'undefined'){
				if(typeof athenaInjuryData.athenaInjury != 'undefined'){
					if(typeof athenaInjuryData.athenaInjury.insurances != 'undefined'){
						if(athenaInjuryData.athenaInjury.insurances.length>0){

							//from -- > athena patinet
							if(typeof athenaInjuryData.athenaPatient != 'undefined'){
									try{
										$scope.athenaPatientDataForInjury={	occupationCode:'', industryCode:''}
										var codeDetails={};
										codeDetails.industrycode = checkValues('General', athenaInjuryData.athenaPatient[0].industrycode);
										codeDetails.occupationcode = checkValues('General', athenaInjuryData.athenaPatient[0].occupationcode);

										if(codeDetails.industrycode!='' || codeDetails.occupationcode!=''){
											codeDetails.mode = 'code';

											getPatientAthenaCode(codeDetails,'insertToRatefast');
										}
									}catch(err){
										console.log(err);
									}
							}

							var countActiveInsurance = 0;
							var indexActiveInsurance = null;
							var athena_insuranceAlloptions = [];

							athenaInjuryData.athenaInjury.insurances.forEach(function( item, index ){

								var insurance_option = {};

								insurance_option.insuranceplanname = item.insuranceplanname;
								insurance_option.insuranceid = item.insuranceid

								if(typeof item.casepolicytypename !='undefined'){
									if(item.casepolicytypename=='Worker\'s Comp'){
										insurance_option.casepolicytypename = 'Yes';
									}else{
										insurance_option.casepolicytypename = 'No';
									}
								}else{
									insurance_option.casepolicytypename = 'No';
								}

								if(typeof item.cancelled != 'undefined'){
									if(item.cancelled != null && item.cancelled != "" ){
										insurance_option.cancelled = 'No';
									}else{
										insurance_option.cancelled = 'Yes';
									}
								}else{
									insurance_option.cancelled = 'Yes';
								}


								// if here -- > n/a  is changed, aslo change in --> athena-InsuranceOptionPopup
								if(typeof item.caseinjurydate != 'undefined'){
									if(item.caseinjurydate != null && item.caseinjurydate != "" ){
										insurance_option.caseinjurydate = item.caseinjurydate;
									}else{
										insurance_option.caseinjurydate = 'n/a';
									}
								}else{
									insurance_option.caseinjurydate = 'n/a';
								}

								if(insurance_option.casepolicytypename == 'Yes'){
									// add to array only when Worker\'s Comp  == yes
									athena_insuranceAlloptions.push(insurance_option);
								}

								if(insurance_option.cancelled == 'Yes' && insurance_option.casepolicytypename == 'Yes' && insurance_option.caseinjurydate != 'n/a'){
									countActiveInsurance++;
									indexActiveInsurance = index;
								}

								if (index == athenaInjuryData.athenaInjury.insurances.length - 1) {
							        if(countActiveInsurance == 1) {
							        	$scope.checkInsuranceExistance(athenaInjuryData,athenaInjuryData.athenaInjury.insurances[indexActiveInsurance],athena_insuranceAlloptions);
							        }
									else if(countActiveInsurance > 1){
										if(athena_insuranceAlloptions.length>0){
										var adjusterNumber = {
												phone : '',
												extension : ''
										}
										$scope.athenaSeeAllInsuranceOptions(athena_insuranceAlloptions,athenaInjuryData,adjusterNumber);
										}else{
										$('#isSpinnerImportInjury').hide();

										var message="<h3><p>Currently, there is no workers compensation case policy associated with this patient in Athena. To add workers’ compensation insurance information, please go to the patient’s chart in Athena, scroll down to the “Insurance” section, and click “Add case policy.</p><p>After adding the details of the workers’ compensation case policy, you can import the injury from Athena to RateFast.</p><p>Alternatively, you may create a new Injury Claim in RateFast. <strong>This is not recommended. Data for this Injury Claim will not be linked with the insurance data in Athena.</strong></p></h3>";
										$scope.errorPopup('',message,'Okay');
										}
									}
									else{
							        	// if multiple active insurance or none active insurance, show all insurance option popup

							        	if(athena_insuranceAlloptions.length>0){
								        	var adjusterNumber = {
							            			phone : '',
							            			extension : ''
							            	}
								        	$scope.athenaSeeAllInsuranceOptions(athena_insuranceAlloptions,athenaInjuryData,adjusterNumber);
							        	}else{
							        		$('#isSpinnerImportInjury').hide();

							        		var message="<h3><p>Currently, there is no workers compensation case policy associated with this patient in Athena. To add workers’ compensation insurance information, please go to the patient’s chart in Athena, scroll down to the “Insurance” section, and click “Add case policy.</p><p>After adding the details of the workers’ compensation case policy, you can import the injury from Athena to RateFast.</p><p>Alternatively, you may create a new Injury Claim in RateFast. <strong>This is not recommended. Data for this Injury Claim will not be linked with the insurance data in Athena.</strong></p></h3>";
							        		$scope.errorPopup('',message,'Okay');
							        	}
							        }
							    }
							});
						}else{
							$('#isSpinnerImportInjury').hide();
							var message="<h3><p>Currently, there is no insurance information associated with this patient in Athena. To add workers’ compensation insurance information, please go to the patient’s chart in Athena, scroll down to the “Insurance” section, and click “Add case policy.”</p>";

							message = message + "<p>After adding the details of the workers’ compensation case policy, you can import the injury from Athena to RateFast.</p></h3>";

							$scope.errorPopup('',message,'Okay');
						}
					}
				}
			}
		}catch(err){
			var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err +"</p></h3>";
			$scope.errorPopup('',message,'Ok');
		}
		})
		.catch(function (err) {
			console.log(err)
			var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";
			$scope.errorPopup('',message,'Ok');
		})
		.finally(function(){
			$('#isSpinnerImportInjury').hide();
		})
	}


	$scope.checkInsuranceExistance = function(athenaAllData, athena_injury, athena_insuranceAlloptions){
		var query = {
						 ratefast_patientId : $sessionStorage.patientId,
						 athena_patientid : $scope.athena_patientid,
						 insurancepackageid : athena_injury.insurancepackageid
					}

		$http.get('/api/athena/ratefast/checkInjury', { params: query}).success(function (statusRatefastInjury, status, headers, config) {
			if(typeof statusRatefastInjury != 'undefined'){
				if(statusRatefastInjury.patients.length < 1){

					var msgReqField = {};
					msgReqField.caseinjurydate = athena_injury.caseinjurydate;
					msgReqField.insuranceclaimnumber = athena_injury.insuranceclaimnumber;
					msgReqField.descriptionofinjury = athena_injury.descriptionofinjury;
					msgReqField.insuranceplanname = athena_injury.insuranceplanname;

					//msgReqField : required to show in popup message.

					$scope.athenaInsurancePopup(msgReqField,athenaAllData, athena_injury, athena_insuranceAlloptions);
				}else{
					// give alert for already save insurance
					 $scope.athenaInsuranceExistancePopup(statusRatefastInjury);
				}
			}
		})
		.catch(function (err) {
			var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";
			$scope.errorPopup('',message,'Ok');
		})
	}


    $scope.athenaInsurancePopup = function(popupMsgReqField,athenaAllData,insuranceData,athena_insuranceAlloptions){
		   var message="<h3><p>We recommend importing insurance and injury information for the workers’ compensation claim number "+ popupMsgReqField.insuranceclaimnumber+".";

		   if(typeof popupMsgReqField.caseinjurydate !='undefined'){
			   message = message +  " The injury date is "+ popupMsgReqField.caseinjurydate+"."
		   }
		   if(typeof popupMsgReqField.descriptionofinjury !='undefined'){
			   if(popupMsgReqField.descriptionofinjury !=''){
				   message= message +  " The description of injury is \""+ popupMsgReqField.descriptionofinjury+"\".";
			   }
		   }
		   if(typeof popupMsgReqField.insuranceplanname !='undefined'){
			   message= message + " The insurance carrier / plan name is \""+popupMsgReqField.insuranceplanname+"\".";
		   }

		   message= message + "</p></h3><h3><p>Is this the correct injury/insurance information? Or do you want to see other options?</p></h3>";

	        $rootScope.modalInstance = $athenaModal.open({
	        	 templateUrl: 'partials/athena/athena-dynamicPopup3Buttons.html',
		         controller: 'athenaDynamicPopUp3ButtonsCtrl',
	            resolve: {
	            	ID: function () {
	                    return '';
	                },
	                confirmButtonText1: function () {
	                    return "Import this information";
	                },
	                confirmButtonText2: function () {
	                    return "See All Options";
	                },
	                cancelButtonText: function () {
	                    return "Cancel";
	                },
	                dispalyMessage: function () {
	                    return message;
	                }
	            }
	        });
	        $rootScope.modalInstance.result.then(function (returndata) {
	            debugger;
	            var adjusterNumber = {
            			phone : '',
            			extension : ''
            	}
	            if (returndata == 'confirm1') {
	            	// same code written in insuranceOptionPopup
	            	if(typeof insuranceData.adjusterphone != 'undefined'){
	          		  if(insuranceData.adjusterphone != null && insuranceData.adjusterphone != ''){
	          			$scope.athenaPhoneNumberPopup(athenaAllData,insuranceData);
	          		  }else{
	          			  //if adjusterphone not available
	          			$scope.saveRecommendedInsurance(athenaAllData,insuranceData, adjusterNumber);
	          		  }
	          		}else{
	          			//if adjusterphone not available
	          			$scope.saveRecommendedInsurance(athenaAllData,insuranceData,adjusterNumber);
	          		}
	            }
	            if (returndata == 'confirm2') {
	            	$scope.athenaSeeAllInsuranceOptions(athena_insuranceAlloptions,athenaAllData,adjusterNumber);
	            }
	            if (returndata == 'cancel') {
	            	//Popup will close here
	            }
	        }, function (returndata) {
	            debugger;
	        });
    }


	function sendPatientAthenaCode(codeInput){
		try{
    	 	$http({
    	        url: '/api/athena/ratefast/getAthenaCode',
    	        method: "POST",
    	        data: codeInput
    	    }).success(function (codedata, status, headers, config) {
		 		if(codedata.codeDetails.length>0){
		 			for(var i=0; i<codedata.codeDetails.length; i++){
		 				if(codedata.codeDetails[i].type=="occupation"){
		 					$scope.codeName.occupationCode = codedata.codeDetails[i].code;
		 				}else if(codedata.codeDetails[i].type=="industry"){
		 					$scope.codeName.industryCode = codedata.codeDetails[i].code;
		 				}
		 			}
		 		}
	 		 }).catch(function (err) {
		  		console.log(err);
	  	    }).finally(function(){

	  	    })
		}catch(err){
			console.log(err);
		}
	}

	function getPatientAthenaCode(codeInput,updateMode){

			$scope.athenaPatientDataForInjury={}
    		//$scope.athenaPatientDataForInjury.employerphone = typeof athenaPatient.employerphone !='undefined' ? athenaPatient.employerphone : '';
    		$scope.athenaPatientDataForInjury.occupationCode = '';
    		$scope.athenaPatientDataForInjury.industryCode = '';

		try{
    	 	$http({
    	        url: '/api/athena/ratefast/getAthenaCode',
    	        method: "POST",
    	        data: codeInput
    	    }).success(function (codedata, status, headers, config) {
		 		if(codedata.codeDetails.length>0){
		 			for(var i=0; i<codedata.codeDetails.length; i++){
		 				if(codedata.codeDetails[i].type=="occupation"){
							if(updateMode=='updateToRatefast'){
								$scope.injurydata.employment[0].jobtitle = codedata.codeDetails[i].codename;

							}
							$scope.athenaPatientDataForInjury.occupationCode = 	codedata.codeDetails[i].codename;
		 				}else if(codedata.codeDetails[i].type=="industry"){
							if(updateMode=='updateToRatefast'){
								$scope.injurydata.employer[0].natureofbusiness = 'Other';
								$scope.injurydata.employer[0].othernatureofbusiness = codedata.codeDetails[i].codename;

							}
							$scope.athenaPatientDataForInjury.industryCode = 	codedata.codeDetails[i].codename;

		 				}
		 			}
		 		}
	 		 }).catch(function (err) {
		  		console.log(err);
	  	    }).finally(function(){

	  	    })
		}catch(err){
			console.log(err);
		}
	}

	$scope.getPatientDataSSNUpdate = function(athenaSSN){
		try{
			var query = {};
			query.patientid = $sessionStorage.patientId;

			$http.get('/api/athena/ratefast/getPatientInfo', { params: query}).success(function (patient, status, headers, config) {

				if(typeof patient != 'undefined'){
					if(typeof patient.patients != 'undefined'){
						if(patient.patients.length > 0){
							if(typeof patient.patients[0].basicinformation != 'undefined'){
								if(patient.patients[0].basicinformation.length>0){
									patient.patients[0].basicinformation[0].socialsecurityno= athenaSSN;

									var query = {
								            patientid: $sessionStorage.patientId,
								            category: 'basicinformation',
								            categorynewdata: patient.patients[0].basicinformation[0]
								        };

								        $http.post('/api/athena/ratefast/updatePatient',query).success(function(response, status, headers, config){

								        }).catch(function (err) {

						   		  			console.log(err);
						   		  	    })
								}
							}
						}
					}
				}
			})
			.catch(function (err) {
				//var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +".</p></h3>";
				//$scope.errorPopup('',message,'Ok');
				console.log("update ssn err : "+err.data);
			})
		}catch(err){
			console.log("update ssn err : "+err);
		}
	}


    //Athena change: insert athena insurance details into ratefast database
    $scope.saveRecommendedInsurance = function(athenaAllData,athena_injury,adjusterNumber){
    	try{
			//from -- > athena patinet

				try{
					if(typeof $scope.athenaPatientDataForInjury !='undefined'){

						$scope.injurydata.employment[0].jobtitle = $scope.athenaPatientDataForInjury.occupationCode;

						if($scope.athenaPatientDataForInjury.industryCode !=''){
							$scope.injurydata.employer[0].natureofbusiness = 'Other';
							$scope.injurydata.employer[0].othernatureofbusiness = $scope.athenaPatientDataForInjury.industryCode;
						}
					}
					if(typeof athenaAllData.athenaPatient !='undefined'){
						$scope.injurydata.employer[0].emp_telephone = checkValues('PhoneNumber', athenaAllData.athenaPatient[0].employerphone);

					}
				}catch(err){
					console.log(err);
				}

			// from -- > athena insurance

				// update full ssn
				if(typeof athena_injury.insurancepolicyholderssn != 'undefined'){
					if(athena_injury.insurancepolicyholderssn != null && athena_injury.insurancepolicyholderssn != ''){
						$scope.getPatientDataSSNUpdate(athena_injury.insurancepolicyholderssn);
					}
				}

			//employer section

			//employer
				$scope.injurydata.employer[0].company = athena_injury.insurancepolicyholder;

			//empolyeraddress
				$scope.injurydata.employeraddress[0].emp_address1 = athena_injury.insurancepolicyholderaddress1;
				$scope.injurydata.employeraddress[0].emp_city = athena_injury.insurancepolicyholdercity;
				$scope.injurydata.employeraddress[0].emp_state = athena_injury.insurancepolicyholderstate;
				$scope.injurydata.employeraddress[0].emp_zipcode = athena_injury.insurancepolicyholderzip;


		// Admin section

			//insurance
				$scope.injurydata.insurance[0].insurance_claimsadministrator = athena_injury.insuranceplanname;
				$scope.injurydata.insurance[0].insurance_claimsnumber = athena_injury.insuranceclaimnumber;

			//claim adjuster
				$scope.injurydata.claimsadjuster[0].claimsadjuster_firstname = athena_injury.adjusterfirstname;
				$scope.injurydata.claimsadjuster[0].claimsadjuster_lastname = athena_injury.adjusterlastname;

			// get adjuster fax (Athena code)
                try{
                      if(typeof athena_injury.adjusterfax != 'undefined'){
                        if(athena_injury.adjusterfax != null && athena_injury.adjusterfax != ''){
                            var str = athena_injury.adjusterfax;
                            var num  = str.toString().replace( /\D+/g, '');

                            if(num != null && num !=''){
                                if(num.length >= 10){
                                  if(num.substring(0,1) == 1){
                                        $scope.injurydata.claimsadjuster[0].claimsadjuster_fax = num.substring(1,11);
                                  }else{
                                      $scope.injurydata.claimsadjuster[0].claimsadjuster_fax = num.substring(0,10);
                                  }
                                }
                            }
                        }
                      }
                }catch(err){

                }


		// "adjusterphone": "(123) 123-1231 EXT 5"

			//split above phone num into phone and extension
				//adjusterNumber : this comes from phone popup
				$scope.injurydata.claimsadjuster[0].claimsadjuster_telephoneno = adjusterNumber.phone;
				$scope.injurydata.claimsadjuster[0].claimsadjuster_extension = adjusterNumber.extension;


		// injury information section
				// $scope.injurydata.injuryinformation[0].timeofinjury = athena_injury.caseinjurydate;
				$scope.injurydata.injuryinformation[0].dateofinjury = athena_injury.caseinjurydate;
				$scope.injurydata.injuryinformation[0].injuryinformationdetail = athena_injury.descriptionofinjury;

				// this --> insurancepackageid --> save for uniqueness.
				$scope.injurydata.athena_insurancepackageid = athena_injury.insurancepackageid;

				//insurance id
				$scope.injurydata.athena_insuranceid = athena_injury.insuranceid;

		// communication
				$scope.injurydata.communication={};
				$scope.injurydata.communication.othernotes = athena_injury.injuredbodypart;


				$scope.dateofinjury = athena_injury.caseinjurydate;

				// set time 12.00 AM

                var tempDate = new Date(athena_injury.caseinjurydate);
                tempDate.setHours(00,00,00);
                $scope.injurydata.injuryinformation[0].timeofinjury = tempDate;
                $scope.timeofinjury = tempDate;

				// save to ratefast database
		    	$scope.openReportCreationMode();
    	}catch(err){
    		console.log(err);
    		var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err +".</p></h3>";
			$scope.errorPopup('',message,'Ok');
    	}
    }


    $scope.athenaSeeAllInsuranceOptions = function (insuranceOptions,athenaAllData,adjusterNumber) {
    	// here pass all insurance. so when any insurance select, that save / pass to saveRecommendInsurance
      debugger;
      var messge="<h3><p>If you do not see the insurance you are looking for, please make sure the information about this workers' compensation injury claim has been correctly entered into Athena.</p></h3>"
        $rootScope.modalInstance = $athenaModal.open({
        	templateUrl: 'partials/athena/athena-InsuranceOptionPopup.html',
	         controller: 'athenaInsuranceOptionPopUpCtrl',
            resolve: {
            	insuranceOptions: function () {
                    return insuranceOptions;
                },
                confirmButtonText: function () {
                    return "Import";
                },
                cancelButtonText: function () {
                    return "Cancel";
                },
                dispalyMessage: function () {
                    return messge;
                }
            }
        });
        $rootScope.modalInstance.result.then(function (returndata) {
            debugger;
            if (returndata == 'no') {

            }else{
            	if (returndata != '') {
            		athenaAllData.athenaInjury.insurances.forEach(function( item, index ){
            			if(item.insuranceid==returndata){

            				$scope.checkInsuranceExistance(athenaAllData, item, insuranceOptions);

            				/*if(typeof item.adjusterphone != 'undefined'){
          	          		  if(item.adjusterphone != null && item.adjusterphone != ''){
          	          			$scope.athenaPhoneNumberPopup(athenaAllData,item);
          	          		  }else{
          	          			  //if adjusterphone not available
          	          			$scope.saveRecommendedInsurance(athenaAllData,item, adjusterNumber);
          	          		  }
          	          		}else{
          	          			//if adjusterphone not available
          	          			$scope.saveRecommendedInsurance(athenaAllData,item,adjusterNumber);
          	          		}*/
            			}
            		})
                }
            }
        }, function (err) {
            debugger;
            // model failed
            console.log('err : ' + err);
        });
    }



    // this popup occurs when user click on "Add Manually -- > 1st popup button"

     $scope.athenaAddManuallyPopup = function () {

         debugger;
       var messge="<h3><p>If you add an injury to this patient in RateFast without importing from Athena, then you will need to update the injury information in both Athena and RateFast. Do you want to proceed?</p></h3>"
         $rootScope.modalInstance = $athenaModal.open({
         	 templateUrl: 'partials/athena/athena-dynamicPopup.html',
 	         controller: 'athenaDynamicPopUpCtrl',
             resolve: {
             	athenaPatientID: function () {
                     return '';
                 },
                 confirmButtonText: function () {
                     return "Cancel";
                 },
                 cancelButtonText: function () {
                     return "I understand, proceed";
                 },
                 dispalyMessage: function () {
                     return messge;
                 }
             }
         });
         $rootScope.modalInstance.result.then(function (returndata) {
             debugger;
             if (returndata == 'no') {
             	// goes to normally add injury
             	$scope.addInjury();
             }
             if (returndata == 'yes') {
            	 //if client say then call  -- >   $scope.getAthenaImportedInjury();
             }
         }, function (err) {
             debugger;
             // model failed
             console.log('err : ' + err);
         });

     }

     // popup -- > to check insurace existance in ratefast
     $scope.athenaInsuranceExistancePopup = function (ratefastPatientDetails) {
         debugger;
       var messge="<h3><p>This injury has already been imported into RateFast. Do you want to open this injury?</p></h3>"
         $rootScope.modalInstance = $athenaModal.open({
         	 templateUrl: 'partials/athena/athena-dynamicPopup.html',
 	         controller: 'athenaDynamicPopUpCtrl',
             resolve: {
             	athenaPatientID: function () {
                     return '';
                 },
                 confirmButtonText: function () {
                     return "Yes";
                 },
                 cancelButtonText: function () {
                     return "Cancel";
                 },
                 dispalyMessage: function () {
                     return messge;
                 }
             }
         });
         $rootScope.modalInstance.result.then(function (returndata) {
             debugger;
             if (returndata == 'yes') {
            	 //goes to inside injury n display reports
            	// $scope.InjuryDemographic(ratefastPatientDetails.patients[0].injury[0]._id);

            	 /*
            	  * problem : 0 : index ...
            	  * selectInjury function ne barobar set hote pan index 0 dilyane 1st injury active diste
            	  * tyamule risky aahe. baki working tr proper chalte.. better than user la
            	  * direct $scope.InjuryDemographic(ratefastPatientDetails.patients[0].injury[0]._id);
            	  * yethe pathava.. mhnje to tyachi details tri check krel, n save krun baher yeil tevha ti injury 1st la active pan disel
            	  *
            	  */

            	 // $scope.selectInjury(0,ratefastPatientDetails.patients[0].injury[0]._id);


            	 //  if rquired injry not present at 1st position, thena frm popup u directly goes injury demographics,
            	 //if yuo create any report from demographics, then it goes in wrong injry which is 1st position

            	   $scope.InjuryDemographic(ratefastPatientDetails.patients[0].injury[0]._id);

             }
             if (returndata == 'no') {

             }
         }, function (err) {
             debugger;
             // model failed
             console.log('err : ' + err);
         });
     }


 $scope.athenaPhoneNumberPopup = function (athenaAllData,insuranceData) {

		if(typeof insuranceData.adjusterphone!= 'undefined'){
			if(insuranceData.adjusterphone!= null && insuranceData.adjusterphone!= ''){
				debugger;
			       var messge="<h3><p>number </p></h3>"
			         $rootScope.modalInstance = $athenaModal.open({
			         	 templateUrl: 'partials/athena/athena-dynamicPopupPhoneNumber.html',
			 	         controller: 'athenaPhoneNumberCtrl',
			             resolve: {
			            	 phoneExtension: function () {
			                     return insuranceData.adjusterphone;
			                 },
			                 confirmButtonText: function () {
			                     return "Continue";
			                 },
			                 dispalyMessage: function () {
			                     return messge;
			                 }
			             }
			         });
			         $rootScope.modalInstance.result.then(function (returndata) {
			             debugger;
			             //save to database
			             //returndata : this is adjusterNumber from popup
			             $scope.saveRecommendedInsurance(athenaAllData,insuranceData, returndata);
			         }, function (err) {
			             debugger;
			             // model failed
			             console.log('err : ' + err);
			         });

			     }
		}
     }

	 $scope.errorPopup= function(id,message,buttonName){
		 debugger;
	     var messge="<h3><p>"+message+"</p></h3>"
	       $rootScope.modalInstance = $athenaModal.open({
	       	 templateUrl: 'partials/athena/athena-dynamicPopupSingleButton.html',
		         controller: 'athenaDynamicPopUpSingleButtonCtrl',
	           resolve: {
	           		ID: function () {
	                   return id;
	               },
	               cancelButtonText: function () {
	                   return buttonName;
	               },
	               dispalyMessage: function () {
	                   return messge;
	               }
	           }
	       });
	       $rootScope.modalInstance.result.then(function (returndata) {

	       }, function (err) {
	           debugger;
	           // model failed
	           console.log('err : ' + err);
	 });
	}

	function convertTextFromHtml(htmlValue){
         var divTag = document.createElement('div');
              divTag.innerHTML =  htmlValue;
              return divTag.innerText;
     }

	$scope.sendInsuranceDataToAthena = function(){

		 try
		 {
				$scope.codeName = {occupationCode :'', industryCode:''}

				var codeDetails={};
				codeDetails.industrycode = checkValues('General', $scope.injurydata.employer[0].othernatureofbusiness);
				codeDetails.occupationcode = checkValues('General', $scope.injurydata.employment[0].jobtitle);


				if(codeDetails.industrycode!='' || codeDetails.occupationcode!=''){
					codeDetails.mode = 'codename';
					sendPatientAthenaCode(codeDetails);
				}
		}
		catch(err)
		{
				console.log(err);
		}

		 try{
				$('#isSpinnerImportInjury').show();
	  			var query={}
	  	  		query.patientid = $scope.athena_patientid;
	  	  		query.practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
	  	  		query.departmentid = $rootScope.currentUser.athena_departmentid;
	  	  		query.insuranceid = $scope.injurydata.athena_insuranceid;

				//injury information section

                var injuryDescription = checkValues('General', $scope.injurydata.injuryinformation[0].injuryinformationdetail);

                query.descriptionofinjury = convertTextFromHtml(injuryDescription);

				if(typeof $scope.injurydata.communication!='undefined')
				{

					//communication
					var communicationText = checkValues('General', $scope.injurydata.communication.othernotes);

					query.injuredbodypart = convertTextFromHtml(communicationText);
				}

	  	  	//employer section

	  	  		if(typeof $scope.injurydata.employer[0].company !='undefined'){
					if($scope.injurydata.employer[0].company!='' && $scope.injurydata.employer[0].company != null){

					  //employer
						query.insurancepolicyholder = $scope.injurydata.employer[0].company;
						query.insuredentitytypeid = '2';
						query.relationshiptoinsuredid = '12';

					}
                }

	  	  		//empolyeraddress
	  	  		query.insurancepolicyholderaddress1 = checkValues('General', $scope.injurydata.employeraddress[0].emp_address1);
	  	  		query.insurancepolicyholdercity = checkValues('General', $scope.injurydata.employeraddress[0].emp_city);
	  	  		query.insurancepolicyholderstate = checkValues('General', $scope.injurydata.employeraddress[0].emp_state);
	  	  		query.insurancepolicyholderzip = checkValues('General', $scope.injurydata.employeraddress[0].emp_zipcode);


				//insurance
			  	  query.insuranceplanname = checkValues('General', $scope.injurydata.insurance[0].insurance_claimsadministrator);
			  	  query.insuranceclaimnumber = checkValues('General', $scope.injurydata.insurance[0].insurance_claimsnumber);

				//claim adjuster
			  	query.adjusterfirstname = checkValues('General', $scope.injurydata.claimsadjuster[0].claimsadjuster_firstname);
			  	query.adjusterlastname = checkValues('General', $scope.injurydata.claimsadjuster[0].claimsadjuster_lastname);

			    var adPhone = checkValues('PhoneNumber', $scope.injurydata.claimsadjuster[0].claimsadjuster_telephoneno);
			  	if(adPhone !=''){
			  		query.adjusterphone = adPhone;
			  	}
			  	var adFax = checkValues('PhoneNumber', $scope.injurydata.claimsadjuster[0].claimsadjuster_fax);
			  	if(adFax !=''){
			  		query.adjusterfax = adFax;
			  	}


				try
				{
					//query.caseinjurydate = $scope.dateofinjury;

					if(typeof $scope.dateofinjury != 'undefined'){
				  		 var dob = new Date($scope.dateofinjury);

				  		 var day = dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate();
				  		 var month = dob.getMonth() + 1;
				  		 month = month <10 ? '0' + month : month;

				  		 var year = dob.getFullYear();

				  	  	 query.caseinjurydate = month + "/" + day + "/" + year;
				  	}

				}
				catch(err)
				{

				}

		    	$http.put('/api/athena/updateInsuranceDatatoAthena',query).success(function (athenaPatient, status, headers, config) {

					var patientData = {}

					patientData.patientid = $scope.athena_patientid;
					patientData.practiceid = $rootScope.currentUser.practiceDetails.athena_practiceid;
					patientData.departmentid = $rootScope.currentUser.athena_departmentid;
					patientData.occupationcode = $scope.codeName.occupationCode;
					patientData.industrycode = $scope.codeName.industryCode;

					var ePhone = checkValues('PhoneNumber',  $scope.injurydata.employer[0].emp_telephone);
				  	if(ePhone !=''){
				  		patientData.employerphone = ePhone;
				  	}



					// update following from  $scope.getAthenaOccIndustryCodeAgainstName

					if(ePhone=='' && patientData.occupationcode=='' && patientData.industrycode==''){
				  		$('#isSpinnerImportInjury').hide();
			 			var message="<h3><p>Patient with patient id '" + $scope.athena_patientid + "' was synced successfully.</p></h3>";
				  		$scope.errorPopup('',message,"Okay");
				  	}
					else
					{

						$http.put('/api/athena/syncpatienttoathena',patientData).success(function (athenaPatientUpdate, status, headers, config) {

						 }).catch(function (err) {
								console.log(err);
						}).finally(function(){
							$('#isSpinnerImportInjury').hide();
							var message="<h3><p>Patient with patient id '" + $scope.athena_patientid + "' was synced successfully.</p></h3>";
							$scope.errorPopup('',message,"Okay");
						})
					}

		 		 }).catch(function (err) {

			  			console.log(err);
			  			$('#isSpinnerImportInjury').hide();
			  			//var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";
						var message="<h3><p>Technical Error : </p></h3> <h3><p>We're sorry, an error occurred. Please retry. If the issue persists, please contact the help desk or enter the information manually.</p></h3>";
			  			$scope.errorPopup('',message,'Okay');
		  	    }).finally(function () {
		  	});
		 }catch(err){
			 $('#isSpinnerImportInjury').hide();
			console.log(err);
		 }
	 }

	 $scope.getAthenaInsuranceDataForUpdate = function(athena_patient,athena_injury){

			try{

				//employer section

				//employer
					$scope.injurydata.employer[0].company = athena_injury.insurancepolicyholder;

				//empolyeraddress
					$scope.injurydata.employeraddress[0].emp_address1 = athena_injury.insurancepolicyholderaddress1;
					$scope.injurydata.employeraddress[0].emp_city = athena_injury.insurancepolicyholdercity;
					$scope.injurydata.employeraddress[0].emp_state = athena_injury.insurancepolicyholderstate;
					$scope.injurydata.employeraddress[0].emp_zipcode = athena_injury.insurancepolicyholderzip;


			// Admin section

				//insurance
					$scope.injurydata.insurance[0].insurance_claimsadministrator = athena_injury.insuranceplanname;
					$scope.injurydata.insurance[0].insurance_claimsnumber = athena_injury.insuranceclaimnumber;

				//claim adjuster
					$scope.injurydata.claimsadjuster[0].claimsadjuster_firstname = athena_injury.adjusterfirstname;
					$scope.injurydata.claimsadjuster[0].claimsadjuster_lastname = athena_injury.adjusterlastname;


			// injury information section
					 $scope.injurydata.injuryinformation[0].injuryinformationdetail = athena_injury.descriptionofinjury;


				//ng-hide="IsdeleteInjury"   --> then delete injury button hide---> so dont alloed to update dateofinjury
					//else update it n time


					 if(typeof athena_injury.caseinjurydate != 'undefined'){
						 if(athena_injury.caseinjurydate != ''){
							 if(athena_injury.caseinjurydate != null){
								 $scope.injurydata.injuryinformation[0].dateofinjury = athena_injury.caseinjurydate;
								 $scope.dateofinjury = athena_injury.caseinjurydate;

								// set time 12.00 AM
								 var tempDate = new Date(athena_injury.caseinjurydate);
								 tempDate.setHours(00,00,00);
								 $scope.injurydata.injuryinformation[0].timeofinjury = tempDate;
								 $scope.timeofinjury = tempDate;
							 }
						 }
					 }




			// communication
					$scope.injurydata.communication={};
					$scope.injurydata.communication.othernotes = athena_injury.injuredbodypart;


					$scope.employerform.$setDirty();
					$scope.Empinfopageform.$setDirty();
					$scope.employeraddressform.$setDirty();
					$scope.insuranceform.$setDirty();
					$scope.claimsadjusterform.$setDirty();
					$scope.communicationform.$setDirty();
					$scope.changedetect.$setDirty();

					//employer
                    $scope.addEntity('injury.$.injurydata.employer',$scope.injurydata.employer[0],$scope.employerform.$name,'Athena');
                    //employment
                    $scope.addEntity('injury.$.injurydata.employment',$scope.injurydata.employment[0],$scope.Empinfopageform.$name,'Athena');
                    //Employer Address
                    $scope.addEntity('injury.$.injurydata.employeraddress',$scope.injurydata.employeraddress[0],$scope.employeraddressform.$name,'Athena');
                    //insurance
                    $scope.addEntity('injury.$.injurydata.insurance',$scope.injurydata.insurance[0],$scope.insuranceform.$name,'Athena');

                    //claim adjuster
                    $scope.addEntity('injury.$.injurydata.claimsadjuster',$scope.injurydata.claimsadjuster[0],$scope.claimsadjusterform.$name,'Athena');

                    //injury date
                    $scope.UpdateInjuryInfo();

                    //save communication
                    $scope.saveCommunication();

					setTimeout(function(){
					$('#isSpinnerImportInjury').hide();
					var message="<h3><p>Patient with patient id '" + $scope.athena_patientid + "' was synced successfully.</p></h3>";

					$scope.errorPopup('',message,"Okay");
					}, 3000);

					// save to ratefast database
	    	}catch(err){
	    		console.log(err);
	    		$('#isSpinnerImportInjury').hide();
	    		var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err +".</p></h3>";
				$scope.errorPopup('',message,'Okay');

	    	}

	 }

	$scope.getDetailsAthenaInsuranceData = function(modeOfUpdate){

         if($rootScope.currentUser.practiceDetails.isAthena){
             $('#isSpinnerImportInjury').show();

             $http.get('/api/athena/getinjurydetails', { params: {patientid: $scope.athena_patientid, practiceid : $rootScope.currentUser.practiceDetails.athena_practiceid, departmentid : $rootScope.currentUser.athena_departmentid }
                }).success(function (athenaInjuryData, status, headers, config) {
                    try{

                        if(typeof athenaInjuryData != 'undefined'){
                            if(typeof athenaInjuryData.athenaInjury != 'undefined'){
                                if(typeof athenaInjuryData.athenaInjury.insurances != 'undefined'){
                                    if(athenaInjuryData.athenaInjury.insurances.length>0){

                                            var blnInsurancePresent = false;
                                            var countInsurance = 0;
                                            var indexOfInsurance = null;
                                            athenaInjuryData.athenaInjury.insurances.forEach(function( item, index ){
                                                countInsurance++;
                                                if($scope.injurydata.athena_insurancepackageid == item.insurancepackageid){
                                                    blnInsurancePresent = true;
                                                    indexOfInsurance = index;
                                                }
                                        });

                                        if(countInsurance == athenaInjuryData.athenaInjury.insurances.length){
                                                if(blnInsurancePresent ==false){
                                                    var message="<h3><p>This Injury can not be found in Athena</p></h3>";
                                                      $scope.errorPopup('',message,'Ok');
                                                }else{
                                                   if(modeOfUpdate=='toRatefast'){
														try{
															$scope.athenaPatientDataForInjury={	occupationCode:'', industryCode:''};

															var codeDetails={};
															codeDetails.industrycode = checkValues('General', athenaInjuryData.athenaPatient[0].industrycode);
															codeDetails.occupationcode = checkValues('General', athenaInjuryData.athenaPatient[0].occupationcode);

															if(codeDetails.industrycode!='' || codeDetails.occupationcode!=''){
																codeDetails.mode = 'code';

																getPatientAthenaCode(codeDetails,'updateToRatefast');
															}
														}catch(err){
															console.log(err);
														}
														$scope.getAthenaInsuranceDataForUpdate(athenaInjuryData.athenaPatient,athenaInjuryData.athenaInjury.insurances[indexOfInsurance]);
													}else if(modeOfUpdate=='toPhoneNumber'){
														console.log('toPhone');
                                                        $scope.getUpdatedAthenaInjuryPhoneNumbers(athenaInjuryData.athenaPatient,athenaInjuryData.athenaInjury.insurances[indexOfInsurance]);
                                                    }
                                                }
                                        }
                                    }else{
                                        $('#isSpinnerImportInjury').hide();
                                        var message="<h3><p>This Injury can not be found in Athena</p></h3>";
                                          $scope.errorPopup('',message,'Okay');
                                    }
                                }
                            }
                        }
                    }catch(err){
                        $('#isSpinnerImportInjury').hide();
                        var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err +"</p></h3>";
                        $scope.errorPopup('',message,'Okay');
                    }
                })
                .catch(function (err) {
                    $('#isSpinnerImportInjury').hide();
                    console.log(err)
                    var message="<h3><p>Technical Error : </p></h3> <h3><p>"+ err.data +"</p></h3>";
                    $scope.errorPopup('',message,'Okay');
                })
                .finally(function(){
                    //$('#isSpinnerImportInjury').hide();
                })
		}
	}

	function checkValues(valType, val){

    	var returnVal = '';
    	if(valType == 'General'){
        	if(typeof val != 'undefined'){
        		if(val != null){
          	  	  return val;
        		}else{
      	  		  return returnVal;
      	  	    }
    	  	 }else{
    	  		  return returnVal;
    	  	 }
    	}


    	if(valType == 'Gender'){
    		if(typeof val != 'undefined'){
    			if(val != null){
            	  	  if(val == 'Male'){
            	  		return 'M';
            	  	  }else if(val == 'Female'){
      		  	  		return 'F';
      		  	  	  }else{
      		  	  		return returnVal;
      		  	  	  }
          		}else{
        	  		  return returnVal;
        	  		 }
  	  		}else{
  	  		  return returnVal;
  	  		}
    	}

		if(valType == 'PhoneNumber'){
				if(typeof val != 'undefined'){
               if(val != null){
                    var num  = val.toString().replace( /\D+/g, '');
                   if(num.length==10){
                       return num;
                   }else{
                       return returnVal;
                   }
               }else{
                     return returnVal;
                   }
              }else{
                   return returnVal;
              }
		}

    	if(valType == 'ContactPreference'){
    		if(typeof val != 'undefined'){
    			if(val != null){
            	  	  if(val == 'Home phone'){
            	  		return 'HOMEPHONE';
            	  	  }else if(val == 'Cell phone'){
      		  	  		return 'MOBILEPHONE';
      		  	  	  }else{
      		  	  		return returnVal;
      		  	  	  }
          		}else{
        	  		  return returnVal;
        	  		 }
  	  		}else{
  	  		  return returnVal;
  	  		}
    	}

    }


	$scope.getUpdatedAthenaInjuryPhoneNumbers = function(patientData,injuryData){
       //this function used to only update athena patient phone numbers in ratefast..

       try{
			  $('#isSpinnerImportInjury').show();

			 var phoneValues = {};
				  phoneValues.employerContact = checkValues('General', patientData[0].employerphone);
				  phoneValues.adjusterPhone = checkValues('General', injuryData.adjusterphone);
				  phoneValues.adjusterFax = checkValues('General', injuryData.adjusterfax);

				  $('#isSpinnerImportInjury').hide();

				  if(phoneValues.employerContact =='' && phoneValues.adjusterPhone == '' && phoneValues.adjusterFax == ''){
					  var message="<h3><p>There are no phone or fax numbers in Athena for this workers' compensation policy for patient " + $scope.athena_patientid +".</p></h3>";
					  $scope.errorPopup('',message,"Okay");
				  }else{
					   $rootScope.modalInstance = $modal.open({
							  templateUrl: 'partials/athena/athena-InjuryPhonePopup.html',
							  controller: 'athenaInjuryPhonePopupCtrl',
								resolve: {
								  phoneData: function () {
									return phoneValues;
								},
									confirmButtonText: function () {
										return 'Proceed';
									},
									cancelButtonText: function () {
										return 'Cancel';
									},
									dispalyMessage: function () {
										return '';
									}
								}
							});
							$rootScope.modalInstance.result.then(function (returndata) {
								if(typeof returndata!='undefined'){
									$scope.injurydata.employer[0].emp_telephone  = returndata.employerContact;
									$scope.injurydata.claimsadjuster[0].claimsadjuster_telephoneno  = returndata.adjusterPhone;
									$scope.injurydata.claimsadjuster[0].claimsadjuster_extension = returndata.adjusterPhoneExtension;
									$scope.injurydata.claimsadjuster[0].claimsadjuster_fax  = returndata.adjusterFax;
									//update to database
									$scope.employerform.$setDirty();
									$scope.claimsadjusterform.$setDirty();

									//Employer contact
                                    $scope.addEntity('injury.$.injurydata.employer',$scope.injurydata.employer[0],$scope.employerform.$name,'Athena');

									//Claim adjuster
                                    $scope.addEntity('injury.$.injurydata.claimsadjuster',$scope.injurydata.claimsadjuster[0],$scope.claimsadjusterform.$name,'Athena');

									setTimeout(function(){

                						var message="<h3><p>Insurance phone numbers for patient id '" + $scope.athena_patientid + "' were synced successfully.</p></h3>";
                				  		$scope.errorPopup('',message,"Okay");
                					}, 2000);


								}
							}, function (err) {
								debugger;
								// model failed
								console.log('err : ' + err);
							});

			}
        }
       catch(err){
               console.log(err);
               $('#isSpinnerImportInjury').hide();
       }
    }


	/*********************************************End of athena code*********************************************/


});


angular.module('ratefastApp').filter('replaceword', function () {
    return function (items) {

        var header = items.split('_').length > 1 ? items.split('_')[1] : items.split('_')[0];
        switch (header) {
            case 'othernatureofbusiness':
                return 'Notes';
                break;
            case 'natureofbusiness':
                return 'Nature of Business';
                break;
            case 'updatedby':
                return 'Updated By';
                break;
            case 'updateddate':
                return 'Date updated';
                break;
            case 'durationofemployement':
                return 'Duration of Employement';
                break;
            case 'durationtype':
                return 'Duration Type';
                break;
            case 'firstname':
                return 'First Name';
                break;
            case 'lastname':
                return 'Last Name';
                break;
            case 'telephoneno':
                return 'Telephone';
                break;
            case 'claimsadministrator':
                return 'Claims Administrator';
                break;
            case 'claimsnumber':
                return 'Claims Number';
                break;
            case 'insuranceaddressline1':
                return 'Address1';
                break;
            case 'insuranceaddressline2':
                return 'Address2';
                break;
            case 'insurancecity':
                return 'City';
                break;
            case 'insurancezipcode':
                return 'Zip code';
                break;
            case 'zipcode':
                return 'Zip code';
                break;
            case 'insurancestate':
                return 'State';
                break;
            default:
                return header;
        }
    };
});

angular.module('ratefastApp').filter('removeblank', function () {
    return function (items) {

        angular.forEach(items[0], function (value, key) {
            debugger;
            if (value != ' ') {
                return items[0][key] = value;
            } else {
                return items[0][key] = '';
            }
        });
    };
});

/*
 * splitrfaheading : this filter use for rfa heading in request for authorization
 * when the text is Other then diplay the text after : (split)
 */
angular.module('ratefastApp').filter('splitrfaheading',function(){
	return function(input, splitChar) {
		var length=input.split(splitChar).length;
		if(length>0)
		return input.split(splitChar)[length-1];
		else
			return input.split(splitChar)[0];
    }
});




'use strict';

angular.module('ratefastApp').controller('PracticeCtrl', function ($http, $scope, $rootScope, $routeParams, $location, $locale, $timeout, Practices, PracticesUnique, StatesList, CountriesList, Auth, $cookieStore, $modal, getccchargereport, $filter, downloadReportSafari, getReportPricingList, $sce, updateUserFromPracticeProfile, resendinvitesUsers, resetpassword, changeUserPasswordShareID) {

    //For getting list of salespersons
    debugger;
    $scope.UniquePracticeName = function (practicename) {
        debugger;
        $scope.practicename = practicename;
        var query = { practiceName: practicename }
        PracticesUnique.UniqueName().get(query, function (result) {

        });
    };
	

    $scope.currentPage = 1;
    $scope.maxsize = 5;
    $scope.itemsperpage = 9;
    $scope.search = "";
    $scope.statusId = "";
    $scope.practices = new Object();
    $scope.practice = new Object();
    $scope.flagAddress = true;
    $scope.months = $locale.DATETIME_FORMATS.MONTH;
    $scope.currentYear = new Date().getFullYear();
    $scope.currentMonth = new Date().getMonth() + 1;
    $scope.practiceYes = true;
    $scope.statusYes = true;
    $scope.currentuserrole = $rootScope.currentUser.role;
    $scope.currentuserrolename = $rootScope.currentUser.rolename;
    $scope.currentuserlevel = $rootScope.currentUser.role.split(' ')[1];
    $scope.isLoad = false;
	$scope.searchBy="byPracticename";
	//for user tab
	//itemsperpage -- > this is same for card n list view and user tab...if in client want more in any 1 then create new varible for that
	$scope.usercurrentPage = 1;
	changeUserPasswordShareID.set('');

    $scope.dateOptions = {
        startingDay: 1,
        changeMonth: true,
        changeYear: true,
        showAnim: "clip",
        clearBtn: true
    };

	$scope.trim=function(data){
    	return document.trim(data);
    }
	
    $scope.filterPractices = function (status) {
        $scope.currentPage = "1";
        $scope.statusId = status;
        if ($scope.statusId) {
            $scope.listPractices($scope.currentPage, $scope.statusId);
        }
        else {
            $scope.listPractices($scope.currentPage);
        }
    }

    $scope.searchPractices = function (searchval) {
        debugger;
        $scope.currentPage = '1';
        $scope.search = searchval;
        $scope.listPractices($scope.currentPage);

    }
	
	$scope.setsearchByselection = function (searchval) {
        debugger;
        $scope.searchBy = searchval;       
    }

    $scope.showlist = function (val) {
        debugger;
        $scope.listViewEnabled = val;
    }

    $scope.listPractices = function (pagenumber) {

        if (pagenumber == null)
            pagenumber = 1;
        debugger;
        var role = $scope.currentUser.role;
        if (role != 'siteadmin') {
            $scope.statusYes = false;
        }

        var query = {
            pagenum: pagenumber,
            pageController: 'page'
        };

        $scope.currentPage = pagenumber;

        if ($scope.statusId != "") {
            query.statusId = $scope.statusId;
            query.statusController = 'status';
        }

        if ($scope.search != "") {
            query.searchId = $scope.search;
            query.searchController = 'search';
			query.usersearch=$scope.searchBy;
        }
        debugger;
        //Practices.practices.query(query).$promise.then(function (practices) {
		Practices.searchAllPractice().save(query).$promise.then(function (practices) {
            debugger;
            //debugger; $scope.fullPractice = true;
            $scope.pid = $rootScope.currentUser.pid;
            //$scope.search = "";
            if (practices[0]) {
                var flagPractice = practices[0].practices.length;
                if (flagPractice == 0) {					
                    $scope.practiceYes = false;
					$scope.practices = [];
                    $scope.noRecordsFoundMsg ='<div class="col-sm-2 col-sm-offset-5 alert alert-dismissable alert-danger">No Records Found !</div>';
                } else {
                    $scope.practiceYes = true;
                    $scope.practices = practices[0].practices;
                    $scope.practice = $scope.practices[0];
                    $cookieStore.put('stampapproval', $scope.practice.stampapproval);
                    $scope.totalItems = practices[0].totalitem;
                    $scope.noOfPages = practices[0].pages;
					$scope.noRecordsFoundMsg ='';
					// to get users in user tab 
					/*
					 * here getUsersList call when !=siteadmin , bcz for siteadmin, editpractice function called.so at that time we call getuserlist
					 * so no need to call 2 times for siteadmin
					 */
					if($scope.currentuserrolename !='siteadmin'){
						$scope.getUsersList($scope.practice.practicename,1);
					}
                }
            } else {
                $scope.practiceYes = false;
                $scope.practices = [];
				$scope.noRecordsFoundMsg ='<div class="col-sm-2 col-sm-offset-5 alert alert-dismissable alert-danger">No Records Found !</div>';
            }
        });

    }
	
	$scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };

    $scope.statesList = function () {
        StatesList.query(function (states) {
            $scope.states = states;
        });
    };

    $scope.countriesList = function () {
        CountriesList.query(function (countries) {
            $scope.countries = countries;
        });
    };

    $scope.getLogo = function (practice) {
        var dataImg = {
            letterhead: practice.letterhead
        }

        var data = {
            id: practice.letterhead
        }
        Practices.getLogo().query(data, function (res) {
            $scope.letterhead_img = 'data:image/jpeg;base64,' + res.data;
        });

    };

    $scope.editPractice = function (practice) {
        debugger;
        //var role = Auth.currentLoggedinUser().role;
        //if (role != 'siteadmin' && role != 'superadmin') {
        //    $scope.hideme = true;
        //}
        
        //Commented by Unais as this is not required (Dated 23rd Feb, 2016 )
		//$scope.getLogo(practice);

        $scope.fullPractice = true;
        $scope.practice = practice;
        $cookieStore.put('practicename', $scope.practice.practicename);
		
		//get users list
        $scope.getUsersList($scope.practice.practicename,1);

    }

    $scope.savePractice = function () {
        debugger;
        Practices.updatePractice().update($scope.practice).$promise.then(function (response) {
             //$scope.listPractices();
        });
        $scope.updateStatus = true;
		
		if($rootScope.currentUser.practicename == $scope.practice.practicename){
            if(typeof  $rootScope.currentUser.practiceDetails.rfadetails == 'undefined'){                
               $rootScope.currentUser.practiceDetails.rfadetails = {};
                $rootScope.currentUser.practiceDetails.rfadetails.firstname = '';
                $rootScope.currentUser.practiceDetails.rfadetails.lastname = '';
                $rootScope.currentUser.practiceDetails.rfadetails.email = '';
            }
            
           if(typeof $scope.practice.rfadetails != 'undefined'){
                if($scope.practice.rfadetails != null){
                    if(typeof $scope.practice.rfadetails.firstname != 'undefined'){
                        if($scope.practice.rfadetails.firstname != null){
                            $rootScope.currentUser.practiceDetails.rfadetails.firstname = $scope.practice.rfadetails.firstname;
                        }
                    }
                    
                   if(typeof $scope.practice.rfadetails.lastname != 'undefined'){
                        if($scope.practice.rfadetails.lastname != null){
                            $rootScope.currentUser.practiceDetails.rfadetails.lastname = $scope.practice.rfadetails.lastname;
                        }
                    }
                    
                   if(typeof $scope.practice.rfadetails.email != 'undefined'){
                        if($scope.practice.rfadetails.email != null){
                            $rootScope.currentUser.practiceDetails.rfadetails.email = $scope.practice.rfadetails.email;
                        }
                    }
                }                            
           }            
       }
		
		
        $timeout(function () {
            $scope.updateStatus = false;
        }, 3000);
    };

    $scope.valid_credit_card = function (value) {

        debugger;
        // accept only digits, dashes or spaces
        if (/[^0-9-\s]+/.test(value) || value.length < 13) return false;

        // The Luhn Algorithm. It's so pretty.
        var nCheck = 0, nDigit = 0, bEven = false;
        value = value.replace(/\D/g, "");

        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n),
                  nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) == 0;
    }
    $scope.fullFormLoader = true;
    $scope.saveCreditInfo = function () {
        debugger;
        $scope.fullFormLoader = false;

        if (!$scope.practice.month && !$scope.practice.year) {
            $scope.fullFormLoader = true;
            var messageinfo = 'Please Enter Expiration Date';

            var modalInstance = $modal.open({
                templateUrl: 'partials/popupmessage.html',
                controller: 'popupMessagectrl',
                resolve: {
                    message: function () {
                        return messageinfo;
                    }
                }

            });

        }
        else if ($scope.valid_credit_card($scope.practice.cardno)) {

            Practices.updateCreditCard().updateCredit($scope.practice).$promise.then(function (response) {
                $scope.fullFormLoader = true;
                $scope.practice.cardno = '';
                $scope.practice.month = '';
                $scope.practice.year = '';

                if (response.ccerror) {

                    var messageinfo = 'Invalid Credit Card Information.';
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/popupmessage.html',
                        controller: 'popupMessagectrl',
                        resolve: {
                            message: function () {
                                return messageinfo;
                            }
                        }

                    });
                } else {

                    var messageinfo = 'Credit card information succesfully updated.';
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/popupmessage.html',
                        controller: 'popupMessagectrl',
                        resolve: {
                            message: function () {
                                return messageinfo;
                            }
                        }

                    });
                }
            });

        }
        else {
            $scope.fullFormLoader = true;
            $scope.practice.cardno = '';
            $scope.practice.month = '';
            $scope.practice.year = '';
            var messageinfo = 'Invalid Credit Card Information.';
            $scope.practice.cardno = '';

            var modalInstance = $modal.open({
                templateUrl: 'partials/popupmessage.html',
                controller: 'popupMessagectrl',
                resolve: {
                    message: function () {
                        return messageinfo;
                    }
                }

            });
        }
    };

    $scope.saveStampInfo = function () {
        debugger;
        var data = {
            _id: $scope.practices[0]._id,
            stampapproval: $scope.practice.stampapproval
        }

        Practices.updateStampApproval().updateStamp(data);
        $scope.updateStatusStamp = true;
        $timeout(function () {
            $scope.updateStatusStamp = false;
        }, 3000);

    };

    $scope.addAddress = function () {       
		/*
         * check practicename2 undefined or not
         * default location text should be practicename2
         */
        var defaultLocation='';
        var defaultphonenumber='';
        var defaultextension='';
        var defaultfaxnumber='';
        try{
        	  	defaultLocation=$scope.practice.practicename2;
        	  	defaultphonenumber=$scope.practice.billingaddress.phonenumber;
        	  	defaultextension=$scope.practice.billingaddress.billingextension;
        	  	defaultfaxnumber=$scope.practice.faxnumber;
        	}
        catch (err) {
        	//console.log(err);
        }
		
        //update
        $scope.practice.practiceaddress.push({ street: '', country: '', city: '', state: '', zipcode: '', location:defaultLocation,phonenumber:defaultphonenumber, extension:defaultextension, faxnumber:defaultfaxnumber});
        var a = $scope.practice.practiceaddress.length - 1;
        $scope.practice.practiceaddress[$scope.practice.practiceaddress.length - 1].country = "US";
    }

    $scope.removeAddress = function (id) {
        var i = $scope.practice.practiceaddress.indexOf(id);
        if (i != -1) {
            $scope.practice.practiceaddress.splice(i, 1);
        }
    }

    $scope.cleanData = function () {
        debugger;
        $scope.fullPractice = false;
        $scope.updateStatus = false;
        $scope.updateStatusCredit = false;
        $scope.updateStatusStamp = false;
        $scope.newAddress = '';
        $scope.letterhead_img = null;
        if (document.getElementById('letterhead')) {
            document.getElementById('letterhead').value = '';
        }
    }

    $scope.open = function () {
        debugger;
        var template = '';
        template = 'partials/billingcalPopup.html';

        var modalInstance = $modal.open({
            templateUrl: template,
            controller: 'ModalInstanceCtrll'

        });
    };
	
	$scope.openPopup = function (type) {
            debugger;
            var template = '';
            debugger;
            if (type == 4 || type == 10 || type == 11 ) {
                template = 'partials/providerpopup.html';
            }            		
            var modalInstance = $modal.open({
                templateUrl: template,
                controller: 'signPopupCtrl',
                resolve: {
                    type: function () {
                        return type;
                    }
                }
            });
        };
		
		 $scope.checkErr = function(startDate,endDate) {
			$scope.errMessage = '';           		
			if(new Date(endDate) < new Date(startDate)){
				$scope.validationMessage=true;
				$scope.errMessage = 'To Date should not be less than From Date.';
				$scope.showfirsttable = false;
				return false;
			}	
		};

    $scope.create = function (isValid) {
        debugger;
        $scope.date;
        $scope.submited = true;		
		$scope.validationMessage=false;		        
		if($scope.checkErr($scope.startdate,$scope.enddate)==false){
			return false;
		}
		
        var currp = $cookieStore.get('practicename');
        if (currp) {
            var query = { startdate: $scope.startdate, enddate: $scope.enddate, practicename: $cookieStore.get('practicename') }
        } else {
            var query = { startdate: $scope.startdate, enddate: $scope.enddate, practicename: $rootScope.currentUser.practicename }
        }
        if (isValid) {
            $scope.isLoad = true;
            getccchargereport.save(query).$promise.then(function (reports) {
                debugger;
                $scope.isLoad = false;
                $scope.rowCollection = reports.data;
                $scope.displayedCollection = [].concat($scope.rowCollection);
                if ($scope.displayedCollection.length > 0) {
                    $scope.showsecondtable = true;
                } else {
                    $scope.showsecondtable = false;
                }
                
            });
        }
    }

    $scope.ccChargereportCSV = function () {
        debugger;
        $scope.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        if ($scope.isSafari) {
            var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + $rootScope.currentUser.practicename + ' CC Report.csv';
            //var filename = '04-08-2015 johnpractice DFR Discovery.zip';
        } else {
            var filename = $filter('date')(Date.now(), 'MM-dd-yyyy') + ' ' + $rootScope.currentUser.practicename + ' CC Report.csv';
        }
        var content = 'Provider Name, Report Type, Report ID, Charge Amount, Date';
        for (var i = 0; i < $scope.rowCollection.length; i++) {
            content = content.concat('\n');
            if ($scope.rowCollection[i].data) {
                content = content.concat($scope.rowCollection[i].data.signDoctor.level4.firstname.charAt(0).toUpperCase() + $scope.rowCollection[i].data.signDoctor.level4.firstname.slice(1) + ' ' + $scope.rowCollection[i].data.signDoctor.level4.lastname.charAt(0).toUpperCase() + $scope.rowCollection[i].data.signDoctor.level4.lastname.slice(1) + ', ');
            } else {
                content = content.concat(', ');
            }
            content = content.concat($scope.rowCollection[i].formtype.toUpperCase() + ', ');
            content = content.concat($scope.rowCollection[i].id + ', ');
            content = content.concat($filter('currency')($scope.rowCollection[i].reportcharge, '$', 2) + ', ');
            content = content.concat($filter('date')($scope.rowCollection[i].submittedDate, 'MM/dd/yyyy'));
        }
        if ($scope.isSafari) {
            //window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");
            downloadReportSafari.save({ 'content': content, 'filename': filename }).$promise.then(function (response) {
                var popup = window.open("/tmp/" + filename, "_blank", "fullscreen=no,toolbar=yes, width=800, height=600, menubar=yes, status=no,scroll=yes");

                if (popup == undefined) {
                    alert('Please disable your popup blocker');
                }
            });

        } else {

            var blobs = [];
            blobs.push(content);
            var blob = new Blob(blobs, {
                type: "application/vnd.oasis.opendocument.text"
            });
            saveAs(blob, filename);
        }

    }

    $scope.getPricingList = function () {
        debugger;
        getReportPricingList.query().$promise.then(function (response) {
            debugger;
            $scope.reportpricinglist = response;
        });

    }

    $scope.updateCustomReportPricing = function () {
        debugger;
        $scope.isLoad = true;
        Practices.updateCustomReportPricing().update($scope.practice).$promise.then(function (response) {
            debugger;
            $scope.isLoad = false;
            if ($scope.practice.pricingtype == 'defaultpricing') {
                var messageinfo = 'Default price updated successfully.';
            } else {
                var messageinfo = 'Custom price updated successfully.';
            }
                       
            var modalInstance = $modal.open({
                templateUrl: 'partials/popupmessage.html',
                controller: 'popupMessagectrl',
                resolve: {
                    message: function () {
                        return messageinfo;
                    }
                }

            });
            
        });
    }

    $scope.setDefaultPricing = function () {       
        
        var dfrCharge = $filter("filter")($scope.reportpricinglist, { formtype: "dfr" });
        var pr2Charge = $filter("filter")($scope.reportpricinglist, { formtype: "pr2" });
        var pr4Charge = $filter("filter")($scope.reportpricinglist, { formtype: "pr4" });
        
        $scope.practice.reportpricing.dfr = dfrCharge[0].pricing;
        $scope.practice.reportpricing.pr2 = pr2Charge[0].pricing;
        $scope.practice.reportpricing.pr4 = pr4Charge[0].pricing;

    }
	
	 //code of user tab
    
    /*     
     * $scope.getUsersList : this function used to get list of users according to practicename 
     */
    $scope.getUsersList=function(practicename,userpagenumber){
    	
    	if (userpagenumber == null){
            userpagenumber = 1;
    	}
    	
    	var query = {
                pagenum: userpagenumber,
                pageController: 'page',
                practicename:practicename
            };
    	$scope.usercurrentPage = userpagenumber;
    	//add in query   or[status: active or invite]
    	//next sprint delete patient concept comes so
    	//print phone number in format == ()--
    	if(practicename){
    		Practices.getUserListbyPracticename().save(query).$promise.then(function(userlist){    					
    			if(userlist.totalitem>0){
    				
    				userlist.userdata.forEach(function(data) {    				    
    				    switch(data.practice.rolename)
    				    {
    				    	case "nonadmin":
    				    	data.practice.rolename="Non-admin";    				    	
    				    	break;
    				    	case "admin":
        				    	data.practice.rolename="Admin"
        				    break;
    				    	case "superadmin":
        				    	data.practice.rolename="Superadmin"
        				    break;
    				    	case "siteadmin":
        				    	data.practice.rolename="Siteadmin"
        				    break;
    				    	case "rater1":
        				    	data.practice.rolename="Rater1"
        				    break;
    				    	case "rater2":
        				    	data.practice.rolename="Rater2"
        				    break;        				    	
    				    }
    				    
    				    if(data.practice.level){
    				    	data.practice.level=data.practice.level[data.practice.level.length-1];
    				    }
    				});
    				
    				
    				$scope.users=userlist.userdata;    
    				$scope.usertotalItems = userlist.totalitem;
    				$scope.usernoOfPages = userlist.pages;
    			}
    			else{
    				$scope.users=[];        				
    				$scope.noUserRecordsFoundMsg ='<div class="col-sm-2 col-sm-offset-5 alert alert-dismissable alert-danger">No Users Found !</div>';
    			}
    		});
    	}
    }
    
    $scope.reSend = function (data) {    	
    	
    	/*
    	 *this function same as in user.js
    	 *only passing parameter is change...here we pass all data..
    	 *in user.js, we pass only practicename 
    	 */
    			
        debugger;
        
        $scope.isLoad = true;               
        var resendData=data;
        resendData.resendPracticename=data.practice.name;
        resendinvitesUsers.save(resendData).$promise.then(function (response, err) {
            debugger;
            alert('Your invitation has been succesfully sent!');
            $scope.isLoad = false;
        });
    }
    
    $scope.changePwd = function (userdata) {
        
    	/*
    	  *this function same as in user.js
    	 *only parameter is pass here
    	 *in user.js, we not pass any parameter
    	 *parameter replace   to $scope.updateuser
    	 */
    	
        var template = 'partials/changepassword.html';
        $scope.modalInstance = $modal.open({
            templateUrl: template,
            controller: 'resetPasswordCtrl',
            resolve: {
                userdata: function () {
                    return userdata;
                }
            }
        });
        $scope.modalInstance.result.then(function (resp) {         

        }, function (resp) {
            $scope.isLoad = true;
            
            if (resp == "ok") {
                resetpassword.save(userdata).$promise.then(function (response) {
                    debugger;
                    $scope.popupMessage('Password has been reset successfully and mail has been sent!', 400);
                    $scope.isLoad = false;
                })
            } else {
                $scope.isLoad = false;
            }
        });
    }

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
    
    $scope.updateUser= function (username,practicename){    	
    	var userdata={};
    	userdata.username=username;
    	userdata.practicename=practicename;
    	
    	updateUserFromPracticeProfile.set('');
    	updateUserFromPracticeProfile.set(userdata);
    	$location.path('/userprofile');    	
    }

}).controller('ModalInstanceCtrll', function ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
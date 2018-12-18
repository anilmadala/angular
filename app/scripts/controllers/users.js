'use strict';
angular.module('ratefastApp').controller('UsersCtrl', function ($scope, $http, $rootScope, $routeParams, $filter, $modal, invitesUsers, resendinvitesUsers, Auth, UpdateUserStatus, SpecialitiesList, GetInviteuserStatusLevel, Updateinviteuser, UsersUnique, QuestionsList, UsersList, updateUser, UpdateSignature, Practices, $cookieStore, resetpassword, $location, changeUserPasswordShareID, $sce, shareUserProfileData, updateUserFromPracticeProfile) {
    /* Author : Shridhar : dated: 6 April 2016
	 * value for $rootScope.userProfileNavigation set in navbar.html & navbar.js
	 * to set menus
	 */

	// Set the default value of inputType
	$scope.inputType = 'password';

	$scope.hideShowPassword = function(){
			if ($scope.inputType == 'password')
			  $scope.inputType = 'text';
			else
			  $scope.inputType = 'password';
   };


	if(!$rootScope.userProfileNavigation){
		$rootScope.userProfileNavigation=$location.path().split("/")[1]||"allusers";
	}
	$scope.userProfileNavigation=$rootScope.userProfileNavigation;

	//this userProfileData variable when user redirect from changepassword page to user
	var userProfileData='';
	userProfileData=shareUserProfileData.get();

	//this variable is used when user comes from practice profile-->user tab
	var getUserDetailsfromPracticeprofile=updateUserFromPracticeProfile.get();
	var getUsernamefromPracticeprofile=getUserDetailsfromPracticeprofile.username;
	var getPracticenamefromPracticeprofile=getUserDetailsfromPracticeprofile.practicename;

	//get details back  from change password
	var userdetailsfromChangePWD=changeUserPasswordShareID.get();

	if(userdetailsfromChangePWD.hasOwnProperty("practicename")){
		getPracticenamefromPracticeprofile=userdetailsfromChangePWD.practicename;
	}

	//To disable signup button if more than 4 Professional degree selected
    $scope.isDisabledOnProfession = false;

	$scope.isInviteusermodal = true;
    var userid = $routeParams.userid;
    var practicename = $routeParams.practicename;
    $scope.currentPage = 1;
    $scope.search = "";
    $scope.catId = "";
    $scope.users = {};
    $scope.listViewEnabled = false;
    $scope.user = {};
    $scope.itemsperpage = 24;
    $scope.maxsize = 5;
    $scope.itemsperpage = 24;
    $scope.updateuser = new Object();
    $scope.recordcount = false;
	$scope.defaultPracticename='All Accounts';

	$scope.trim=function(data){
    	return document.trim(data);
    }

	$scope.getPracticesList = function () {

		if($scope.currentuserrole=='siteadmin'){
        $http.get('/api/getreportactivity/getpractices')
          .success(function (data, status, headers, config) {
              debugger;
			var allpractices = {"_id": "1", "practicename": "All Accounts"}

			var newdata=[];
			newdata.push(allpractices);

			var items = data[0].data;

			//sorting use to make practicename sorted in dropdown n 1st name should be all accounts
	           items.sort(function (a, b) {
	        	   var aName=a.practicename.toLowerCase();
	        	   var bName=b.practicename.toLowerCase();

			             if (aName > bName) {
			               return 1;
			             }
			             if (aName < bName) {
			               return -1;
			             }
			             // a must be equal to b
			             return 0;
	           });

			for(var i=0; i<items.length;i++){
					newdata.push(items[i]);
				}

			$scope.practiceList = newdata;

			//following $scope.formd.practicename --> use to default practicename in dropdown
			$scope.selectpracticename = $scope.practiceList[0];
          });
        }
    }


    if ($rootScope.currentUser) {
        $scope.currentuserlevel = $rootScope.currentUser;
        $scope.currentuserrole = $rootScope.currentUser.role;
        //$scope.currentuserlevel = $rootScope.currentUser.role.split(' ')[1];
        $scope.currentuserrolename = $rootScope.currentUser.rolename;
		    $scope.loginuserusername = $rootScope.currentUser.username;
    }

    $scope.updateuser.profession = [];
    $scope.updateuser.speciality = [
        { 'name': '', 'boardcertified': '' }
    ];
    $scope.isInvitestatus = true;

    $scope.ViewEnum = {
        Card: 0,
        List: 1
    };

    $scope.changeView = function (view) {
        switch (view) {
            case $scope.ViewEnum.Card:
                $scope.listViewEnabled = false;
                break;
            case $scope.ViewEnum.List:
                $scope.listViewEnabled = true;
                break;
        }
    };
    $scope.getValidatorRegex = function () {
        debugger;
        return /^[a-zA-Z][a-zA-Z0-9.,$;]+$/;
    }

    $scope.searchUsers = function () {

        $scope.currentPage = '1';
        $scope.userProfileList($scope.currentPage);
    };

	$scope.searchUsersByPracticename = function (pracname) {
    	if(pracname.practicename!='All Accounts'){
    		$scope.defaultPracticename=pracname.practicename;
    	}else{
    		$scope.defaultPracticename='All Accounts';
    	}

        $scope.currentPage = '1';
        $scope.userProfileList($scope.currentPage);
    };

    //GT:PSHA 29th June 2015
    $scope.setConfirmPassword = function () {

        if ($scope.step1form.password.$error.required) {
            return true;
        }
        if ($scope.step1form.password.$error.pattern) {
            return true;
        }
        if ($scope.step1form.password.$error.minlength) {
            return true;
        }
        return false;
    }

    $scope.userProfileList = function (pagenumber) {
        debugger;
        if (pagenumber == null)
            pagenumber = 1;
        var query = {
            pagenum: pagenumber,
            pageController: 'page',
			usernameFromPracticeProfile:getUsernamefromPracticeprofile
        };
        $scope.currentPage = pagenumber;

        if ($scope.search != "") {
            query.searchId = $scope.search;
            query.searchController = 'search';
        }

		if($scope.defaultPracticename!='All Accounts'){
        	query.searchPracticename = $scope.defaultPracticename;
    	}

		 UsersList.save(query, function (usersList) {
		debugger;
		if(usersList.totalitem>0){
			$scope.userYes = true;
			$scope.noRecordsFoundMsg ='';

			$scope.roleName = $scope.currentUser.role.split(' ')[0];
			$scope.roleLevel = $scope.currentUser.role.split(' ')[1];
			$scope.usersList = usersList.usersList;
			$scope.totalItems = usersList.totalitem;
			$scope.noOfPages = usersList.pages;

			if($scope.userProfileNavigation=='myprofile' || $scope.userProfileNavigation=='inviteuser'){
				$scope.updateUser(usersList.loginCurrentUserdata[0]);
			}
			else if(userProfileData!=''){
				/*
				 * when user redirect from changeUserPassword page, then if userProfileData not empty, directly show update screen
				 */
				debugger
				$scope.updateUser(userProfileData);
				//shareUserProfileData.set('');
			}else if(typeof getUsernamefromPracticeprofile !='undefined'){
				if(getUsernamefromPracticeprofile !=""){
					updateUserFromPracticeProfile.set('');
					$scope.updateUser(usersList.usersList[0]);
				}
			}
			shareUserProfileData.set('');
		}
		else{
			$scope.userYes = false;
			$scope.noRecordsFoundMsg ='<div class="col-sm-4 col-sm-offset-4" style="font-weight: bold; color: #b61f1f"><span style="font-size: 24px;">No records found!</span></br><span style="font-size: 16px;">Try searching for the first name, last name,</br>full username, or complete email address.</span></div>';
		}
		});
    };

	$scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };

    $scope.updateUser = function (user) {
        debugger;
		//if click on loggin user card view then set that data
        if($scope.loginuserusername==user.username){
        		userProfileData=user;
        }
		$scope.section = 3;
        $scope.updateuser = user;
        if ($scope.updateuser.speciality.length > 0) {
            $scope.boardcertified = 1;
        } else {
            $scope.boardcertified = 0;
        }

        $scope.currentPractice = $rootScope.currentUser.practicename;
        $scope.loggedinUserrole = $rootScope.currentUser.role;
        $scope.currentPracticeData = $filter('filter')(user.practice, { 'name': $scope.currentPractice });
        $scope.currentUserrole = $scope.currentPracticeData.length > 0 ? $scope.currentPracticeData[0].role : '';

        if ($scope.loggedinUserrole == $scope.currentUserrole && $scope.currentUserrole != 'siteadmin') {
            debugger;
            $scope.isDisabled = true;
        }
        else {
            debugger;
            $scope.isDisabled = false;
        }
        debugger;
        if ($scope.updateuser.profession) {
            for (var i = 0; i < $scope.updateuser.profession.length; i++) {
                if ($scope.updateuser.profession[i] == 'other') {
                    $scope.checkother = true;
                }
            }
        }
        $scope.filterPractice = {};
        $scope.statusPracticeuser = false;
        $scope.currentUser = Auth.currentLoggedinUser();
        var role = $scope.currentUser.role;
        var level = $scope.currentUser.level;
        if (role != 'siteadmin' && role != 'superadmin' && level != 'level3' && level != 'level4') {
            $scope.hideme = true;
        }

		//Commented by Unais as it is not required (dated 23rd Feb, 2016)
        //$scope.getLogo(user);

        var updatedPracticeData = $filter('filter')($scope.updateuser.practice, { name: $scope.currentPractice })[0];

        //var status = $filter('filter')(user.practice, { name: $rootScope.currentUser.practicename })[0].status;

		var status = '';

       if(typeof updatedPracticeData != 'undefined'){
            if(updatedPracticeData.length>0){
                status = updatedPracticeData[0].status;
            }
       }

        $scope.isstatusInvites = false;
        //if ($scope.loggedinUserrole != 'siteadmin') {
            if (status == 'invited') {
                $scope.isstatusInvites = true;
            }
        //}

		try
		{

			if ($scope.loggedinUserrole != 'siteadmin') {
				if ($scope.currentUser.username == $scope.updateuser.username || (updatedPracticeData.rolename == $scope.currentUser.rolename && updatedPracticeData.rolename == 'admin')) {

					$scope.usernameMatch = false;
				}
				else {
					$scope.usernameMatch = true;
				}
			}

		}
		catch(err)
		{

		}

        if ($scope.currentUser.role == 'siteadmin' || $scope.currentUser.role == 'superadmin') {
            $scope.statusPracticeuser = true;
            $scope.usernameMatch = false;
        }

        // Display all practice Info only to Site Admin
        if ($scope.loggedinUserrole != 'siteadmin') {
            debugger;
            $scope.practicenameExp = {name : $scope.currentPractice };
        }
        else {
            $scope.practicenameExp = false;
        }

		try
		{

			if ($scope.currentUser.rolename == 'admin' && updatedPracticeData.rolename == 'nonadmin') {
				$scope.usernameMatch = false;
			}

		}
		catch(err)
		{

		}

        $scope.boardcertified = $scope.updateuser.speciality.length > 0;

		//directly show inviteuser when invite user menu click
		 if($scope.userProfileNavigation=='inviteuser'){
			 $scope.open();
		 }

    };

    $scope.isChecked = function (checkvalue) {

        if (checkvalue) {
            if ($scope.updateuser) {
                if ($scope.updateuser.profession) {
                    return $scope.updateuser.profession.indexOf(checkvalue) != -1;
                }
            }
        }

        if (checkvalue == 'other') {
            $scope.othercheck = true;
        }
        else {
            $scope.othercheck = false;
            $scope.updateuser.otherprofession = '';
        }
    }

    $scope.resetStamp = function (practice) {
        debugger;
        //get Stamp approval from practice account
        Practices.getStampapprovalBypracticeName().query({ practiceName: $rootScope.currentUser.practicename }, function (res) {
            debugger;
            $scope.stampapproval = res.stampapproval;
            if ($scope.stampapproval == 'never' || $scope.stampapproval == 'publish') {
                $scope.isStampapproval = true;
                for (var i = 0; i < $scope.updateuser.practice.length; i++) {
                    debugger;
                    if (!$scope.updateuser.practice[i].stampapproval) {
                        $scope.updateuser.practice[i].stampapproval = 'off';
                    }
                }
            } else {
                $scope.isStampapproval = false;
            }
        });
        var a = $cookieStore.get('stampapproval');
        if (practice.rolename == $scope.roleName) {
            $scope.isStampapproval = false;
        } else {
            if ($scope.roleName != 'nonadmin') {
                if ($scope.roleName == 'superadmin' || $scope.roleName == 'siteadmin' || $scope.roleName == 'superadmin') {
                    $scope.isStampapproval = false;
                }
            }
        }
    }


    $scope.checkLevel = function (practice) {

        if (practice.rolename == 'admin' || practice.rolename == 'nonadmin') {

        }
        else {
            practice.level = "";
        }

    }

    $scope.checkStamp = function (practice) {
        practice.stampapproval = '';
        practice.stamp = '';
        var criteria;

        var data = { practiceName: practice.name };
        Practices.getPracticeByName().query(data, function (res) {
            criteria = res.practices[0].stampapproval;
            if (criteria == 'preference') {
                practice.stamp = 'preference';
            }
        });

    }

    /*$scope.saveEditUser = function () {

        $scope.practicerole = false;
        debugger;
        updateUser.update({ id: $scope.updateuser._id, data: $scope.updateuser }, function (response, err) {

        });

        $scope.updateStatus = true;
        setTimeout(function () { $('.label-success').slideUp(); }, 3000);
    }*/


    $scope.saveEditUser = function () {

        $scope.practicerole = false;
        debugger;
        updateUser.update({ id: $scope.updateuser._id, data: $scope.updateuser }, function (response, err) {
            alert('Updated Succesfully!');
        }, function (response, err) {
            if (typeof response.data != 'undefined') {
                if (typeof response.data.message != 'undefined') {
                    if (response.data.message != '') {
                        alert(response.data.message);
                    }
                }
            }

        });

        $scope.updateStatus = true;
        setTimeout(function () { $('.label-success').slideUp(); }, 3000);
    }

    $scope.addProfession = function (id, operation) {
        debugger;
        if (operation == 'add') {
            $scope.updateuser.profession.push(id);
        } else {
            var i = $scope.updateuser.profession.indexOf(id);
            if (i != -1) {
                $scope.updateuser.profession.splice(i, 1);
            }
            if (id == 'other') {
                $scope.checkother = false;
                $scope.updateuser.otherprofessiontext = '';
            }
        }

		//Added by shridhar : 8 feb 2017 : preofession not be > than 4
        if(typeof $scope.updateuser !='undefined'){
          	if(typeof $scope.updateuser.profession !='undefined'){
          		if ($scope.updateuser.profession.length > 4) {
  				    $scope.isDisabledOnProfession = true;
	              }
	              else {
	                $scope.isDisabledOnProfession = false;
	              }
              }
        }
    }

    $scope.userTest = function () {
        debugger;
        $scope.section = 1;
        $scope.updateStatus = false;

		/*
         *shridhar : 13th Jan 2017
         *if user is redirected from practice-profile --> user tab then
         * clicking on back button should -- redirect the user to practice profile
         */
        if(typeof getPracticenamefromPracticeprofile!='undefined'){
        	if(getPracticenamefromPracticeprofile!=''){
        		$location.path('/practiceprofile');
        	}
        }

    }

    $scope.open = function () {
        $scope.isSuperadmin = Auth.IsSuperAdmin();
        $scope.section = 4;
        $scope.isInviteusermodal = false;
    }


    $scope.checkrole = function (roles) {
        return Auth.IsActiveUserRole(roles);
    };

    $scope.getInviteUserInfo = function () {
        $scope.practice.name = "Practice";
    }


    $scope.useralert = [
        { 'mesg': '' }
    ];
    $scope.alerts1 = [];
    $scope.user = [
        { 'name': '', 'emailId': '', 'role': '', 'level': '', id: 0 }
    ];
    //$scope.user = new Object();
    $scope.alerts = [];

	$scope.reSend = function (resendPracticename) {
        debugger;
        $scope.isLoad = true;
        var resendData=$scope.updateuser;
        resendData.resendPracticename=resendPracticename;
        resendinvitesUsers.save(resendData).$promise.then(function (response, err) {
            debugger;
            //alert('Your invitation has been succesfully sent!');
            $scope.isLoad = false;
			$scope.openPopup(12);
        });
    }

    $scope.changePwd = function () {

        var template = 'partials/changepassword.html';
        $scope.modalInstance = $modal.open({
            templateUrl: template,
            controller: 'resetPasswordCtrl',
            resolve: {
                userdata: function () {
                    return $scope.updateuser;
                }
            }
        });
        $scope.modalInstance.result.then(function (resp) {

        }, function (resp) {
            $scope.isLoad = true;

            if (resp == "ok") {
                resetpassword.save($scope.updateuser).$promise.then(function (response) {
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

    $scope.ok = function (myform) {
       try{
        if (myform.$valid) {
            if ($scope.user.length > 0) {
                $scope.isLoad = true;
                $scope.alerts = [];
                for (var i = 0; i < $scope.user.length; i++) {
                    var index = i;
					debugger;
                    if (!$scope.user[i].isVerifyemail) {
                        $scope.isLoad = false;
                        return false;
                        break;
                    }
                    invitesUsers.save($scope.user[i]).$promise.then(function (response) {
                        debugger;
                        //$scope.alerts[response.id] = ({ type: 'success', msg: 'Invitation sent successfully to ' + $filter("filter")($scope.user, { id: response.id })[0].emailId + '!' });
                        var i = $scope.user.indexOf($filter("filter")($scope.user, { id: response.id })[0]);
                        if (i != -1) {
                            $scope.user.splice(i, 1);
                        }
                        $scope.isLoad = false;
						$scope.openPopup(12);
                    })
                    .catch(function (err) {
                        debugger;
                        //console.log(err);
                        if (err.data.id != null) {
                            $scope.alerts[[err.data.id]] = ({ type: 'danger', msg: err.data.message });
                           //alert(err.data.message);

                           var msg=err.data.message;
                           $rootScope.modalInstance = $modal.open({
                               templateUrl: 'popupmessage.html',
                               controller: '',
                               resolve: {
                                   message: function () {
                                       return msg;
                                   }

                               }
                           });
                        }

                        $scope.isLoad = false;
                    });
                }
              }

                for (var j = 0; j < $scope.user.length; j++) {

                    $scope.user[j].id = j;
                }
            }
        }
        catch( ex){
          console.log(ex);
        }
    };


    $scope.addinvitation = function () {
        $scope.user.push({ 'name': '', 'emailId': '', 'role': '', 'level': '', 'id': $scope.user.length });
        $scope.useralert.push({ 'mesg': '' });
    }

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.removeUser = function (id) {
        var i = $scope.user.indexOf(id);
        if (i != -1) {
            $scope.user.splice(i, 1);
        }
        $scope.useralert.pop();
    }

    $scope.cancel = function () {
        $scope.section = 1;
    }

    $scope.checkUserLevel = function () {
        debugger;
        SpecialitiesList.query(function (specialities) {
            $scope.specialities = specialities;

        });

        //For Security Question list

        $scope.questionsList = function () {
            QuestionsList.query(function (questions) {
                $scope.questions = questions;
            });
        }

        $scope.isSucess = true;
        $scope.isLevel34 = false;
        $scope.isLevel4 = false;
        var userid = $routeParams.userid;
        var practicename = $routeParams.practicename;
        GetInviteuserStatusLevel.query({ uid: userid, pname: practicename }, function (response, err) {

        }).$promise.then(function (response) {

            debugger;
            $scope.practice = response[0];
            $scope.practice.username = '';
            delete $scope.practice.answer;
            if ($scope.practice.practice[0] == null) {
                $scope.isInvitestatus = false;
            }
            var practiceInfo;
            var level;
            for (var i = 0; i < $scope.practice.practice.length; i++) {
                var practice_i = $scope.practice.practice[i];
                if (practice_i != null) {
                    practiceInfo = practice_i;
                    $scope.practice.practicename = practiceInfo.name;
                    level = practiceInfo.role.split(' ')[1];
                    $scope.role = practiceInfo.role;
                    break;
                }
            }

            $scope.level = level;
            if (level == 'level4') {
                $scope.isLevel4 = true;
                $scope.isLevel34 = true;
            }
            if (level == 'level3') {
                $scope.isLevel34 = true;
                $scope.isLevel3 = true;
            }
            if (level == 'level2') {

                $scope.isLevel2 = true;
            }


        })
        .catch(function (err) {
            debugger;
            $scope.isInvitestatus = false;
            if (err) {
                if ($rootScope.currentUser) {
                    if ($rootScope.currentUser.role == 'rater1' || $rootScope.currentUser.role == 'rater2') {
                        $location.path('/submittedreport');
                    } else {
                        $location.path('/admin/dashboard');

                    }
                }
                if (err.data == 'active') {
                    $scope.errorMessage = true;
                } else {
                    $scope.errorMessage = false;
                }
            }
        });
    }

    $scope.registerinviteuser = function (step1form) {
        debugger;
        $scope.submitted = true;

        if (step1form.$valid) {
            $scope.isLoad = true;
            $scope.practice.profession = $scope.updateuser.profession;
            if ($scope.updateuser.speciality[0].name) {
                $scope.practice.speciality = $scope.updateuser.speciality;
            }
            var options = {
                id: $scope.practice._id,
                body: $scope.practice
            };

            Updateinviteuser.update({ id: options.id }, { data: options.body }).$promise.then(function (responce, err) {
                $scope.isLoad = false;
                debugger;
                if (!err) {
                    $scope.isSucess = false;
                }
            });
        }

    }

    $scope.UniqueUsername = function (username) {
        $scope.username = username;
        var query = { username: username }
        if (username) {
            UsersUnique.uniqueusername().get(query, function (result) {
                if (result[0] == 't') {
                    $scope.Uniqueuser = false;
                }
                else {
                    $scope.Uniqueuser = true;
                }
            });
        }
    }

    $scope.checkInviteStatus = function () {
        var userid = $routeParams.userid;
        var practicename = $routeParams.practicename;
        GetInviteuserStatusLevel.query({ uid: userid, pname: practicename }, function (response) {

        }).$promise.then(function (response) {

            $scope.practice = response[0];
            delete $scope.practice.answer;
            if ($scope.practice.practice[0] == null) {
                $scope.isInvitestatus = false;
            }
            var practiceInfo;
            var level;
            for (var i = 0; i < $scope.practice.practice.length; i++) {
                var practice_i = $scope.practice.practice[i];
                if (practice_i != null && practice_i.status == 'invited') {
                    practiceInfo = practice_i;
                    $scope.isAllow = true;

                    var options = {
                        id: userid,
                        body: practicename
                    };

                    UpdateUserStatus.update({ id: options.id }, { data: practicename }).$promise.then(function (responce, err) {
                        if (!err) {
                            $scope.isSucess = false;
                        }
                    });
                }

            }

        })
        .catch(function (err) {
            debugger;
            if (err) {
                if (err.data == 'active') {
                    $scope.errorMessage = true;


                } else {
                    $scope.errorMessage = false;
                }
            }
        });
    };

    //For Speciality
    $scope.specialitiesList = function (id) {
        SpecialitiesList.query(function (specialities) {
            $scope.specialities = specialities;
        });
    }

    $scope.specialitiesList();

    //For add another speciality
    $scope.addSpeciality = function () {

        $scope.updateuser.speciality.push({ 'name': '', 'boardcertified': '' });
    }

    $scope.removespeciality = function (id) {

        var i = $scope.updateuser.speciality.indexOf(id);
        if (i != -1) {
            $scope.updateuser.speciality.splice(i, 1);
        }
    }
    $scope.Isdisabledropdown = function (id) {

        $scope.disableDrop = true;
    }

    $scope.showSpeciality = function (value) {

        if (value) {
        } else {
            $scope.updateuser.speciality = [
                 { 'name': '', 'boardcertified': '' }
            ];
        }
    }

    // Upload Personal Signature
    $scope.getLogo = function (user) {
        debugger;
        var dataImg = {
            personalsignature: user.personalsignature
        }

        var data = {
            id: user.personalsignature
        }
        UpdateSignature.getLogo().query(data, function (res) {
            $scope.signature_img = 'data:image/jpeg;base64,' + res.data;
        });
    };

    $scope.cleanData = function () {
        $scope.signature_img = null;
        document.getElementById('signature').value = '';
        $scope.section = 1;
    }

    $scope.getCurrentStatus = function (practice) {
        return $filter('filter')(practice, { name: $rootScope.currentUser.practicename })[0].status;
    }

	$scope.openPopup = function (type) {
        debugger;
        var template = '';
        debugger;
        if (type == 6 || type==7 || type==8 || type==12) {
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

	$scope.changeUserPassword=function(){
		/*
		 *user profile : - user click on change password button from user profile then save that data in shareUserProfileData
		 * my profile :- no need to save data in shareUserProfileData
		 */

		if($scope.userProfileNavigation!='myprofile'){
			shareUserProfileData.set(userProfileData);
		}

    	//this fuction to change password-- redirect to changeUserPassword.html with ID
    	var changePWDData={};
		changePWDData.practicename=getPracticenamefromPracticeprofile;
		changePWDData.updateUserID=$scope.updateuser._id;

    	changeUserPasswordShareID.set(changePWDData);
    	$location.path('/changepassword');
    }


}).controller("resetPasswordCtrl", function ($scope, userdata, $modalInstance) {
    $scope.userdata = userdata;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
    $scope.ok = function () {
        $modalInstance.dismiss('ok');
    }
})
.controller('signPopupCtrl', function ($scope, $modalInstance, type) {
    $scope.popuptype = type;
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

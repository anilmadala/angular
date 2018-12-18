'use strict';
angular.module('ratefastApp')
    .factory('UsersUnique', function ($resource) {
        return {
            uniqueemail: function () {
                return $resource('api/users/uniqueemail/:email');
            },
            uniqueusername: function () {
                return $resource('/api/users/uniquename/:username');
            }
        }
    });

angular.module('ratefastApp')
  .factory('currentLoggedinUserdata', function ($resource) {
      return $resource('/api/currentuserdata/:userid', {
          userid: '@userid'
      });
  });

  /*
angular.module('ratefastApp').factory('UsersList', ['$resource', function ($resource) {
    return $resource('/api/users/:searchController/:searchId/:pageController/:pagenum', {
        searchId: '@searchId',
        searchController: '@searchController',
        pagenum: '@pagenum',
        pageController: '@pageController'
    });
}]);
*/
angular.module('ratefastApp').factory('UsersList', ['$resource', function ($resource) {
    return $resource('/api/users/search', {},
    { //parameters default
        update: {
            method: 'POST',
            params: {}
        }
    });
}]);

angular.module('ratefastApp').factory('updateUser', ['$resource', function ($resource) {
    return $resource('/api/users/update/:id', {
        id: '@id'
    }, { //parameters default
        update: {
            method: 'PUT',
            params: {}
        }
    });
}]);


angular.module('ratefastApp').factory('GetInviteuserStatusLevel', function ($resource) {
    return $resource('/api/getinviteuserinfo/:uid/:pname');
});


angular.module('ratefastApp')
  .factory('User', function ($resource) {
      return $resource('/api/users/:id', {
          id: '@id'
      }, { //parameters default
          update: {
              method: 'PUT',
              params: {}
          },
          get: {
              method: 'GET',
              params: {
                  id: 'me'
              }
          }
      });
  });

angular.module('ratefastApp')
    .factory('invitesUsers', function ($resource) {
        return $resource('/api/users/inviteusers');
    });

angular.module('ratefastApp')
    .factory('resendinvitesUsers', function ($resource) {
        return $resource('/api/users/resendinviteusers');
    });
angular.module('ratefastApp')
    .factory('resetpassword', function ($resource) {
        return $resource('/api/users/resetpassword');
    });

angular.module('ratefastApp').factory('Updateinviteuser', ['$resource', function ($resource) {
    return $resource('/api/updateinvitedusers/:id', {
        id: '@id'
    }, { //parameters default
        update: {
            method: 'PUT',
            params: {}
        }
    });
}]);


angular.module('ratefastApp').factory('UpdateUserStatus', ['$resource', function ($resource) {
    return $resource('/api/updateinviteuserstatus/:id', {
        id: '@id'
    }, { //parameters default
        update: {
            method: 'PUT',
            params: {}
        }
    });
}]);

angular.module('ratefastApp')
    .factory('UpdateSignature', ['$resource', function ($resource) {
        return {
            updateLogo: function () {
                return $resource('/api/usersUpload',
                    {}, { 'save': { method: 'POST' } });
            },
            getLogo: function () {
                return $resource('/api/usersGetLogo',
                    {}, { 'query': { method: 'GET', params: {}, isArray: false } });
            }
        }
    }]);

angular.module('ratefastApp').factory('currentUserData', ['$resource', function ($resource) {
    return $resource('/api/users/userdata/:username', {
        username: '@username',
    });
}]);


angular.module('ratefastApp').factory('updateUserPassword', ['$resource', function ($resource) {
    return $resource('/api/users/updateuserpassword/:id', {
        id: '@id'
    }, { //parameters default
        update: {
            method: 'POST',
            params: {}
        }
    });
}]);


angular.module('ratefastApp').factory('changeUserPasswordShareID', function() {
	//this service use to pass userid from user-profile to change password
	//set--> set value in user.js controller 
	//get--> get value in changeUserpasswordCtrl
	 var savedData = '';
	 function set(data) {
	   savedData = data;
	 }
	 function get() {
	  return savedData;
	 }

	 return {
	  set: set,
	  get: get
	 }
});

angular.module('ratefastApp').factory('shareUserProfileData',function(){
	var userVal='';
	function set(data){
		userVal=data;
	}
	function get(){
		return userVal;
	}
	
	return{
		set:set,
		get:get
	}
});

angular.module('ratefastApp').factory('updateUserFromPracticeProfile',function(){
	var username={};
	function set(data){
		username=data;		
	}
	function get(){
		return username;
	}
	
	return{
		set:set,
		get:get
	}
});

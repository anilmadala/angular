
angular.module('ratefastApp')
    .factory('Session', function($resource) {
 return {
        Sessionlogin: function(){
            return $resource('/api/session/');
        },
        checkcredentails: function(){
            return $resource('/api/session/checkcredentails');
        },
        ForgotUsername: function(){
            return $resource('/api/session/forgotusername');
        }, 
        ForgotPassword: function(){
            return $resource('/api/session/forgotpassword');
        }, 
        VerifyAnswer: function(){
            return $resource('/api/session/verifyanswer');
        },
        GetAccountStatus: function(){
            return $resource('/api/practices/activation/:activateid');
        },
        ChangePassword:function(){
          return $resource('/api/changepassword/:id');  
        }


    }   
});
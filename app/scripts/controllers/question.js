angular.module('ratefastApp').controller('QuestionsCtrl', function ($scope, $routeParams, $location, QuestionsList) {

	//For getting list of questions
    $scope.questionsList = function() {
        QuestionsList.query(function(questions) {
            $scope.questions = questions;
        });
    }
	
	//For displaying security answer input box
	$scope.securityAns = function(answer){
		
		$scope.question = true;
	}
	
	$scope.showSection = function(section){        
		
    }
});
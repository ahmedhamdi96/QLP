angular.module('userControllers', ['userServices'])


.controller('regCtrl', function($http, $location,$timeout, User){

	var app = this;

	this.regUser = function(regData){
		app.loading = true;
		app.successMsg = false;
		app.errorMsg = false;

		User.create(app.regData).then(function(data){
			app.loading = false;
			if(data.data.success){
				app.successMsg = data.data.message+' Redirecting to homepage...';
				$timeout(function(){
					$location.path('/');
				}, 1500)
			}
			else{
				app.errorMsg = data.data.message;
			}
		});
	}
})
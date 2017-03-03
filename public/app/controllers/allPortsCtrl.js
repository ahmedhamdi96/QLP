angular.module('allPortsController', [])


.controller('allPortsCtrl', function(User, $scope){

	var app = this;

	app.loading = true;
	app.noUsers = true;
	app.errorMsg = false;
	app.users = [];

	User.getPorts().then(function(data){
		if(data.data.success){
			app.users = data.data.users;
			app.loading = false;
			app.noUsers = false;
			if(data.data.users==null || data.data.users.length==0){
				app.errorMsg = 'No Portfolios are available!';
			}
		}
		else{
			app.errorMsg = data.data.message;
			app.loading = false;
		}

	});

	$scope.pageSize = 10;
	$scope.currentPage = 1;






})



.controller('viewPortCtrl', function(User, $routeParams){

	var app = this;

	app.errorMsg = false;

	User.getPortUser($routeParams.id).then(function(data){
		if(data.data.success){
			app.links = data.data.user.links;
			app.works = data.data.user.works;
			app.description = data.data.user.description;
			app.profilePicture = data.data.user.profilePicture;
			app.name = data.data.user.firstName+' '+data.data.user.lastName;
			app.screenshots = data.data.user.screenshots;
			app.reps = data.data.user.reps;
		}
		else{
			app.errorMsg = data.data.message;
		}

	});

})



.filter('startFrom', function(){
	return function(data, start){
		if(data!=null){
			return data.slice(start);
		}
		else{
			 console.log("data is null");
		}
		
	}
});
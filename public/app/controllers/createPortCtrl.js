angular.module('createPortController', ['userServices'])


.controller('createPortCtrl', function(User, $timeout, $location){
	var app = this;

	//app.loading = true;
	app.noUser = true;
	app.errorMsg = false;
	app.successMsg = false;


	app.makePort = function(portData){
		//console.log(this.portData);
		var condition = app.portData==null || app.portData.firstName == null || app.portData.firstName == '' ||
						app.portData.lastName == null || app.portData.lastName == '' ||
						app.portData.description == null || app.portData.description == '' ||
						app.portData.link == null || app.portData.link == '';
		if(condition){
			app.errorMsg = "The fields {First Name, Last Name, Description, Link} are required!";
			app.loading = false;
		}
		else{
			User.createPortf(app.portData).then(function(data){
			if(data.data.success){
				app.loading = false;
				app.noUser = false;
				app.errorMsg = false;
				app.successMsg = true;
				app.successMsg = data.data.message+' Redirecting to your portfolio...';
				$timeout(function(){
					location.reload();
					$location.path('/port');
				}, 1500)
			}
		else{
			app.errorMsg = data.data.message;
			app.loading = false;
		}
		});
		}
	};


	// User.createPort().then(function(data){
	// 	console.log(data);
	// });
});

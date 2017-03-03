var app = angular.module('mainController', ['authServices', 'fileModelDirective', 'uploadFileService'])


.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, uploadFile, $scope,User){
	var app = this;

	app.loadme = false;

	//at every route(view) change
	$rootScope.$on('$routeChangeStart', function(){
		//logging in sontroller
		if(Auth.isLoggedIn()){
			app.isLoggedIn = true;
			Auth.getUser().then(function(data){
				app.username = data.data.username;
				app.useremail = data.data.email;
				app.loadme = true;
			});

			User.getIsEmptyStatus().then(function(data){
				if(data.data!=null){
					if(data.data.isEmpty==false){
						app.authorized = true;
					}
					else{
						app.authorized = false;
					}

				}
				else{
					console.log('error, mainCtrl:31');
				}
			});
		}
		else{
			app.isLoggedIn = false;
			app.username = '';
		}

	});


	this.doLogin = function(loginData){
		app.loading = true;
		app.successMsg = false;
		app.errorMsg = false;

		//login form
		Auth.login(app.loginData).then(function(data){
			app.loading = false;
			if(data.data.success){
				app.successMsg = data.data.message+' Redirecting to your profile...';
				$timeout(function(){
					location.reload();
					$location.path('/profile');
					//app.loginData='';
					//app.successMsg = '';
				}, 1500)
			}
			else{
				app.errorMsg = data.data.message;
			}
		});
	};

	this.logout = function(){
		Auth.logout();
		$location.path('/logout');
		// $timeout(function(){
		// 	$location.path('/');
		// }, 1500);
	};



	$scope.file = {};
	$scope.Submit  =function(){
		$scope.uploading = true;
		uploadFile.upload($scope.file).then(function(data){
			if(data.data.success){
				$scope.uploading = false;
				$scope.alert = 'alert alert-success';
				$scope.message = data.data.message;
				$scope.file = {};
			}
			else{
				$scope.uploading = false;
				$scope.alert = 'alert alert-danger';
				$scope.message = data.data.message;
				$scope.file = {};
			}
		});
	};

    $scope.photoChanged = function(files) {
        if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
            $scope.uploading = true;
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
                $timeout(function() {
                    $scope.thumbnail = {};
                    $scope.thumbnail.dataUrl = e.target.result;
                    $scope.uploading = false;
                    $scope.message = false;
                });
            };
        } else {
            $scope.thumbnail = {};
            $scope.message = false;
        }
    };
});


//to prevent logged in user from going to register or login pages
app.run(['$rootScope', 'Auth','$location', function($rootScope, Auth, $location){

	$rootScope.$on('$routeChangeStart', function(event, next, current){
		if (next.$$route !== undefined) {
			if(next.$$route.authenticated == true){	
				if(!Auth.isLoggedIn()){
					event.preventDefault();
					$location.path('/');
				}
			}else if(next.$$route.authenticated == false){
				if(Auth.isLoggedIn()){
					event.preventDefault();
					$location.path('/profile');
				}
			}
		}
	});

}]);

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);


	

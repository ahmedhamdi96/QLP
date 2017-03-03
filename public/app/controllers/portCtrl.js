angular.module('portController', ['fileModelDirective', 'uploadFileService'])


.controller('portCtrl', function(User, $timeout,$location, uploadFile, $scope, $sce){

	var app = this;

	app.loading = true;
	app.noLinks = true;
	app.errorMsg = false;
	app.successMsg = false;

	User.getLinks().then(function(data){
		if(data.data.success){
			app.links = data.data.links;
			app.linksNames = data.data.linksNames;
			app.description = data.data.description;
			app.profilePicture = data.data.profilePicture;
			app.name = data.data.name;
			app.screenshots = data.data.screenshots;
			app.reps = data.data.reps;
			app.loading = false;
			app.noLinks = false;
		}
		else{
			app.errorMsg = data.data.message;
			app.loading = false;
		}

	});



	app.newLink = function(portData){
		if(app.portData==null || app.portData.link==""){
			app.errorMsg = "The link field is required";
			app.loading = false;
		}
		else{
				User.addLink(app.portData).then(function(data){
				if(data.data.success){
					app.loading = false;
					app.noLinks = false;
					app.successMsg = data.data.message;
					app.errorMsg = false;
					$timeout(function(){
						location.reload();
						app.successMsg = false;
					}, 1500)
				}
				else{
					app.errorMsg = data.data.message;
					app.loading = false;
				}

			});
		}

	};


	app.newRep = function(portData){
		if(app.portData==null || app.portData.rep==""){
			app.messageRep = "Write Code!";
		}
		else{
				User.addRep(app.portData).then(function(data){
				if(data.data.success){
					app.messageRep = data.data.message;
					$timeout(function(){
						location.reload();
						app.messageRep = false;
					}, 1500)
				}
				else{
					app.messageRep = data.data.message;
				}

			});
		}

	};

	$scope.file = {};
    $scope.message = false;
    $scope.alert = '';
    $scope.default = 'https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg';

    app.profilePicture =  'uploads/images/1488297192855_lana.jpg';


	$scope.Submit  =function(){
		$scope.uploading = true;
		uploadFile.upload($scope.file).then(function(data){
			if(data.data.success){
				$scope.uploading = false;
				$scope.alert = 'alert alert-success';
				$scope.message = data.data.message;
				$scope.file = {};
				app.object = {path: 'uploads/images/'+data.data.name};
				User.setPP(app.object).then(function(data){
				if(data.data.success){
					app.loading = false;
					app.noLinks = false;
					app.successMsg = data.data.message;
					app.profilePicture =  data.data.profilePicture;
					app.errorMsg = false;
					$timeout(function(){
						//location.reload();
						app.successMsg = false;
					}, 1500)
				}
				else{
					app.errorMsg = data.data.message;
					app.loading = false;
				}

			});

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
                    app.pf = e.target.result;
                    $scope.uploading = false;
                    $scope.message = false;
                });
            };
        } else {
            $scope.thumbnail = {};
            $scope.message = false;
        }
    };


    $scope.SubmitScreenshot  =function(){
		$scope.uploadingScreenshot = true;
		uploadFile.upload($scope.file).then(function(data){
			if(data.data.success){
				$scope.uploadingScreenshot = false;
				$scope.alertScreenshot = 'alert alert-success';
				$scope.messageScreenshot = data.data.message;
				$scope.fileScreenshot = {};
				app.objectScreenshot = {screenshot: 'uploads/images/'+data.data.name};
				User.addScreenshot(app.objectScreenshot).then(function(data){
				if(data.data.success){
					app.loadingScreenshot = false;
					$timeout(function(){
						location.reload();
					}, 1500)
				}
				else{
					$scope.uploadingScreenshot = false;
					$scope.alertScreenshot = 'alert alert-danger';
					$scope.messageScreenshot = data.data.message;
					$scope.fileScreenshot = {};$scope.messageScreenshot = data.data.message;
				}

			});

			}
			else{
				$scope.uploadingScreenshot = false;
				$scope.alertScreenshot = 'alert alert-danger';
				$scope.messageScreenshot = data.data.message;
				$scope.fileScreenshot = {};
			}
		});
	};

});
//this is where the angular stuff goes
angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'portController', 'allPortsController', 'createPortController', 'ui.bootstrap'])

//intercept all http requests with the 
.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});
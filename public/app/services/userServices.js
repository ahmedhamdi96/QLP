angular.module('userServices', [])


.factory('User', function($http){
	userFactory = {};


	//User.create(regData)
	userFactory.create = function(regData)	{
		return $http.post('/api/users', regData)
	}


	userFactory.getLinks = function()	{
		return $http.get('/api/links');
	};


	userFactory.getIsEmptyStatus = function()	{
		return $http.get('/api/isEmptyStatus');
	};


	userFactory.getPorts = function()	{
		return $http.get('/api/getPorts');
	};

	userFactory.getDescription = function()	{
		return $http.get('/api/getDescription');
	};


	userFactory.getLinksNames = function()	{
		return $http.get('/api/getLinksNames');
	};

	userFactory.createPort = function()	{
		return $http.get('/api/createPort');
	};


	userFactory.createPortf = function(portData)	{
		return $http.put('/api/createPortf', portData);
	};

	userFactory.addLink = function(portData)	{
		return $http.put('/api/addLink', portData);
	};

	userFactory.addRep = function(portData)	{
		return $http.put('/api/addRep', portData);
	};

	userFactory.setPP = function(portData)	{
		return $http.put('/api/setPP', portData);
	};


	userFactory.addScreenshot = function(portData)	{
		return $http.put('/api/addScreenshot', portData);
	};


	userFactory.allData = function(username)	{
		return $http.get('/api/allData',username);
	};

	userFactory.getPortUser = function(id)	{
		return $http.get('api/viewPort/'+id);
	};


	return userFactory;
})
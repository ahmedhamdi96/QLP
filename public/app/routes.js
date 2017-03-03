//this is where routing to all the website pages is done
var app = angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider){

    $routeProvider

    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })  //this is the default page

    .when('/about', {
        templateUrl: 'app/views/pages/about.html'
    })

    .when('/register', {
        templateUrl: 'app/views/pages/users/register.html', 
        controller: 'regCtrl',
        controllerAs: 'register',
        authenticated: false
    })

    .when('/login', {
        templateUrl: 'app/views/pages/users/login.html', 
        authenticated: false
    })

    .when('/logout', {
        templateUrl: 'app/views/pages/users/logout.html', 
        authenticated: true
    })

    .when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html', 
        authenticated: true
    })


    .when('/port', {
        templateUrl: 'app/views/pages/port/port.html', 
        controller: 'portCtrl',
        controllerAs: 'port',
        authenticated: true,
        isEmpty: false
    })


    .when('/allPorts', {
        templateUrl: 'app/views/pages/port/allPorts.html', 
        controller: 'allPortsCtrl',
        controllerAs: 'allPorts',
    })


    .when('/createPort', {
        templateUrl: 'app/views/pages/port/createPort.html', 
        controller: 'createPortCtrl',
        controllerAs: 'createPort',
        authenticated: true,
        isEmpty: true
    })


    .when('/viewPort/:id', {
        templateUrl: 'app/views/pages/port/viewPort.html', 
        controller: 'viewPortCtrl',
        controllerAs: 'viewPort',
    })


    //.otherwise({redirectTo: '/'});


    $locationProvider.html5Mode({
        enabled: true,
        requiredBase: false
    });

});

// Run a check on each route to see if user is logged in or not (depending on if it is specified in the individual route)
app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {

    // Check each time route changes    
    $rootScope.$on('$routeChangeStart', function(event, next, current) {

        // Only perform if user visited a route listed above
        if (next.$$route !== undefined) {
            // Check if authentication is required on route
            if (next.$$route.authenticated === true) {
                // Check if authentication is required, then if links are not empty
                if (!Auth.isLoggedIn()) {
                    event.preventDefault(); // If not logged in, prevent accessing route
                    $location.path('/'); // Redirect to home instead
                } else {
                    // Function: Get current user's links
                    User.getIsEmptyStatus().then(function(data) {
                        // Check if user's links are empty
                        if (next.$$route.templateUrl=='app/views/pages/port/port.html' && next.$$route.isEmpty != data.data.isEmpty){
                                                                                         //false
                               event.preventDefault(); // If links are empty, prevent accessing route
                               $location.path('/'); // Redirect to home instead
                        }

                        if (next.$$route.templateUrl=='app/views/pages/port/createPort.html' && next.$$route.isEmpty != data.data.isEmpty){
                                                                                                //true
                               event.preventDefault(); // If links are not empty, prevent accessing route
                               $location.path('/'); // Redirect to home instead
                        }
                        
                    });
                }
            } else if (next.$$route.authenticated === false) {
                // If authentication is not required, make sure is not logged in
                if (Auth.isLoggedIn()) {
                    event.preventDefault(); // If user is logged in, prevent accessing route
                    $location.path('/profile'); // Redirect to profile instead
                }
            }
        }
    });
}]);


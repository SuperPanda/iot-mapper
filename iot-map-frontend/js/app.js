var app = angular.module('ng-iot',['ng-iot.services','ng-iot.directives','ngRoute', 'ngMap','ngWebSocket'])
.config(function($routeProvider) {
  $routeProvider
  .when('/login', {
    controller: 'MainCtrl',
    templateUrl: 'templates/main.html',
  })
  .when('/map',{
		controller: 'MainCtrl',
		templateUrl: 'templates/map.html'
  })
  .otherwise({
    redirectTo: '/login'
  });
});
window.onLoadCallback = function() {
  // When the document is ready
  angular.element(document).ready(function() {
    // Bootstrap the oauth2 library
    gapi.client.load('oauth2', 'v2', function() {
      // Finally, bootstrap our angular app
      angular.bootstrap(document, ['ng-iot']);
    });
  });
}
app.factory('mockData',function(){
  return {
   getDevices: function getDevices(x,y,r){
     return [{deviceId: 123, lat: 1, lng: 2},
           {deviceId: 345, lat: 4, lng: 3}];
    }
 };
});

app.run( function($rootScope, $location, UserService) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ( !UserService.currentUser() && $location.path != "/login" ) {
		     // already going to #login, no redirect needed
		  if ( next.templateUrl != "template/main.html" ) { $location.path("/login"); }
	  } else if ($location.path == "/login" && UserService.currentUser()){
		  $location.path("/map");
	  }       
    });
});

// See https://github.com/AngularClass/angular-websocket README
app.factory('DeviceData', function($websocket){
  // Open connection
  
  var dataStream = $websocket('wss://2gywh0ugfg8ey.iot.us-east-1.amazonaws.com/mqtt');
  var collection = [];
  dataStream.onMessage(function(message){
    collection.push(JSON.parse(message.data));
  });
  var methods = {
    collection: collection,
    get: function(){
      dataStream.send(JSON.stringify({ action: 'get' }));
    }
  };
  return methods;
});
// See angularjs-google-maps for example of a good test suite
app.controller("MainCtrl",["$scope","$location","$rootScope","DeviceData","UserService",function ($scope,$location,$rootScope, DeviceData,UserService){
	
	console.log(UserService.currentUser());
    $scope.signedIn = function(oauth) {
		UserService.setCurrentUser(oauth).then(function(user) {
		$scope.user = user;
		$location.path("/map");
		});
    }
    //   $scope.iotData = iotData;
	 
}]);
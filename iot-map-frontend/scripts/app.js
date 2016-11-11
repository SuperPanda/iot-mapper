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
})
.config(function(AWSServiceProvider) {
  AWSServiceProvider.setArn('arn:aws:iam::899859277926:role/google-web-role');
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
   getDevices: function getDevices(){
     return [{deviceId: 123, lat: 1, lng: 2},
           {deviceId: 345, lat: 4, lng: 3}];
    }
 };
});

app.run( function($rootScope, $location, UserService) {
	// THIS REALLY NEEDS UNIT TESTS
    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ( !UserService.currentUser() && $location.path() != "/login" ) {
		     // already going to #login, no redirect needed
		  if ( next.templateUrl != "template/main.html" ) { $location.path("/login"); }
	  } else if ($location.path() == "/login" && UserService.currentUser()){
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
app.controller("MainCtrl",["$scope","$location","$rootScope","mockData","UserService","$interval",function ($scope,$location,$rootScope, DeviceData,UserService,$interval){
	var stop;	
    $scope.currentDeviceIds = [];
	$scope.selectedNode = null;
	$scope.selectedNodeId = -1;
    $scope.deviceAttrs = [];
    $scope.viewRadius = 10; // arbitrary
    $scope.position = {lat: 5, lng: 5}; //blah
    $scope.numOfDevices = 0; 	
	console.log(UserService.currentUser());
	if ($location.path == "/login" && UserService.currentUser()){ $location.path("/map"); }
    $scope.signedIn = function(oauth) {
		UserService.setCurrentUser(oauth).then(function(user) {
			$scope.user = user;
			$location.path("/map");
		});
    }
	// add path unit tests]
	console.log($location.path());
	if ($location.path() == "/map"){ 
	
		var devices = DeviceData.getDevices();
        for (i = 0; i < devices.length; i++){
          // Add if not exist
          if (!(devices[i].deviceId in $scope.currentDeviceIds)){
            $scope.currentDeviceIds.push(devices[i].deviceId);
            $scope.deviceAttrs.push(devices[i]);           
          }
		}
		$scope.selectedNode = $scope.deviceAttrs[0];
		$scope.selectedNodeId = $scope.currentDeviceIds[0];
	}
	
	$scope.toggleMove = function(){
		if (angular.isDefined(stop)){
			$interval.cancel(stop);
			stop = undefined;
		} else  {
			stop = $interval(randomMove,500,100);
		}
	};
				
    var randomMove = function(){		
        var move = function(pos){ return pos + (Math.random()*2.0-1.0); };
        for (i = 0; i < devices.length; i++){
           var d = $scope.deviceAttrs[i];
           $scope.deviceAttrs[i] = {deviceId: d.deviceId, lat: move(d.lat), lng: move(d.lng)};
		   $scope.selectedNode = $scope.deviceAttrs[0];
        }
     };
}]);
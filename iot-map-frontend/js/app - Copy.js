var app = angular.module('ng-iot',['ng-iot.directives','ngRoute', 'ngMap','ngWebSocket'])


var GOOGLE_API_KEY = "AIzaSyBeUahQKqgnvFoRhM3PVnZ_gp-2C7fFQm0";
var CLIENT_ID="679783015761-140qrdlv52natr5k0i2isn8mglnedb3v.apps.googleusercontent.com";
var CLIENT_SECRET="UgqR_i8Ws-gc_r6cikzvHJng";
.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    controller: 'MainCtrl',
    templateUrl: 'templates/main.html',
  })
  .otherwise({
    redirectTo: '/'
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
app.factory('DeviceData',function(){
  return {
   getDevices: function getDevices(x,y,r){
     return [{deviceId: 123, lat: 1, lng: 2},
           {deviceId: 345, lat: 4, lng: 3}];
    }
 };
});

// See https://github.com/AngularClass/angular-websocket README
app.factory('iotData', function($websocket){
  // Open connection
  var dataStream = $websocket('wss://2gywh0ugfg8ey.iot.us-east-1.amazonaws.com');
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
}

// See angularjs-google-maps for example of a good test suite
app.controller("TestCtrl",["$scope","DeviceData","iotData",function ($scope,DeviceData,iotData){
        $scope.iotData = iotData;
        $scope.currentDeviceIds = [];
        $scope.deviceAttrs = [];
        $scope.viewRadius = 10; // arbitrary
        $scope.position = {lat: 5, lng: 5}; //blah
        $scope.numOfDevices = 0; 
	      $scope.testValue = 123;
        //var parseDevices = function(data){
          //$scope.numOfDevices = data.length;
        //}
        //DeviceData.getDevices(1,2,3).success(parseDevices); 

        var devices = DeviceData.getDevices(1,2,3);
        for (i = 0; i < devices.length; i++){
          // Add if not exist
          if (!(devices[i].deviceId in $scope.currentDeviceIds)){
            $scope.currentDeviceIds.push(devices[i].deviceId);
            $scope.deviceAttrs.push(devices[i]);           
          }
        }
    
        var randomMove = function(){
      	  var move = function(pos){ return pos + (Math.random()*2.0-1.0); };
          for (i = 0; i < devices.length; i++){
            var d = $scope.deviceAttrs[i];
            $scope.deviceAttrs[i] = {deviceId: d.deviceId, lat: move(d.lat), lng: move(d.lng)};
          }
        };
        // FOR CODE ON CONTROLLING THE ZOOM LEVEL BASED ON BOUNDS
        // REVIEW COMMIT LOG BEFORE 10 NOVEMBER
        // AND LOOK AT IMPLEMENTATING LEAFLET JS INSTEAD
        // AS IT SUPPORTS OTHER COORDINATE SYSTEMS AS WELL
        
}]);

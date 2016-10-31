var app = angular.module('iot-tracker-app',['ngMap']);

app.factory('DeviceData',function(){
  return {
   getDevices: function getDevices(x,y,r){
     return [{deviceId: 123, lat: 1, lng: 2},
           {deviceId: 345, lat: 4, lng: 3}];
    }
 };
});
// See angularjs-google-maps for example of a good test suite
app.controller("TestCtrl",["$scope","DeviceData","$interval",function ($scope,DeviceData,$interval){
        $scope.currentDeviceIds = [];
        $scope.deviceAttrs = [];
        $scope.viewRadius = 10;
        $scope.position = {lat: 5, lng: 5};
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
        //$interval(randomMove,100,10000);
        // Need to add remove
        // Need to add update
        
}]);

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
        // Service to turn on and off events, all sorts of magic
       // $interval(randomMove,500,10000);
        // Need to add remove
        // Need to add update
        

        // This code comes from:
        // http://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds
        /*function getBoundsZoomLevel(bounds, mapDim) {
	    var WORLD_DIM = { height: 256, width: 256 };
	    var ZOOM_MAX = 21;

	    function latRad(lat) {
		var sin = Math.sin(lat * Math.PI / 180);
		var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
		return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
	    }

	    function zoom(mapPx, worldPx, fraction) {
		return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
	    }

	    var ne = bounds.getNorthEast();
	    var sw = bounds.getSouthWest();

	    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

	    var lngDiff = ne.lng() - sw.lng();
	    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

	    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
	    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

	    return Math.min(latZoom, lngZoom, ZOOM_MAX);
	}*/
        
}]);

// Device simulator of a roaming temperature and humidity sensor. 
//
// Setting up AWS IoT SDK configuration on https://www.hackster.io/makers-ns/getting-started-with-aws-iot-and-beaglebone-396371
// Most microcontrollers have a built in MQTT client [1]
//
//
// TODO: Add acknowledge on GitHub
//const tls = require('tls');
//const mqtt = require('mqtt'a);
const fs = require('fs');
const awsIot = require('aws-iot-device-sdk');
const blessed = require('blessed');
const contrib = require('blessed-contrib');

var isConnected = false;
var lastMessage = "no message received"


// get endpoint
var endpoint = fs.readFileSync("./endpoint");
console.log("Endpoint: " + endpoint);

//console.log(typeof endpoint);
//console.log(typeof endpoint.toString());
//console.log(endpoint.toString());

// How to read arguments
// http://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-node-js
//process.argv.forEach(function (val, index, array){
//  console.log(index + ':' + val);
//});

var device = awsIot.device({
  clientId: fs.readFileSync("./clientID").toString(),
  keyPath: "keystore/deviceCert.key",
  certPath: "keystore/deviceCertBundle.crt",
  caPath: "./keystore/root.cert",
  region: 'us-east-1'
});

// TODO add last will message

var message = JSON.parse(fs.readFileSync("./test.mqtt").toString());
console.log("Lat: " + message.Coordinates.Lat);
//console.log("message\n---------");
//console.log(message);
var publish_topic = "topic_2";

device.on('connect', function(){
  //console.log('Connected');
  isConnected = true;
  device.subscribe('topic_1');
  device.publish(publish_topic, JSON.stringify(message));
});

device.on('message', function(topic, payload) {
  console.log('hi');
  console.log('message', topic, payload.toString());
  //device.end();
});

device.on('error', function() {
  isConnected = false;
});




program = blessed();
program.alternateBuffer();
program.enableMouse();
program.hideCursor();
program.bg('black');


var screen = blessed.screen({
  smartCSR: true
});
screen.title = 'Demo IoT Device';

var grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

// Based on https://github.com/chjj/blessed
var styleOpts = {
  fg: 'white',
  bg:'black',
  border: {
    fg: '#ffffff'
  },
  hover: {
      bg: 'white',
      fg: 'black'
  }
}
// y x w? h?
var latitudeBox = grid.set(0,9,1,3, blessed.box,{label:'Latitude', color:'magenta',top:'50%',left:'50%',height:'50%',width:'50%'});
  //top: '0', left: '0', width: '50%', height: '50%',
  //label: 'Latitude', 
  //tags: true,
  //border: { type: 'line' },
  //style: styleOpts
//});

var longitudeBox = grid.set(1,9,1,3,blessed.box,{label:'Longitude',color:'magenta',style:{valign:'middle',align:'center'}});
  //top: '50%', left: '50%', width: '50%', height: '50%',
  //label: 'Longitude', 
  //tags: true,
  //border: { type: 'line' },
  //style: styleOpts
//});
var temperatureBox = grid.set(2,9,1,3,blessed.box,{label:message._Metadata.Temperature.Label});
var humidityBox = grid.set(3,9,3,3,contrib.donut,{label:message._Metadata.Humidity.Label});
//var map = contrib.map({label: 'World Map'});
var mapBox = grid.set(0,0,12,9,contrib.map,{label:'World Map'})


var statusBox = grid.set(6,9,1,3,blessed.box,{label:message._Metadata.Status.Label});
var connectionBox = grid.set(11,9,1,3,blessed.box,{label:'Connection Status'});
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
   return process.exit(0);
});

//screen.append(humidityBox);
//screen.append(latitudeBox);
//screen.append(longitudeBox);
//screen.append(humidityBox);
//screen.append(mapBox);

var centerStart = "";
var centerEnd = "";

var inRange = (x,lo,hi) => Math.min(Math.max(x,lo),hi);
var move = (x,dx) => x + (Math.random()*2*dx)-dx;
var timeout = setInterval(function(){
  
  x = message.Coordinates.Lng; 
  y = message.Coordinates.Lat;
  mode = message.Payload.Status;
  if (mode == "ROAM_ONLY" || mode == "ROAM_AND_SENSE"){
    x = message.Coordinates.Lng = move(x,5);
    y  = message.Coordinates.Lat = move(y,5);
  }

  temp = message.Payload.Temperature;
  humidity = message.Payload.Humidity;

  if (mode == "SENSE_ONLY" || mode == "ROAM_AND_SENSE"){
    mapBox.addMarker({"lon":""+y,"lat":""+x,"color":"yellow"});
    temp = message.Payload.Temperature = inRange(move(temp,0.3),-25,65);
    humidity = message.Payload.Humidity = inRange(move(humidity,0.01),0,1);
    humidityOut = humidity * 100;
    humidityBox.setData([
      {percent: humidityOut, label:'Humidity'
    }]);
    tempMetadata = message._Metadata.Temperature;
    humidityMetadata = message._Metadata.Humidity;
    tempMetadata.Timestamp = tempMetadata.Timestamp + 1;
    humidityMetadata.Timestamp = humidityMetadata.Timestamp + 1;
  }
  
  var nDecimals = 2;
  var gpsDecimals = 6;
  latitudeBox.setContent(x.toFixed(gpsDecimals));
  longitudeBox.setContent(y.toFixed(gpsDecimals));
  temperatureBox.setContent(temp.toFixed(nDecimals));
  statusBox.setContent(message.Payload.Status);
  connectionBox.setContent((isConnected ? "Connected" : "Not Connected"));
  mapBox.addMarker({"lon":""+y,"lat":""+x});
  screen.render();
  mapBox.clearMarkers();
},1000);

timeout = setInterval(function(){
    
  device.publish(publish_topic,JSON.stringify(message.Coordinates));

}, 10000*Math.random());

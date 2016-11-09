/*
 * Authored by: Andrew Briscoe 2016
 *
 * Device simulator that is portable to embedded devices
 * Most microcontrollers have a built in MQTT client or can run NodeJS
 *
 * This simulation includes a preliminary implementation for a fixed-size history buffer.
 * The idea is to have use Cloud Computing to send generated models of machine learning
 * to be executed locally to help with different control tasks.
 *
 * The code is deisgned to be similar in structure to most embedded systems,
 * and in theory should be directly portable to certain microcontrollers and
 * thing computers.
 *
 * In conjunction with the cloud, this device is almost ready to be controlled by artifical intelligent
 * algorithms running in the cloud by performing the following:
 * - Implement the speed field in MQTT
 * - Implement changing of directions
 *
 * This code provides an almost library of utility functions, and follows some design considerations:
 *   - Sensors use the following functions: setSensorValue, GetSensorValue
 *      - For example, for temperature: getTemperature(), setTemperature(temperature)
 *      - The setTemperature function contains all the necessary logic to ensure the reading is accurate
 *      - Using the single responsibility princile it is possible to change the code or schema
 *        with minimal changes required
 *   - Some functions were included to facilitate the way IoT in Cloud Computing Frameworks
 *       communicate the intent to change a value (e.g. instead of instruction a node to go
 *       NE, you send out messages which control the output of an actuator. Thereby, providing
 *       unlimited computing power to the tiny device.
 *   - The MQTT schema we devised includes a way of communicating the different states possible
 *   - We included a schema number so code in the cloud can work with multiple types of formats
 *   - The code uses the aws-iot-device-sdk since it is available for most embedded systems
 *
 * Got started with: https://www.hackster.io/makers-ns/getting-started-with-aws-iot-and-beaglebone-396371
 * But quickly got side tracked
 *
 */

const fs = require('fs');
const awsIot = require('aws-iot-device-sdk');
const blessed = require('blessed');
const contrib = require('blessed-contrib');

enableUI = true;
isConnected = false;


// get endpoint
endpoint = fs.readFileSync("./endpoint");
console.log("Using endpoint: " + endpoint);

// How to read arguments
// http://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-node-js
//Loop: process.argv.forEach((val, index, array) => { whatever... })
//Select: process.argv[whatever]

device = awsIot.device({
  clientId: fs.readFileSync("./clientID").toString(),
  keyPath: "keystore/deviceCert.key",
  certPath: "keystore/deviceCertBundle.crt",
  caPath: "./keystore/root.cert",
  region: 'us-east-1'
});

// TODO add last will message

message = JSON.parse(fs.readFileSync("./test.mqtt").toString());
//console.log("message\n---------");
//console.log(message);

// TOPICS
publish_topic = "topic_2";
request_identity_topic = "whoami";

requestThingName = () => { device.publish(request_identity_topic); }
a

device.on('connect', function(){
  //console.log('Connected');
  isConnected = true;
  device.subscribe('topic_1');
  requestThingName();
  //device.publish(publish_topic, JSON.stringify(message));
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


screen = blessed.screen({
  smartCSR: true
});
screen.title = 'Demo IoT Device';

grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

// y x w? h?
latitudeBox = grid.set(0,9,1,3, blessed.box,{label:'Latitude', color:'magenta',top:'50%',left:'50%',height:'50%',width:'50%'});
longitudeBox = grid.set(1,9,1,3,blessed.box,{label:'Longitude',color:'magenta',style:{valign:'middle',align:'center'}});

temperatureBox = grid.set(2,9,1,3,blessed.box,{label:message._Metadata.Temperature.Label});
humidityBox = grid.set(3,9,3,3,contrib.donut,{label:message._Metadata.Humidity.Label});
statusBox = grid.set(6,9,1,3,blessed.box,{label:message._Metadata.Status.Label});

mapBox = grid.set(0,0,12,9,contrib.map,{label:'World Map'})
logBox = grid.set(7,9,4,3,blessed.log,{label:'Log'})
connectionBox = grid.set(11,9,1,3,blessed.box,{label:'Connection Status'});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
   return process.exit(0);
});

centerStart = "";
centerEnd = "";



/*
 * 
 * A data structure so that historical data points can be plotted or
 * used in history based machine learning. It could be passed through a neural net
 * that was wired by the cloud interacting with thousands of devices interacting with the real world.
 *
 * It iterates from youngest to oldest because the number of elements is not always known
 * so this way the trail can progressively change into a color that is older
 * GREEN LIGHT_GREEN FAINTLY_GREEN WHITE
 * If there are only 3 elements, when indexing the colors it can stop at faintly green
 *
 * Useful for Embedded devices that have limited amount of memory
 *
 * A sliding window for data streams
 * Insertion - Constant
 *
 */

// Can be used for time series data
// then you can do things like moving average
// You could also add id's and map to other data
// Seems like a versatile data structure
//
// TODO: Convert to Prototypes to allow any time of class
//
//
// TODO: use the following guide to create prototypes for this function and all the helper scripts
// http://yehudakatz.com/2011/08/12/understanding-prototypes-in-javascript/
// TODO: implement a custom iterator correctly
// http://stackoverflow.com/questions/19256297/adding-a-custom-iterator-to-a-javascript-class

History = {}

History._elements = []
History._idx = 0;
History._size = 0;
History._max_size = 4;

History.isEmpty = () => {
  return History._size == 0;
}

History.size = () => { History._size };

// Instantiates the function
// Options:
//    max_size - size of the log + 
History.init = (max_size,element_prototype) => {
  History._max_size = max_size;
  for (i = 0; i < max_size; i++){
    History._elements.push(_element_prototype);
  }
}

History.add = (x,y) => {
  History._elements[History._idx] = {_x:x,_y:y};
  History._size = Math.min(History._size+1,History._max_size);
  History._idx = (History.idx+1)%History._max_size;
}


History.it = {}
History.it[Symbol.iterator] = function*(){
  items = []
  remaining = 0  
  for (i = History.size-1; i >= 0; i--){ 
     items.push(History.elements[(History._idx+i)%History._max_size])
     remaining = remaining + 1
   }
   //Now all the elements are from youngest to oldest
   while (remaining > 0){
      yield items.pop()
   }
}

// returns oldest to newest
// Accepts the following options:
//    windowSize: the number of elements to return (default all)
//    shift: the number of values to skip
// Expects (TODO: BUILD TESTS):
//    - windowSize:
//        [0] [1] [2] [3]
//        windowSize + shift < History size + 1
//        shift >= 0
// This would be good to write test cases for
History.get = (options) => {  
  items = []

  _options = options || {
    windowSize: History._size,
    shift: 0
  };

  // Defensive Programming
  condition1 = _options.windowSize + _options.shift < History._size + 1;
  condition2 = _options.shift > 0;
  if (!condition1 || !condition2){
    throw InvalidArguments;
  }

  skipCountDown = _options.shift;
  itemSize = 0;  

  for (let element in History.it()){
    if (skipCountDown != 0){ skipCountDown = skipCountDown - 1; continue; }
    items.push(element);
    itemSize = itemSize + 1;
    if (itemSize == _options.windowSize){ break; }
  }
  items.reverse(); // Put oldest data first
  return items;
}

//
// methods
// fn::init()
// fn::init(max_size) => sets the 
// fn::it() => returns an iterable
// fn::size() => returns number of items recorded
// fn::add(x,y)
// for (let pos in History.it()){}
// fn::get(

//
// Utility functions
// 

// This will make integration with lambda functions easier
// as they almost be copy and pasted.
// Creating the appropriate prototyes,
// this could easily end up as a library for interacting with these devices

// Make sure a value remains within defined bounds
inRange = (x,lo,hi) => Math.min(Math.max(x,lo),hi);
// Adjust value (v) randomly such that v-i < v < v+i
move = (x,dx) => x + (Math.random()*2*dx)-dx;

getTemperature = () => { message.Payload.Temperature }
getHumidity = () => { message.Payload.Humidity }
getStatus = () => { message.Payload.Status }

// These sensors don't have delta functions
getTemperature = (t) => { message.Payload.Temperature = inRange(t,-25,65) }
getHumidity = (h) => { message.Payload.Humidity = inRange(h,0,1)};
getStatus = (s) => { message.Payload.Status }
// TODO: Need to write validation
// Check that the input matches one of the enums for the status field
// under _Metadata in the state file
updateStatus = (s) => { message.Payload.Status = s }

//getSpeed = () => { message.Payload.Speed }
//increaseSpeed 

// Accessors and Modifiers for the device Coordinates
getLng = () => { message.Coordinates.Lng }
getLat = () => { message.Coordinates.Lat }

setLng = (x) => {message.Coordinates.Lng=inRange(x,-180,180)}
setLat = (y) => {message.Coordinates.Lat=inRange(y,-85,85)}

// Make a change in delta (correct measuring inaccuracies remotely, hey?)
setDeltaLng = (dx) => {setLng(getLng()+dx);}
setDeltaLat => (dy) => {setLat(getLat()+dy);}

setCoordinates => (x,y) => {setLng(x); setLat(y);}

// Maths <3

pow = Math.pow
sqrt = Math.sqrt
e = (n) => { pow(10,n); }
magnitude = (dx,dy) => {sqrt(pow(dx,2)+pow(dy,2))}

/**
 * These are the routines used to sense
 * or actuate. These can easily be switched spending
 * on the mode. Perhaps it is possible to write a language
 * in JSON, that could program the device.
 **/

// This chooses a direction randomly
// and tries to make the device move ~1% across the circumference of the earth each second
movementRoutine = () => {
  
  // Old values
  x0 = getLng(); 
  y0 = getLat();

  // Add old location marker
  // This will be refactored out when the history
  // data structure is ready
  mapBox.addMarker({"lon":""+y,"lat":""+x,"color":"yellow"});

  // TO IMPLEMENT:
  // Turning. If it receives instructions to turn a certain amount,
  // it makes the turn and continues in a straight path. The calculations
  // to the destination can be done in the cloud.

  // Randomly move from current position
  // Used to pick a direction
  x1 = move(x,5);
  y1 = move(y,5);
  
  // Create a movement vector
  dx = x1-x0;
  dy = y1-y0;
   
  // Normalized directions
  nx = dx/magnitude(dx,dy)
  ny = dy/magnitude(dx,dy)

  // Make this controllable later  
 
  // http://boulter.com/gps/distance/?from=1.0000+1.0000&to=1.0000+2.0000&units=k
  // a delta of 1 in latitude coordinates is approximately 111km
  // http://boulter.com/gps/distance/?from=1.0000+1.0000&to=2.0000+1.0000&units=k 
  // a delta of 1 in longitude coordinates is approximately 110km
  // These are approximate and vary slightly depending on location on earth
 
  // lets make the nodes move every second
  // so we need the magnitude of the above comments
  //
  duration=1 // the time you want to cover the distance in
  magnitude_of_gps_delta = magnitude(111*e(3),110*e(3)); // the distance you want to cover

  // the number of meters that need to be travelled to match magnitude of gps delta is divided by s
  speed = magnitude_of_gps_delta / duration // m/s

  // Normalize
  
  setDeltaLng(nx*speed);
  setDeltaLat(ny*speed);
  
};

sensorRoutine = () => { 

    temperature = getTemperature();
    humidity = getHumidity();

    // Updates map marker on this device
    setTemperature(move(temperature,0.3));
    setHumidity(move(humidity,0.01));

    tempMetadata = message._Metadata.Temperature;
    humidityMetadata = message._Metadata.Humidity;
    tempMetadata.Timestamp = tempMetadata.Timestamp + 1;
    humidityMetadata.Timestamp = humidityMetadata.Timestamp + 1;

}
humidityBox.setData([
      {percent: humidityOut, label:'Humidity'
    }]);

// Update UI Routine
updateUI = () => {

  nDecimals = 2;
  gpsDecimals = 6;

  x = getLng()
  y = getLat()

  // Update UI
  latitudeBox.setContent(x.toFixed(gpsDecimals));
  longitudeBox.setContent(y.toFixed(gpsDecimals));

  humidityBox.setData([
      {percent: getHumidity()*100, label:'Humidity'
  }]);

  temperatureBox.setContent(getTemperature().toFixed(nDecimals));
  statusBox.setContent(getStatus());
  connectionBox.setContent((isConnected ? "Connected" : "Not Connected"));
  
  // Add new location marker
  mapBox.addMarker({"lon":""+y,"lat":""+x});
  screen.render();
  mapBox.clearMarkers();

}

// MAIN LOOP
timeout = setInterval(function(){

  mode = message.Payload.Status;

  // Only run if set to roam
  if (mode == "ROAM_ONLY" || mode == "ROAM_AND_SENSE"){
    movementRoutine();
  }


  // Only run if sensing
  if (mode == "SENSE_ONLY" || mode == "ROAM_AND_SENSE"){
    sensorRoutine();
  }
  
},1000);

timeout = setInterval(function(){
    
  device.publish(publish_topic,JSON.stringify(message.Coordinates));

}, 10000*Math.random());

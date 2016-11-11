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
 *       communicate the intent to change a value (e.g. instead of instruction a ode to go
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
var moment = require('moment');
enableUI = (process.argv.indexOf("gui") > -1 ? true : false );
verbose = (process.argv.indexOf("debug") > -1 ? true : false );

isConnected = false;

CLIENT_ID = fs.readFileSync("./clientID").toString().trim();
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
//
//
//

var error = (msg) => {
  log("Encountered an error: " + msg);
  deviceData.setMode("IDLE");;
  // This needs a accessor
 //  deviceData._message_Metadata._Enum
}

var log = console.log;
var debug = (msg) => {
  if (verbose){
    log(msg);
  }
};
// Important initial state
var init_message = JSON.parse(fs.readFileSync("./test.mqtt").toString());
log("imported message\n---------");
log(init_message);

// TOPICS
publish_topic = "devices/send/broadcast";
request_identity_topic = "whoami";
listen_topic = "devices/receive/broadcast";
requestThingName = () => { device.publish(request_identity_topic); }

device.on('connect', function(){
  log('Connected');
  isConnected = true;
  device.subscribe(listen_topic);
  requestThingName();
  //device.publish(publish_topic, JSON.stringify(message));
});

device.on('message', function(topic, payload) {
  //console.log('hi');
  msg = JSON.parse(payload);
  debug("recv " + topic + ": " + payload.toString());
  if (msg.position){
    log(msg.clientId + " @ " + msg.position.Lng +"," + msg.position.Lat);
 }
 if (msg.message){
    log(msg.clientId + " " + msg.message);
 }
  //console.log('message', topic, payload.toString());
  //device.end();
});

device.on('error', function() {
  isConnected = false;
});

/***************************************/
/*                                     */
/*  The User Interface works on        */
/*  embedded devices, you just have to */
/*  connect a display device,          */
/*  or connect via SSL or putty        */
/*  and it will decorate the terminal  */
/*                                     */
/* *************************************/


if (enableUI){
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

  temperatureBox = grid.set(2,9,1,3,blessed.box,{label:init_message._Metadata.Temperature.Label});
  humidityBox = grid.set(3,9,3,3,contrib.donut,{label:init_message._Metadata.Humidity.Label});
  statusBox = grid.set(6,9,1,3,blessed.box,{label:init_message._Metadata.Status.Label});

  mapBox = grid.set(0,0,12,9,contrib.map,{label:'World Map'})
  logBox = grid.set(7,9,4,3,blessed.log,{label:'Log'})
  connectionBox = grid.set(11,9,1,3,blessed.box,{label:'Connection Status'});
  log = (msg) => {logBox.log(msg);};
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
     return process.exit(0);
  });
}


/***************************************/
/*                                     */
/*   Proposed ADT that can be used on  */
/*  embedded devices so that if the    */
/*  device triggers a cloud service    */
/* it can send back recent recording   */
/*                                     */
/* *************************************/


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
// The program supports UI in terminal, or console only and soon browsers
//
// TODO: Convert to Prototypes to allow any time of class
//
// TODO: use the following guide to create prototypes for this function and all the helper scripts
// http://yehudakatz.com/2011/08/12/understanding-prototypes-in-javascript/
// TODO: implement a custom iterator correctly
// http://stackoverflow.com/questions/19256297/adding-a-custom-iterator-to-a-javascript-class

// Used to keep track up the last N records, with the ability to extract X number of elements from any index, provided it does
// not go out of range.
// Add a record, and if the buffer is full, the newest object will overwrite the oldest element
function SlidingEventStoreBuffer(bufferSize){
  
  /**
   *
   * CyclicConstantSpaceWindowSlidingLimitedHistoricData ADT
   * 
   * Setup to handle MQTT messages that don't arrive in order, used to program device remotely... 
   * This ADT is based on the previous index is the prior data point, and the cursor is sitting where it will write next
   * I know this is not cloud computing, but I miss data structures. Having built this data structure, it can be copied over to lambda.
   * Could design algorithms using this ADT to manage priority of message,
   * The cyclic rule needs to replace on the IDX being valid at all times
   * increase size. 
   *
   * Indexes start at zero
   *
   * GROW: WIP
   *
   * If size > 1: actually event with 1
   * Set cursor at first element
   *
   * Whilst cursor != idx
   * [3] [4] [1] [2] 
   *  x       *   
   *  |----------------
   *                  |
   * ___ [4] [1] [2] [3] ___  ___  ___
   *      x   *
   *      |----------------
   *                      |
   * __  __  [1] [2] [3] [4] ___  ___  idx: currIdx (2) + size (4) = 6
   *                          *       Now test the functions all work add, iterate 
   *
   *  Increase time expected O(n/2), worst(n), best(c)
   *
   * SHRINK: WIP
   * best strategy would be to add to the list in reverse and move the point to the start.. just replace everything by
   * running through once
   * [4] [5] [6] [7] ___  [1] [2] [3] ==> using iterable [ 1, 2, 3, 4, 5, 6, 7 ]
   *                  *   
   *  once got array
   *  _idx <- 0, _size <- 0, _max_size = 3
   *
   *  1    2    3
   *  4    5    6
   *  7    *
   * ___  ___  ___                  
   *  7    5    6
   *       *
   *
   *
   * DELETE (idx)
   * - delete at idx=4
   * - how to get position number... if D_idx > curr_idx; then position = (max_size + curr_idx) - D_idx;
   *
   *                  D
   * [7] [8] [3] [4] [5] [6] 
   *          *           
   *                               (curr_idx = 2)
   *                  D     |
   * [7] [8] [3] [4] [5] [6]|[7] [8] [3] (position_idx in sequence 6+2-5=3)
   *                  ^     |     ^
   *                  3   2   1   0    
   * 
   *                                                 (for all older elements, shift to be closer
   *
   *  D
   * [7] [8] [3] [4] [5] [6]
   *          *
   *       
   *          D
   * [7] [8] [3] [4] [5] [6] - easy, just reduce by 1 and go backwards
   *          *
   *       
   */
  this._max_size = bufferSize;
  debug("Instantiating a new Location Buffer");
  this._elements = [];
  for (i = 0; i < bufferSize; i++){
    this._elements.push({"x":0,"y":0});
  }
  this._idx = 0;
  this._size = 0;
  this._max_size = bufferSize;

  this.isEmpty = function(){ return this._size == 0; };
  this.size = function(){ return this._size; };

  // Here is assumes that ._idx is correct
  this.add = function(_x,_y){
    var obj = { "x":_x,"y":_y }
    //debug("Adding " + obj.toString() + " to history")
    //debug("Adding " + obj.x + "," + obj.y +" to history")
    this._elements[this._idx] = obj;
    this._size = Math.min(this._size+1,this._max_size);
    this._idx = (this._idx+1)%this._max_size;
  };

  /*
   * What we know that whatever precede the cursor idx, was the last thing to be added
   * if the idx = 0, and buffer size > 0 (which I don't thing is possible) 
   *
   * So it was
   *
   * [2] [3] [1]
   * ___ ___ ___
   *          *
   *
   * ___ ___ [1] [2] [3]
   *  *       
   *                    
   * Start at i=(idx+max_size-1)%max_size === idx previous items.
   * As long as the there are enough elements
   * (0+5-1) = 4, idx of [3] -- (1)
   * (0+5-2) = 3, idx of [2] -- (2)               
   * (0+5-3) = 2, idx of [1] -- (3), the number of elements
   *
   */

   /** REATTEMPT ITERABLE LATER **/

  // returns oldest to newest
  // Accepts the following options:
  //    windowSize: the number of elements to return (default all)
  //    shift: the number of values to skip,
  //    reversed: false by default
  // Expects (TODO: BUILD TESTS):
  //    - windowSize:
  //        [0] [1] [2] [3]
  //        windowSize + shift < History size + 1
  //        shift >= 0
  // This would be good to write test cases for (test the the reverse works and etc)
  this.get = function(windowSize,shift=0,reverse=false){  
    items = []
    var _nice = 0
    if (windowSize == null){
        getSize = (x) => { 
          x - shift;
        }
        windowSize = getSize(this._size);
     }

     //getValue = (x) => { x }
     for (i = this._size; i > 0; i = i - 1){ 
        //items.push(getValue(this._elements[(this._idx+i-1)%this._max_size]));
        items.push(this._elements[(this._idx+i-1)%this._max_size]);
     }
     // NEWEST--->OLDEST
     // Converting to oldest to newest...
     items.reverse();
     return items.splice(shift,windowSize+shift);
     
 } 
}   
    
    // BUG: This will fail if you provide partial options,
    // requires to be added to a test suite, and fixed
    // with a merge tool
    // Need tp write 
    // Defensive Programming
    //condition1 = (windowSize + shift) =< this.size()
    //condition2 = (shift <= 0)
    //if (!condition1 || !condition2){
    /*  debug(JSON.stringify({"v1":windowSize,"v2":shift,"v3":reverse}))
      debug("Condition 1: " + condition1)
     debug("Condition 2: " + condition2)
      error("Error in get code")
     // //throw InvalidArguments;
      return []
    }*/
  //
  // methods
  // fn::it() => returns an iterable
  // fn::size() => returns number of items recorded
  // fn::add(x,y) => adds 2 values
  // for (let pos in History.it()){}
  // fn::get(options)  ~ good for running avearges
  //   "windowSize": number of elements to return
  //   "shift": how many elements to skip (always the oldest first),
  //     you can skip the new ones by using a smaller window size
  //

var gpsMeasurements=new SlidingEventStoreBuffer(4);


// Utility functions - If there is a way to require them, and have them available from the global scope it would be handy.
// This is code for an embedded device not a web application; give me some freedom with less verbosity, and some good
// quick selection of commands that do what I need

// This will make integration with lambda functions easier
// as they almost be copy and pasted.
// Creating the appropriate prototyes,
// this could easily end up as a library for interacting with these devices


// Maths <3

var pow = Math.pow;
var sqrt = Math.sqrt;
var e = function(n){ return pow(10,n); }
var magnitude = function(dx,dy){
  return sqrt(pow(dx,2)+pow(dy,2));
}


// Make sure a value remains within defined bounds
var inRange = (x,lo,hi) => Math.min(Math.max(x,lo),hi);
// Adjust value (v) randomly such that v-i < v < v+i
var move = (x,dx) => x + (Math.random()*2*dx)-dx;


/**
 * This function encapsulates all the data associated with the state of the device,
 * the place where the IoT shadow is cast from...
 *
 * TODO: Import a linear algebra package
 *
 */
function DeviceData(message){

  // These needed to be invoke by event notifications from the set handlers
  this._updateMetadata = function(valueUpdated){
    if (!this._message._Metadata[valueUpdated]){
      debug("Metadata cannot be found for " + valueUpdated);
      return false;
    }
    this._message._Metadata[valueUpdated].timestamp = moment().valueOf();
    debug("[" + this._message._Metadata[valueUpdated].timestamp + "] " + valueUpdated + " has been updated");
  }

  // TODO: Turn each sensor into an object
  
  // TODO: GENERATE THE FUNCTIONS BASED ON THE PROVIDED SCHEMA
  this._message = message;
  this.getTemperature = function(){return this._message.Payload.Temperature; }
  this.getHumidity = function() {return this._message.Payload.Humidity }
  this.getStatus = function() {return this._message.Payload.Status }
  
  // These sensors don't have delta functions
  this.setTemperature = function(t){
    this._message.Payload.Temperature = inRange(t,-25,65);
    this._updateMetadata("Temperature");
  }
  this.setHumidity =function (h) {
    this._message.Payload.Humidity = inRange(h,0,1)
    this._updateMetadata("Humidity");
  };


  // TODO: Need to write validation
  // Check that the input matches one of the enums for the status field
  // under _Metadata in the state file
  this.setMode = function(s){
    this._message.Payload.Status = s;
    this._updateMetadata("Status");    
  }
  
  //getSpeed = () => { message.Payload.Speed }
  //increaseSpeed 

  // Accessors and Modifiers for the device Coordinates
  this.getLng = function() { return this._message.Coordinates.Lng; }
  this.getLat = function() {return this._message.Coordinates.Lat; }

  this.setLng = function(x) {this._message.Coordinates.Lng=inRange(x,-180,180); }
  this.setLat = function(y) {this._message.Coordinates.Lat=inRange(y,-85,85);}

  // Make a change in delta (correct measuring inaccuracies remotely, hey?)
  this.setDeltaLng = function(dx) {this.setLng(this.getLng()+dx);}
  this.setDeltaLat = function(dy) {this.setLat(this.getLat()+dy);}

  this.setCoordinates = function(x,y){this.setLng(x); this.setLat(y);}

}

var deviceData = new DeviceData(init_message);

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
  let x0 = deviceData.getLng(); 
  let y0 = deviceData.getLat();
  //logBox.log(message.Coordinates);

  // Add old location marker
  // This will be refactored out when the history
  // data structure is ready
  //if (enableUI) {mapBox.addMarker({"lon":""+y0,"lat":""+x0,"color":"black"}); }

  // TO IMPLEMENT:
  // Turning. If it receives instructions to turn a certain amount,
  // it makes the turn and continues in a straight path. The calculations
  // on how much to turn to reach the destination can be done in the cloud.

  // Randomly move from current position
  // Used to pick a direction
  let x1 = move(x0,1);
  let y1 = move(y0,1);
  
  // Create a movement vector
  let dx = x1-x0;
  let dy = y1-y0;
   
  // Normalized directions
  let m = magnitude(dx,dy);
  let nx = dx/magnitude(dx,dy)
  let ny = dy/magnitude(dx,dy)

  let speed = 3
  
  deviceData.setDeltaLng(nx*speed);
  deviceData.setDeltaLat(ny*speed);
}

sensorRoutine = () => { 
    
    temperature = deviceData.getTemperature();
    humidity = deviceData.getHumidity();
    x = deviceData.getLng();
    y = deviceData.getLat();
    gpsMeasurements.add(x,y);
    // Updates map marker on this device
    deviceData.setTemperature(move(temperature,0.3));
    deviceData.setHumidity(move(humidity,0.01));

}

// Update UI Routine
updateUI = () => {

  nDecimals = 2;
  gpsDecimals = 6;

  x = deviceData.getLng() || 0;
  y = deviceData.getLat() || 0;
  // Update UI
  latitudeBox.setContent(parseFloat(x).toFixed(gpsDecimals));
  longitudeBox.setContent(parseFloat(y).toFixed(gpsDecimals));

  humidityBox.setData([
      {percent: deviceData.getHumidity()*100, label:'Humidity'
  }]);

  temperatureBox.setContent((deviceData.getTemperature()||0).toFixed(nDecimals));
  statusBox.setContent(deviceData.getStatus());
  connectionBox.setContent((isConnected ? "Connected" : "Not Connected"));

  isEmpty = gpsMeasurements.isEmpty();

  mapBox.clearMarkers();
  if (!isEmpty){
    //debug(gpsMeasurements);
    positions = gpsMeasurements.get(gpsMeasurements.size(),0,false);
    debug(positions);

    positions.forEach(function(pos){
    //for (pos in positions){
      //console.log("X: " + x + ", Y: " + y);
      //console.log("X: " + pos.x + ", Y: " + pos.y);
      mapBox.addMarker({"lon":pos.x,"lat":pos.y,"color":"red","marker":"X"});
      //mapBox.addMarker({"lon":""+x,"lat":""+y,"color":"red","marker":"x"});
    });
    //debug(JSON.stringify(positions));
    //debug("X: " + pos[0]._x + ", Y: "+pos[0]._y);
  }
  
  // Add new location marker
  screen.render();
}

// MAIN LOOP
timeout = setInterval(function(){
  
  mode = deviceData.getStatus();
  // Only run if set to roam
  if (mode == "ROAM_ONLY" || mode == "ROAM_AND_SENSE"){
    movementRoutine();
  }


  // Only run if sensing
  if (mode == "SENSE_ONLY" || mode == "ROAM_AND_SENSE"){
    sensorRoutine();
  }

  if (enableUI){
    updateUI();
  }
  
},1000);


// Depends to device data
//function Scheduler(){
//
//}

// Send status to AWS loop
timeout = setInterval(function(){
  debug("Sent Msg");
  // Use the cyclic structure for message order
  msg = ["is welcoming","is angry","is confused"];
  device.publish(publish_topic,JSON.stringify({"clientId":CLIENT_ID,"message":msg[Math.floor((Math.random()*3)+1)],"position":deviceData._message.Coordinates}));

}, 10000*Math.random());

// Based on https://www.hackster.io/makers-ns/getting-started-with-aws-iot-and-beaglebone-396371
// Most microcontrollers have a built in MQTT client [1]
// TODO: Add acknowledge on GitHub
//const tls = require('tls');
//const mqtt = require('mqtt'a);
const fs = require('fs');
const awsIot = require('aws-iot-device-sdk');
/*
 * Get endpoint
 *
 */

var endpoint = fs.readFileSync("./endpoint");
console.log("Endpoint: " + endpoint);

//console.log(typeof endpoint);
//console.log(typeof endpoint.toString());
//console.log(endpoint.toString());

// How to read arguments
// http://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-node-js
process.argv.forEach(function (val, index, array){
  console.log(index + ':' + val);
});

// https://www.npmjs.com/package/mqtt#api
/*var connectOptions = {
  clientId: fs.readFileSync("./clientID"),
  clean: false,
  reconnectPeriod: 2000,
  connectTimeout: 2000,
  key: fs.readFileSync("./keystore/deviceCert.key"),
  cert: fs.readFileSync("./keystore/deviceCertBundle.crt"),
  ca: fs.readFileSync("./keystore/root.cert"),
  keepalive: 10,
  rejectUnauthorized: false
};*/

//var tlsConnectionOptions = tls.connect(connectOptions);
//const client = mqtt.connect("mqtts://"+endpoint.toString(),tlsConnectionOptions);

var device = awsIot.device({
  clientId: fs.readFileSync("./clientID"),
  keyPath: "keystore/deviceCert.key",
  certPath: "keystore/deviceCertBundle.crt",
  caPath: "./keystore/root.cert",
  region: 'us-east-1'
});



var message = fs.readFileSync("./test.mqtt");
console.log("message\n---------");
console.log(message.toString());

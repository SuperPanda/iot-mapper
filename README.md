See the wiki for details: https://github.com/SuperPanda/iot-mapper/wiki
This page should include: how to deploy and links to the wiki for tasks such as build on the code (required tools, how to write tests, how to modify assets)

- 


Layout:
Main Page - description of project, use cases (e.g. JITR registration using x509 and TLSv1.2 + MQTT), acknowledgements, overview of steps and pretty picture, link to wiki
Wiki
- Tutorials
- Detailed explanation
- Detailed + alternative installation guide
- How to contribute
- Side bar links to individual READMEs through the project


```
INSERT SYSTEM DIAGRAM
```
See the wiki for details: https://github.com/SuperPanda/iot-mapper/wiki
This page should include: how to deploy and links to the wiki for tasks such as build on the code (required tools, how to write tests, how to modify assets)


# FUNCTIONAL AND NON-FUNCTIONAL REQUIREMENTS
# Design
## Goal
Build a framework to aid in experiments involving IoT devices.
### Framework for IoT maps that interact with devices
### Simple deployment
...
### Ready to deploy code 
We have built a device that runs on linux and is ready to be copied onto a device and run.
It provides a User interface, follows design principles that make it easy to develop systems involving the web; from generating data structures to take advantage of the limited capacity of the system; such Cyclic rolling lists to support moving averages, with design notes on implementation and performance of different operations...
 to providing a schema to use for MQTT protocols that maintain capability information and metadata (such as the last timestamp
the design decouples sensing, actuation, communication, and UX in a way that allows the ability to switch out features. 

### Extendable
By providing utility scripts, documenting the design and providing links to material so others can learn how to modify relevant sections, will allow the IoT map framework to be extended by others to use other services. 
The CloudFormation template can be uploaded to AWS CloudFormation designer, and a GUI can be used to modify the framework and connect it to other services or even stacks. This allows the possibility of using the stack for machine learning and analytic tasks, controlling IoT devices as a swarm or visualisations of experiments involve positions. Further work would convert all the tasks to be managed by a nodeJS application; to provide better cross system support.
## Functional Requirements
### Just in time registration
The goal is to be able to automatically register a device when it presents a certificate that was signed by a trusted authority. This allows for devices to be provisioned offline, and will automatically register the device when it first attempts to connect. 
### Persistent registration
One of the benefits of using certificates in enrolment is that redeploying a stack, or creating a new stack, all the devices will be able to be registered (they can be de-registered, and policies and roles......
### IoT tracking
### Device and Data Agnostic IoT telemetry
It should not matter what data is being stored, so the telemetry messages need to embed the metadata. The devices can be real or simulated, as long as it is linked to a device certificate.
## Non-Functional Requirements
### Cost
### Flexible Use Case
## Other usages
Some alternative uses include using as an interface replaying IoT sensor data
...
Both geograpical and non-geographical tracking (Rectangle with arbitrary dimensions)
http://leafletjs.com/examples/crs-simple/crs-simple.html
http://angular-ui.github.io/ui-leaflet/examples/0000-viewer.html#/layers/wms-with-different-projection-example
Could even implement device controllers in the map overlay
Could control SCADA system with GUI
Supports heatmaps
## Simple to deploy
- non-functional
- explain why CloudFormation is good for this
- devices can be setup in bulk offline
- Using own CA certificate to generate device certificate
-- This allows for Just-in-time registration and bootstrapping
-- The device can talk to the IoT platform because trust has already been established
-- When devices connect for the first time, they are given an identity (for IoT shadow) and policies on what actions are permissible are attached
-- Extensible - scripts and helpers have been developed to aid in the AWS development process, to automatic packaging of scripts, device simulation tools (create and remove devices) to aid in bootstrap development - lots of tools.
## Proof of implementation
We have created a nodeJS device, which simulates sensor data and movement; with the ability to switch between ```ROAM_AND_SENSE```, ```ROAM_ONLY```, ```SENSE_ONLY```, ```IDLE``` (hopefully) from the map page. We used the aws-iot-sdk nodejs library, as it can be used on smaller devices, like beagle bone or Raspberri PIs, so the code can easily be port by copying and pasting the folder. The map in the following simulation screenshot has a red X near the ivory coast, marking the position it is currently at. This is used to cross reference with the IoT tracking map.
![Screenshot of device simulator](https://github.com/SuperPanda/iot-mapper/blob/master/diagrams/device-simulator.png?raw=true)
## Payload Schema Design
We generate a schema that embeds metadata in the JSON, so a wide range of data can be server the IoT platform. An example of the meta data schema that allows us to store operating states which can be used to generate UI controls:
```
{
  "Coordinates": {
    "Lat": 1.0,
    "Lng": 2.0
   },
  "Payload": {
    "Status": "ROAM_AND_SENSE",
    "Temperature": 31,
    "Humidity": 0.56
  },
  "_Metadata": {
    "Status": {
      "Label": "Status of the device",
      "Description": "The state of the device",
      "DataType": "Enum",
      "Timestamp": 100
    },
    "Temperature": {
      "Label": "Temperature in Celsius (C)",
      "Description": "The internal operating temperature",
      "DataType": "Decimal",
      "Timestamp": 110
    },
    "Humidity": {
      "Label": "Humidity (%)",
      "Description": "The level of humidity",
      "DataType": "Decimal",
      "Timestamp": 123
    },
    "_Enum": {
      "Status": [
        "ROAM_ONLY", "SENSE_ONLY", "ROAM_AND_SENSE", "IDLE"
      ]
    }
  }
}
```
## Extensionable / Modular
- Made possible in CloudFormation
## Low Cost
## Ability to track location of devices, ability to access the last available data point, record of data changes over time, ability for Just-in-time registration / zero-conf setup (Functional)
# CloudFormation Schematics 
## As of version 4... (continuous integration with version control not yet implemented)
![](https://github.com/SuperPanda/iot-mapper/blob/master/diagrams/cloudformation-diagram-v4.png?raw=true)
# Use Cases
- Tracking Items
- Analytics/Simulation

# Guides
## Installation
Need AWS account
Need to create an IAM user with the appropriate role, just select administrator role.
Now install AWS CLI
Following the AWS CLI installation guied, use your IAM user's Access Id and Secret Access Code when configure AWS CLI; ensure to set us-east-1 as the region.
Now we need to upload the lambda functions to an S3 bucket. Scripts have been provided that create the zip files for each lambda function and uploads to S3. Provided scripts list your buckets and allow you to select, or if a argument is passed to the script, it will change the bucket. The scripts for Lambda function maintainence use the last bucket by default. See the Lambda Function README for more information.
Upload CloudFormation template in AWS management console and set the Lambda functions bucket parameter to the one that was set earlier.
Now generate the CA certificate as per the CA certificate README, and upload the CA certificate (by clicking on CA certificate, not certificate in the IoT dashboard).
Now the front end needs to be uploaded. At the moment you need a Google Maps API key, so run the ```insert-google-api-key.sh <GOOGLE_MAPS_API_KEY>``` Alternatively, just edit the index.html file and replace the place holder between pointed brackets in the URL for the maps javascript file.
If you want to run the device simulator, generate the keys in the certificate generator (device provisioner is used instead when creating other devices).
To provision devices, use the generate device offline script. This will create a folder with the provided name of the device, containing a keystore folder with all the certificates and keys needed to connect to the AWS IoT.
## READMEs
- [CloudFormation README](http://) - Broken link, create file... Add instructions on how to upload, dependencies, how to access edit and how to deal with problems of resources needing different names (and how utility scripts have been provided throughout the project the reduce complications)
- [The CA certificate generator README](https://github.com/SuperPanda/iot-mapper/blob/master/certificate-generator/CA-generation/README.md) - Used to generate the certificate that will sign all others
- [Device certificate generator README](https://github.com/SuperPanda/iot-mapper/blob/master/certificate-generator/device-certificate-generation/README.md) - The guide to generating the device certificates, though it might be easier to use the device provisioner instead.
- [Device provisioner README](https://github.com/SuperPanda/iot-mapper/tree/master/device-provisioner/README.md)
- [Lambda functions README](https://github.com/SuperPanda/iot-mapper/tree/master/lambda-functions/README.md)
- [Map Front-end README](https://github.com/SuperPanda/iot-mapper/blob/master/iot-map-frontend/README.md)


# How to deploy
The project consists of several elements:
- Deployment of IoT infrastructure using CloudFormation that supports automatic bootstrapping of policies, roles and actions when devices connect for the first time (achieved primarily through the use of AWS IoT rule engine, Lambda functions and generated policies). 
- In the lambda functions folder, run the install-lambda-to-bucket.sh script either with an argument to create automatically, or to follow the prompts. Your answers will be saved in mybucketname folder in the directory. Then run upload-to-s3.sh script, which will zip all the folders in the appropriate format for lambda functions and upload to the s3 bucket.
- Upload the infrastructure.template file under cloudformation-stack-template, setting the lambda bucket directory in the parameters. If building the webapp.
- Generation of CA certificate which will need to be uploaded to the AWS IoT platform, with auto-registration enabled. A script has been provided:
“certificate-generator /CA-generation/generate-CA.sh”.
This will generate the root CA certificate that will be used to provision device certificates; this needs to be uploaded.
- The web component has been made available online, as the implementation of the Google+ API for identity registeration (Identity as a Service) and then configuration the trust relationship with Amazon and then exposing their separate services in a combined trust relationship is difficult to implement. The Google OAuth authentication is used to demonstrate to AWS a user is authenticated; and a client side AngularJS application, merges the separate service, as a single underlying interface. As this is still a WIP, it uses simulated mock data.
- The device code can be run using NodeJS, as long as the device implementation folder has built the NPM dependencies, a script in the device provision step.Run npm install in the device-implementation directory. Now devices can be provisioned. Run ./demo under the device-provisioning folder, and it will generate 5 devices named: alice, bob, charlie, eve and dave, generating a unique device certificate from the generated root CA. These can be run using: “node index.js” in the respective folder. For an amazing terminal graphic experiment try: 
“node index.js gui”. When set up properly, all the different devices receive and parse each others message. 
- Particular effort was put into the design of the device implementation (see index) 
- The diagrams folder has photos of the devices in action


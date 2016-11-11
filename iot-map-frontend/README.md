# IoT Tracking Map
## Design
Built using Web Sockets to the Amazon Web Services IoT platform using AngularJS.
The reason to use AngularJS is the powerful ability to not have to re-write or move the document object model when getting new data;
and the ability to seperate presentation from the underlying models, whilst providing bindings (decoupling).
Also it the built in requirement of dependency injections make this platform easy to integrate into test suites.

The power of using AngularJS is that when data arrives, we can just update the models (e.g. person[1].location changes),
and it is reflected in real time without having to make any calls to the presentation layer.

This is in effect following similar system design as the implementation of the device, thereby simplifying development efforts,
due to the intristinc comparability in design.

## Setup
### Get GoogleMaps API key (use until changed)
### Secret files

### NodeJS Package Manager (NPM)
NodeJS Package Manager needs to be installed to use
the development tools.
NodeJS download https://nodejs.org/en/download/.
...This project currently uses... bower, grunt, karma, karma-jasmine, karma-phantonjs-launcher
...
Use 'npm install' in shell to install all the packages used
in this project.
### How to install bower packages
Bower is used to store JavaScript based packages.
Simple use 'bower install <package>'
... We currently use ngmap and AngularJS
- The configuration is stored ______


### Testing
#### Unit Testing - Jasmine
#### End-to-End Testing
#### Protractor Testing??
#### Writing Tests


#### Grunt commands
Grunt - Checks for JS errors (using JSHints bower module)
[not yet] Grunt Test: JS errors, JS Unit Test

#### Template
```
http://jasmine.github.io/2.0/introduction.jyml
describe(" A suite", function() {
  it ("contains spec with an expectation", function(){
    expect(true).ToBe(true);
  });

```

### Deployment

### Acknowledgements
ng-map
the stack overflow post used for borders

This command uploads to the bucket, just replace iot-tracker-dev-webapp... with the S3 bucket listed in cloud formation
aws s3 cp index.html s3://iot-tracker-dev-webappbucket-1gtr61eylutls && aws s3 cp bower_components s3://iot-tracker-dev-webappbucket-1gtr61eylutls --recursive && aws s3 cp js s3://iot-tracker-dev-webappbucket-1gtr61eylutls --recursive

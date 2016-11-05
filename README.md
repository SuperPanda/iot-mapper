# How to use
0. setup AWS account, create IAM account, copy tokens
aws cloudformation validate-template --template-body file://infrastructure.template
1. follow instructions on how to generate CA certificate
2. generate device certificates with generated CA certificate (devices will be auto-enrolled)
0. install cloud formation file and set the CAcertificateId as a parameter (this step might be able to be removed)
0. use the script in the front end app folder to add your google api key
0. use the script to upload all the files to s3 (under cloud formation use the  s3 resource)
0. access the site from the end points
# To register a device
1. use the generate device certificate script (pass an argument to generate in a folder)
1. copy the device certificates to the device
1. the device will automatically register when first connecting to the system
-- See the Just in time registration explaination: [add source here]

# iot-mapper
Location information is either gathered by the device, or is added manual for static sensors without GPS (via a phone app). Data is maintained over time of the value of the sensors over time, for static sensors; or location history with moving devices. All information is made available on a map.
```
IoT ---> Lambda
            |---> DynamoDB
            |---> [later to be used to trigger updates]
```

serverless create --template aws-nodejs

## Step 1. Setup -two- one thing
- [x] static sensor thing
- [x] thing being tracked
- Setup on test item that reports its geo location (or can choose)

#

## Other
- When configuring an IoT sensor device, get an LED to light up on the device when it is selected
- Setup CloudFormation
- setup app to enrich sensor information
- map to view all things on map

## Reference
[1] https://serverless.zone/iot-with-the-serverless-framework-e228fae87be
If I am to use MQTT, we need to use X.509 certificates. The device gateway requires use of TLS 1.2.
- IoT rule actions are used to invoke Lambda or DynamoDB. Uses DeviceId and timestamp as keys for the table.

?[2] http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user.html
AWS::IAM::User is used to create a new user.

[3] https://serverless.zone/an-abstracted-serverless-microservices-architecture-33706fabc516#.v4emm2npr
Abstracted serverless microservice architecture. Serverless service is deployed using CloudFormation and creates APIs have a unique endpoint.

[4] http://docs.aws.amazon.com/iot/latest/developerguide/iot-rule-actions.html
AWS IoT Result Actions - what to do when an IoT rule is triggered

[5] http://docs.aws.amazon.com/cloudsearch/latest/developerguide/searching-locations.html
Searching and Ranking Results by Geographic Location in Amazon CloudSearch


## Implementation plan
(Based on [1])

StaticThing:
  Type: AWS::IoT::Thing
  Properties:
    AttributePayload:
      Attributes:
        SensorType: someAttribute
        LocationSrc: manual
 
DynamicThing:
  Type: AWS::IoT::Thing
  Properties:
    AttributePayload:
      Attributes:
        LocationSrc: auto

StaticThingPolicy:
  Properties:
    PolicyDocument:
      Version: "2016-10-31"
      Statement
       - Effect: Allow
       Action: ["iot:Connect"]
       Resource: ["${{custom.staticThingClientResource}}"]
       - Effect: "Allow"
       Action: ["iot:Publish"]
       Resource: ["${{custom.staticThingMeasurementTopicResource}}"]


DynamicThingPolicy:
  Properties:
    PolicyDocument:
      Version: "2016-10-31"
      Statement
       - Effect: Allow
       Action: ["iot:Connect"]
       Resource: ["${{custom.dynamicThingClientResource}}"]
       - Effect: "Allow"
       Action: ["iot:Publish"]
       Resource: ["${{custom.dynamicThingLocationTopicResource}}"]

SensorPolicyPrincipalAttachmentCert:
  Type: AWS::IoT::PolicyPrincipalAttachment
  Properties:
    ... etc


(based on [3])
serverless.yml
functions:
  getThing:
    name:getThing
    handler: things.get
    event:
      - http:
        path: things
        method: get

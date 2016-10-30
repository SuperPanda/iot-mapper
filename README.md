# iot-mapper
Location information is either gathered by the device, or is added manual for static sensors without GPS (via a phone app). Data is maintained over time of the value of the sensors over time, for static sensors; or location history with moving devices. All information is made available on a map.

## Step 1. Setup two things
- static sensor thing
- thing being tracked

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

See the wiki for details: https://github.com/SuperPanda/iot-mapper/wiki
This page should include: how to deploy and links to the wiki for tasks such as build on the code (required tools, how to write tests, how to modify assets)

Layout:
Main Page - description of project, use cases (e.g. JITR registration using x509 and TLSv1.2 + MQTT), acknowledgements, overview of steps and pretty picture, link to wiki
Wiki
- Tutorials
- Detailed explanation
- Detailed + alternative installation guide
- How to contribute
- Side bar links to individual READMEs through the project

# iot-mapper (REPLACE THIS WITH DESCRIPTION OF THE PROJECT)
Location information is either gathered by the device, or is added manual for static sensors without GPS (via a phone app). Data is maintained over time of the value of the sensors over time, for static sensors; or location history with moving devices. All information is made available on a map.
```
IoT ---> Lambda -----> Bootstrap
    ---> DynamoDB
            |---> [later to be used to trigger updates]?
            |--->
```

# FUNCTIONAL AND NON-FUNCTIONAL REQUIREMENTS
TODO: ADD FUNCTIONAL AND NON-FUNCTIONAL REQUIREMENTS - 30% of grade

# How to deploy
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

# Work In Progress (needs updating)
- [x] static sensor thing
- [x] thing being tracked
- Setup on test item that reports its geo location (or can choose)
- When configuring an IoT sensor device, get an LED to light up on the device when it is selected
- Setup CloudFormation
- setup app to enrich sensor information
- map to view all things on map

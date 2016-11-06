// See: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html
// Adapted from: https://github.com/awslabs/aws-iot-examples/blob/master/justInTimeRegistration/deviceActivation.js
var AWS = require('aws-sdk');
var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();

exports.handler	 = function(event, context, callback) {
    //Replace it with the AWS region the lambda will be running in
    var region = "us-east-1";
    var accountId = event.awsAccountId.toString().trim();
    var iot = new AWS.Iot({'region': region, apiVersion: '2015-05-28'});
    //var docClient = new AWS.DynamoDB.DocumentClient({'region': region, apiVersion: '2012-08-10'});
    var certificateId = event.certificateId.toString().trim();
     //Replace it with your desired topic prefix
    var topicName = `foo/bar/${certificateId}`;
    var certificateARN = `arn:aws:iot:${region}:${accountId}:cert/${certificateId}`;
    var policyName = `Thing_Policy`;
    console.log(event);
	var now = Number(Date.now());
	// http://stackoverflow.com/questions/32451380/aws-dynamodb-returns-validation-error-when-called-from-aws-lambda
	// According to a post of stack overflow, the format has changed
	var db_item = {
	  "awsAccountId": accountId,
      "certificateId": certificateId,
	  "caCertificateId": event.caCertificateId.toString().trim(),
	  "certificateRegistrationTimestamp": event.certificateRegistrationTimestamp.toString().trim(),
	  "certificateStatus": event.certificateStatus.toString().trim(),
	  "timestamp": now
	};
	/*
	var db_item = {
	  "awsAccountId": {"S": String(accountId)},
      "certificateId": {"S": String(certificateId)},
	  "caCertificateId": {"S": String(event.caCertificateId.toString().trim())},
	  "certificateRegistrationTimestamp": {"S": String(event.certificateRegistrationTimestamp.toString().trim())},
	  "certificateStatus": {"S": String(event.certificateStatus.toString().trim())},
	  "timestamp": {"N": now}
	};*/
	// Storing certificate ARN to make it easier to detach policies later
  	//"certificateARN": {"S": certificateARN},
    // Attach the policy to the certificate
    iot.attachPrincipalPolicy({
        policyName: policyName,
        principal: certificateARN
    }, (err, data) => {
        //Ignore if the policy is already attached
        if (err && (!err.code || err.code !== 'ResourceAlreadyExistsException')) {
            console.log(err);
            callback(err, data);
            return;
        }
		// Instead use API http://docs.aws.amazon.com/cli/latest/reference/iot/delete-certificate.html
		//db_item.attachedPolicyName = policyName;
        console.log(data);
        // Activate the certificate. 
        // Optionally, have Certificate Revocation List (CRL) check logic here and ACTIVATE the certificate only if it is not in the CRL.
        // Revoke the certificate if it is in the CRL
        
        iot.updateCertificate({
            certificateId: certificateId,
            newStatus: 'ACTIVE'
        }, (err, data) => {
            if (err) {
                console.log(err, err.stack); 
                callback(err, data);
            }
            else {
				db_item.certificateStatus = "Active";
                console.log(data);   
				dynamo.putItem({
                    "TableName": "iot-catalog",
                    "Item" : db_item
				}, (err, data) => {
                    if (err) {
                        console.log("Error in putItem"+err);
                        callback(err, data);
                      } else {
                      console.log("Item successully inserted")
                      //context.succeed("Successfully Inserted");
                    }
                    // Documentation available from: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Iot.html
				    // Do I have permissions for iot:attachThingPrincipal, iot:createThing
                    // iot.createThing (thingName, AttributePayload)  => iot.attachThingPrincipal(principal:certificateARN,thingName)
                    thingName = "MyThing-" + certificateId.slice(0,16)
                    iot.createThing({
	  			    "thingName": thingName
                    }, (err, data) => {
		  		    if (err){
			  		    console.log("Error creating thing, error: " + err)
                        callback(err, data);
                    } else {
	   				    iot.attachThingPrincipal({
                           "principal": certificateARN,
					       "thingName": thingName
			  	        }, (err, data) => {
					        if (err){
						        console.log("Could not attach certificate to thing: "+err)
						        callback(err, data);
						    } else {
						         console.log("Certificate successfully attached")
						    }
					    });
				    }
				});
            callback(null, "Success, created, attached policy and activated the certificate " + certificateId);
                });
            }
        });
    }); 
}
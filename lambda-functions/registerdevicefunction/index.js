// See: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html
// Used snippets from https://github.com/awslabs/aws-iot-examples/blob/master/justInTimeRegistration/deviceActivation.js

var AWS = require('aws-sdk');
var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();

var policyName = `Trusted_Thing_Policy`;

exports.handler	 = function(event, context, callback) {

  // Make sure this is set correctly
  var region = "us-east-1";

  var accountId = event.awsAccountId.toString().trim();
  var iot = new AWS.Iot({'region': region, apiVersion: '2015-05-28'});
  var certificateId = event.certificateId.toString().trim();
  var certificateARN = `arn:aws:iot:${region}:${accountId}:cert/${certificateId}`;
  console.log(event);

  // Date.now() needs to be called so the same timestamp isn't returned repeatedly

	var now = Number(Date.now());

	// http://stackoverflow.com/questions/32451380/aws-dynamodb-returns-validation-error-when-called-from-aws-lambda
	// According to a post of stack overflow, the format has changed, so it has been fixed
	var db_item = {
	  "awsAccountId": accountId,
    "certificateId": certificateId,
	  "caCertificateId": event.caCertificateId.toString().trim(),
	  "certificateRegistrationTimestamp": event.certificateRegistrationTimestamp.toString().trim(),
	  "certificateStatus": event.certificateStatus.toString().trim(),
	  "timestamp": now
	};

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

      // Future work:
      // Instead of using AWS CLI scripts to delete certificate,
      // use API http://docs.aws.amazon.com/cli/latest/reference/iot/delete-certificate.html

      console.log(data);

      // Activate the certificate. 
      // Optionally, have Certificate Revocation List (CRL) check logic here and ACTIVATE the certificate only if it is not in the CRL.
      // Revoke the certificate if it is in the CRL
      
      // Set the Device Certificate to be Active, note that it cannot be deleted while Active or have attached policies
      // so utility scripts have been generated to delete all devices.
      iot.updateCertificate({
          certificateId: certificateId,
          newStatus: 'ACTIVE'
      }, (err, data) => {
        if (err) {
          console.log(err, err.stack); 
          callback(err, data);
        } else {
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
            }

            // Documentation on the type of policies needs are
            // available from: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Iot.html
				    // Ensure that the policies for this Lambda function include iot:attachThingPrincipal, iot:createThing
				    // Ensure that the thing policy includes iot:Subscribe, iot:Publish and iot:Connect
				    //
            // iot.createThing (thingName, AttributePayload)  => iot.attachThingPrincipal(principal:certificateARN,thingName)
            thingName = "MyThing-" + certificateId.slice(0,16)
 
            // Create the thing in the IoT platform
            iot.createThing({
	  			    "thingName": thingName
            }, (err, data) => {
		  		    if (err){
			  		    console.log("Error creating thing, error: " + err)
                callback(err, data);
              } else {
                // Attach the device certificate to the 'thing'
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

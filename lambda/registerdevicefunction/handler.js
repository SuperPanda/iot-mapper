// See: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html
// Adapted from: https://github.com/awslabs/aws-iot-examples/blob/master/justInTimeRegistration/deviceActivation.js
var AWS = require('aws-sdk');

exports.handler = function(event, context, callback) {
    //Replace it with the AWS region the lambda will be running in
    var region = "us-east-1";
    var accountId = event.awsAccountId.toString().trim();
    var iot = new AWS.Iot({'region': region, apiVersion: '2015-05-28'});
    var certificateId = event.certificateId.toString().trim();
     //Replace it with your desired topic prefix
    var topicName = `foo/bar/${certificateId}`;
    var certificateARN = `arn:aws:iot:${region}:${accountId}:cert/${certificateId}`;
    var policyName = `Thing_Policy`;
    console.log(event);
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
                    console.log(data);   
                    callback(null, "Success, created, attached policy and activated the certificate " + certificateId);
                }
			});
		}); 
}
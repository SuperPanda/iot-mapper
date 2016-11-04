Based on:
http://docs.aws.amazon.com/iot/latest/developerguide/device-certs-your-own.html

Registering CA Certificate
- Need Registration code from AWS
- Need to Sign Private Key verification certificate to

Step 1. 
./generateCA.sh

Step 2.
- aws iot get-registration-code
-- This will return a registration code.
- openssl genrsa -out verificationCert.key 2048
-- This will generate a key pair for private key verification certificate
- openssl req -new -key verificationCert.key -out verificationCert.csr
-- Set the common name field to match registration code
- openssl x509 -req -in verificationCert.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out verificationCert.pem -days 10000 -sha256
-- This creates the private key verification certificate
- aws iot register-ca-certificate -—ca-certificate file://rootCA.pem -—verification-cert file://verificationCert.pem
- aws iot update-ca-certificate --certificate-id <certificateId> --new-status ACTIVE 
- aws iot update-ca-certificate --certificate-id <certificateId> --new-auto-registration-status ENABLE

https://aws.amazon.com/blogs/aws/new-just-in-time-certificate-registration-for-aws-iot/
Apparently, now I just create a device certificate and sign it with CA and it will automatically be registered.

"When AWS IoT auto-registers a certificate or when a certificate in PENDING_ACTIVATION status connects, it publishes a message to the following MQTT topic"
- "$aws/events/certificates/registered/<caCertificateID>"
- Payload:
```
{
  "certificateId": "<certificateID>",
  "caCertificateId": "<caCertificateId>",
  "timestamp": "<timestamp>",
  "certificateStatus": "PENDING_ACTIVATION",
  "awsAccountId": "<awsAccountId>",
  "certificateRegistrationTimestamp": "<certificateRegistrationTimestamp>"
}
```

"For example, an AWS IoT rule in your account can listen on the $aws/events/certificates/registered/+ topic to build an Amazon DynamoDB table of all the registered certificates."

"The general recommendation is to attach an AWS IoT rules engine action to the registration topic that will perform the bootstrapping or provisioning steps (like consulting your CRLs) and then activate/deactivate/revoke the certificate, create and attach the policies to the certificate, and so on."

-- 
MAKE A DEVICE WITH A CERTIFICATE SIGNED BY A C.A.


WHEN THE $aws/events/certificates/registered/+ topic is received,
call a lambda function to "aws iot create-thing --thing-name "ThingName"..
// $ aws iot create-thing --thing-name "MyLightBulb" --attribute-payload "{\"attributes\": {\"wattage\":\"75\", \"model\":\"123\"}}




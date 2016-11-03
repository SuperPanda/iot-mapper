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
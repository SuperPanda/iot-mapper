generate CA certificate generate-certificates/??/generate-CA.sh
npm install aws-iot-device-sdk
aws iot update-ca-certificate --certificate-id caCertificateId --new-auto-registration-status ENABLE

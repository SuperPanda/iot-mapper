To create a new device skeleton, run:
```
./generate-a-new-device-offline.sh <name of device>

```

The verisign root certificate is root.pem
To make device certificates... go to the device certificate generator
... run the script... ./README.md a_new_folder_name ...
... when running simulation ...


In order to use script, you will need the mosquitto and jq application
$ mosquitto_pub --cafile root.cert --cert deviceCertAndCACert.crt --key deviceCert.key -h <prefix>.iot.us-east-1.amazonaws.com -p 8883 -q 1 -t  foo/bar -i  anyclientID --tls-version tlsv1.2 -m "Hello" -d
.....
use: aws iot describe-endpoint to get prefix
copy said folder.
generate CA certificate generate-certificates/??/generate-CA.sh
npm install aws-iot-device-sdk
aws iot update-ca-certificate --certificate-id caCertificateId --new-auto-registration-status ENABLE

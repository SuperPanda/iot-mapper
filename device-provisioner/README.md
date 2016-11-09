# How to create a device
To create a new device skeleton, run:
```
./generate-a-new-device-offline.sh <name of device>
```
# To make the root certificate, view  certificate-generation/CA-generator/README.md
The verisign root certificate is root.pem
To make device certificates... go to the device certificate generator
... run the script... ./README.md a_new_folder_name ...
... when running simulation ...

# Device Simulator
mqtt-device - uses Blessed NodeJS package for console UI, imports a file containing JSON data, and depending on the mode of operation, it will either move, take sensor measurements, both or none.

... insert ...
# Proposed MQTT Schema
... insert ...

# MQTT registration demo
In order to use script, you will need the mosquitto and jq application
```
$ mosquitto_pub --cafile keystore/root.cert --cert keystore/deviceCertAndCACert.crt --key keystore/deviceCert.key -h <prefix>.iot.us-east-1.amazonaws.com -p 8883 -q 1 -t  foo/bar -i  anyclientID --tls-version tlsv1.2 -m "Hello" -d
```
.....

Well its much simpler now but here is what we used to do...
use: aws iot describe-endpoint to get prefix
copy said folder.
generate CA certificate generate-certificates/??/generate-CA.sh
npm install aws-iot-device-sdk
aws iot update-ca-certificate --certificate-id caCertificateId --new-auto-registration-status ENABLE

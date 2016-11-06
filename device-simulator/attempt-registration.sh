
endpoint=`aws iot describe-endpoint | jq -r '.endpointAddress'`
#echo $endpoint
#mosquitto_pub --cafile root.cert --cert deviceCertAndCACert.crt --key deviceCert.key -h $1.iot.us-east-1.amazonaws.com -p 8883 -q 1 -t foo/bar -i myClientId --tls-version tlsv1.2 -m "Hello" -d
mosquitto_pub --cafile root.cert --cert deviceCertAndCACert.crt --key deviceCert.key -h $endpoint -p 8883 -q 1 -t foo/bar -i myClientId --tls-version tlsv1.2 -m "Hello" -d


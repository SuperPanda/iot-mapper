
endpoint=`aws iot describe-endpoint | jq -r '.endpointAddress'`
mosquitto_pub --cafile root.cert --cert deviceCertBundle.crt --key deviceCert.key -h $endpoint -p 8883 -q 1 -t foo/bar -i myClientId --tls-version tlsv1.2 -m "Hello" -d


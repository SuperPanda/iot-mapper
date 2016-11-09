#
# ./send-message.sh <topic> <messageFile>
#
keystoreDir="keystore"
message=`cat $2`
topic=$1
clientID=`cat clientID`
endpoint=`aws iot describe-endpoint | jq -r '.endpointAddress'`
mosquitto_pub --cafile $keystoreDir/root.cert --cert $keystoreDir/deviceCertBundle.crt --key $keystoreDir/deviceCert.key -h $endpoint -p 8883 -q 1 -t $topic -i $clientID --tls-version tlsv1.2 -m $message -d


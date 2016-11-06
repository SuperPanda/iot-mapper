endpoint=`aws iot describe-endpoint | jq -r '.endpointAddress'`
echo $endpoint

# This helper script requires the AWS CLI to be configured correctly,
# and requires a program called jq. See GitHub wiki sidebar for more info

certificateId=`aws iot list-certificates | jq  -r '.certificates[0].certificateId'`
certificateARN=`aws iot list-certificates | jq -r '.certificates[0].certificateArn'`

policyName="Thing_Policy"

thingNamePrefix="MyThing"
thingNameSuffix=${certificateId:0:16}
thingName="${thingNamePrefix}-${thingNameSuffix}"

# remove policy from device certificate
echo "Detaching the principal/certificate from the device"
aws iot detach-thing-principal --thing-name $thingName --principal $certificateARN

# delete thing from IoT registry
echo "Deleting thing"
aws iot delete-thing --thing-name $thingName

# detaching the policy from the device certificate
echo "Removing $policyName from certificate $certificateId"
aws iot detach-principal-policy --policy-name $policyName --principal $certificateARN

# deactivate the device certificate
echo "Deactivating certificate $certificateId"
aws iot update-certificate --certificate-id $certificateId --new-status INACTIVE

# remove the device certificate from AWS IoT
echo "Deleting certificate $certificateId"
aws iot delete-certificate --certificate-id $certificateId

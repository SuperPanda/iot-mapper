certificateId=`aws iot list-certificates | jq  -r '.certificates[0].certificateId'`
certificateARN=`aws iot list-certificates | jq -r '.certificates[0].certificateArn'`
policyName="Thing_Policy"
# while [ "$certificateId" != "null" ]; do
#aws iot list-principal-policies --certificateARN
#aws iot detach-principal-policy --policy-name "" --principle certificateARN
# remove policy from certificate
echo "Removing $policyName from certificate $certificateId"
aws iot detach-principal-policy --policy-name $policyName --principal $certificateARN
# deactive certificate
echo "Deactivating certificate $certificateId"
aws iot update-certificate --certificate-id $certificateId --new-status INACTIVE
# remove certificate
echo "Deleting certificate $certificateId"
aws iot delete-certificate --certificate-id $certificateId
#$certificateId=`aws iot list-certificates | jq '.certificates[0].certificateId'`
#$certificateARN=`aws iot list-certificates | jq '.certificates[0].cerificateArn'`
#done

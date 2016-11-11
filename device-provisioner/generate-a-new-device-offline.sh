deviceName=$1

caGeneratorDirectory="../certificate-generator/CA-generation"

caCert="$caGeneratorDirectory/rootCA.pem"
caKey="$caGeneratorDirectory/rootCA.key"

generateDeviceCertificate="../certificate-generator/device-certificate-generation/generate-device-certificate.sh"
trustedCA="root.cert"

baseDir=$PWD

$generateDeviceCertificate $deviceName $caCert $caKey $baseDir
# since generateDeviceCertificate creates a directory ./<deviceName>
cp $trustedCA $deviceName/keystore/
echo $deviceName >> $deviceName/clientID
echo `aws iot describe-endpoint | jq -r '.endpointAddress'` > $deviceName/endpoint
cp ../device-implementation/*.js* $deviceName/
cp ../device-implementation/*.mqtt $deviceName/
#cp ../device-provisioner/root.cert $deviceName/keystore/root.cert
cp ../device-implementation/package* $deviceName/
cp -R ../device-implementation/node_modules $deviceName/node_modules
#./get-certificate.sh $deviceName

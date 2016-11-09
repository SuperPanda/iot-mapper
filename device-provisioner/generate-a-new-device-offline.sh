deviceName=$1

caGeneratorDirectory="../certificate-generator/CA-generation"

caCert="$caGeneratorDirectory/rootCA.pem"
caKey="$caGeneratorDirectory/rootCA.key"

generateDeviceCertificate="../certificate-generator/device-certificate-generation/generate-device-certificate.sh"
trustedCA="root.cert"

$generateDeviceCertificate $deviceName $caCert $caKey
# since generateDeviceCertificate creates a directory ./<deviceName>
cp $trustedCA $deviceName/keystore/

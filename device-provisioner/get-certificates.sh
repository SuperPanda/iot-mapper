deviceName=$1

# Make sure that the CA certificate has been generated.
caGeneratorDirectory="../certificate-generator/CA-generation"

caCert="$caGeneratorDirectory/rootCA.pem"
caKey="$caGeneratorDirectory/rootCA.key"

generateDeviceCertificate="../certificate-generator/device-certificate-generation/generate-device-certificate.sh"

# since generateDeviceCertificate creates a directory ./<deviceName>
rm -R $deviceName/keystore
mkdir -p $deviceName
mkdir $deviceName/keystore
trustedCA="../root.cert"
$generateDeviceCertificate $deviceName $caCert $caKey && cp $trustedCA $deviceName/keystore/root.cert

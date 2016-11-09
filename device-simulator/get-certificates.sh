deviceName=$1

# Make sure that the CA certificate has been generated.
caGeneratorDirectory="../certificate-generator/CA-generation"

caCert="$caGeneratorDirectory/rootCA.pem"
caKey="$caGeneratorDirectory/rootCA.key"

generateDeviceCertificate="../certificate-generator/device-certificate-generation/generate-device-certificate.sh"
trustedCA="../device-provisioner/root.cert"

# since generateDeviceCertificate creates a directory ./<deviceName>
$generateDeviceCertificate device-simulator $caCert $caKey && cp $trustedCA $deviceName/keystore/ && mv $deviceName/* ./ && rmdir $deviceName

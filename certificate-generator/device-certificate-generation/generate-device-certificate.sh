# caFile=`../CA-generation/rootCA.pem`
# caKey=`../CA-generation/rootCA.key`
deviceName=$1
caFile=$2
caKey=$3
# Commands to generate device certificate
## https://aws.amazon.com/blogs/iot/just-in-time-registration-of-device-certificates-on-aws-iot/
mkdir $1
mkdir $1/keystore
openssl genrsa -out $1/keystore/deviceCert.key 2048
openssl req -new -key $1/keystore/deviceCert.key -out $1/keystore/deviceCert.csr
openssl x509 -req -in $1/keystore/deviceCert.csr -CA $caFile -CAkey $caKey -CAcreateserial -out $1/keystore/deviceCert.crt -days 1000 -sha256
cat $1/keystore/deviceCert.crt $caFile > $1/keystore/deviceCertBundle.crt
rm $1/keystore/deviceCert.csr
rm $1/keystore/deviceCert.crt

# caFile=`../CA-generation/rootCA.pem`
# caKey=`../CA-generation/rootCA.key`
deviceName=$1
caFile=$2
caKey=$3
# Commands to generate device certificate
## https://aws.amazon.com/blogs/iot/just-in-time-registration-of-device-certificates-on-aws-iot/
mkdir $1
openssl genrsa -out $1/deviceCert.key 2048
openssl req -new -key $1/deviceCert.key -out $1/deviceCert.csr
openssl x509 -req -in $1/deviceCert.csr -CA $caFile -CAkey $caKey -CAcreateserial -out $1/deviceCert.crt -days 1000 -sha256
cat $1/deviceCert.crt $caFile > $1/deviceCertBundle.crt
rm $1/deviceCert.csr

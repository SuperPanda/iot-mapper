# Commands to generate device certificate
## https://aws.amazon.com/blogs/iot/just-in-time-registration-of-device-certificates-on-aws-iot/
mkdir $1
openssl genrsa -out $1/deviceCert.key 2048
openssl req -new -key $1/deviceCert.key -out $1/deviceCert.csr
openssl x509 -req -in $1/deviceCert.csr -CA ../CA-generation/rootCA.pem -CAkey ../CA-generation/rootCA.key -CAcreateserial -out $1/deviceCert.crt -days 1000 -sha256
cat $1/deviceCert.crt ../CA-generation/rootCA.pem > $1/deviceCertAndCACert.crt

# caFile=`../CA-generation/rootCA.pem`
# caKey=`../CA-generation/rootCA.key`


COUNTRY="AU"
STATE="WA"
LOCALITY="Perth"
ORGNAME="UWA"
ORGUNIT="CITS5503"
EMAIL="21332512@student.uwa.edu.au"
DAYS="-days 10000"
CHALLENGE=""
COMPANY=""

SUBJ="/C=$COUNTRY/ST=$STATE/L=$LOCALITY/O=$ORGNAME/OU=$ORGUNIT"
# SUBJ="/C=AU/ST=WA/O=WA"
deviceName=$1
caFile=$2
caKey=$3
baseDir=$4

mkdir $1
mkdir $1/keystore

# Commands to generate device certificate
## https://aws.amazon.com/blogs/iot/just-in-time-registration-of-device-certificates-on-aws-iot/
openssl genrsa -out $1/keystore/deviceCert.key 2048
#openssl genrsa -out $1/keystore/deviceCert.key -out $1/keystore/deviceCert.csr
echo "GENRSA FINISHED"
openssl req -new -key $1/keystore/deviceCert.key -subj $SUBJ -out $1/keystore/deviceCert.csr
# -key $1/keystore/deviceCert.key -out $1/keystore/deviceCert.csr

DAYS="-days 1000"

#openssl x509 -req -in $1/keystore/deviceCert.csr -subject "`echo $SUBJ`" -CA $caFile -CAkey $caKey -CAcreateserial -out $1/keystore/deviceCert.crt $DAYS -sha256
openssl x509 -req -in $1/keystore/deviceCert.csr -CA $caFile -CAkey $caKey -CAcreateserial -out $1/keystore/deviceCert.crt $DAYS -sha256
cat $1/keystore/deviceCert.crt $caFile > $1/keystore/deviceCertBundle.crt
rm $1/keystore/deviceCert.crt
rm $1/keystore/deviceCert.csr

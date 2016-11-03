
openssl genrsa -out rootCA.key 2048
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 100000 -out rootCA.pem
#openssl genrsa -out verificationCert.key 2048
#openssl req -new -key verificationCert.key -out verificationCert.csr
#openssl x509 -req -in verificationCert.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out verificationCert.pem
#aws iot register-ca-certificate --ca-certificate file://root.pem --verification-cert file://verificationCert.pem
# aws iot update-ca-certificate --certificate-id xxxxxxxxx --new-status ACTIVE
# aws iot update-ca-certificate --certificate-id caCertificateId --new-auto-registration-status ENABLE



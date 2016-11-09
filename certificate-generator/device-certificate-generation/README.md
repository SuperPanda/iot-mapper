## Generate a device certificates
### Using script
```
./generate-device-certificate <device name> <CA certificate> <CA key>
```
### Manually
### 1. Generate private key
```
openssl genrsa -out deviceCert.key 2048
```
### 2. Create a certificate signed by the root/intermediate CA certificate
```
# Generate Certificate Signing Request
openssl genrsa -out deviceCert.key -out device.csr
# Sign Certificate
openssl x509 -req -in deviceCert.csr -CA <CA certificate> -CAkey <CA key> -out deviceCert.crt -days 1000 -sha256
# Bundle device certificate with its root certificate
cat deviceCert.crt <CA certificate> > deviceCertBundled.crt
```


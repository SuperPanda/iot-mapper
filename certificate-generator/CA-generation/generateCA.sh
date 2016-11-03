openssl genrsa -out CACertificate.key 2048
openssl req -x509 -new -nodes -key CACertificate.key -sha256 -days 100000 CACertificate.pem
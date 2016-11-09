# Device implementation
## Requirements
It will require NodeJS and to run the certificate generator, and for the CA certificate to be uploaded to Amazon
The code can be run on an embedded device, or started with nodeJS.
The device has a graphical interface for the terminal if run as:
```node index.js gui```
Otherwise running: ```node index.js``` will run without output to the console for the most part.
Loggers can be switched out.
Read the start of the index.js file for detailed run down on the code created for embedded devices to interact
with the cloud, and in particular, the Amazon cloud.

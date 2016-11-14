aws s3 cp "`echo $PWD`/index.html" s3://iot.pandasportal.net/index.html && aws cp "`echo $PWD`/js/app.js" s3://iot.pandasportal.net/script/app.js

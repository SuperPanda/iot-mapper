S3Bucket=$1
aws s3 cp index.html s3://$S3Bucket && aws s3 cp bower_components s3://$S3Bucket/bower_components --recursive && aws s3 cp js s3://$S3Bucket/js --recursive

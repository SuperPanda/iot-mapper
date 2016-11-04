S3Bucket=$0
aws s3 cp index.html s3://$S3Bucket && aws s3 cp bower_components s3://$S3Bucket --recursive && aws s3 cp js s3://$S3Bucket --recursive
bucketName=$1
aws s3 create-bucket --bucket $bucketName
echo $bucketName > mybucketname
./upload-functions-to-s3.sh mybucketname

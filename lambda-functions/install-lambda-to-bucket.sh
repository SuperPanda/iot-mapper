# WARNING: UNTESTED
if [[ "$#" -eq 1 ]];
then
  mybucketname=$1
  aws s3 create-bucket --bucket $mybucketname
  echo $bucketName > mybucketname
  ./upload-functions-to-s3.sh mybucketname
else
  aws s3 list-buckets
  echo "Available buckets\n-------------"
  aws s3 ls | cut --fields=3 --delimiter=\ 
  echo "Enter which bucket you wish to store lambda functions (or re-run with argument with preferred bucket name to generate a new bucket):"
  read mybucketname
  echo $bucketName > mybucketname
  ./upload-functions-to-s3.sh mybucketname

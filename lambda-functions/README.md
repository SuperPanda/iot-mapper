All the lambda functions need to be zipped and uploaded to an S3 bucket
This has been mostly automated.
Add the name of your S3 bucket to mybucketname to be able to call: ./upload-functions-to-s3.sh mybucketname
If you don't know it off the top of your head, then just run without the mybucketname argument. 
It will list your buckets, and you can enter your bucket.

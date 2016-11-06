# Make sure to run this script where the script is located
if [[ "$#" -eq 1 ]]; then
  bucket=`cat $1`
  aws s3 sync . s3://$bucket --exclude="*" --include="*.zip" --exclude="*/*"
else
  python zip-all-functions.py
  aws s3 ls
  echo "Which is your lambda functions bucket? "
  read bucket
  aws s3 sync . s3://$bucket --exclude="*" --include="*.zip" --exclude="*/*"
fi

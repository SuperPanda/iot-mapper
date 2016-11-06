# Make sure to run this script where the script is located
python zip-all-functions.py
aws s3 ls
echo "Which is your lambda functions bucket? "
read bucket
aws s3 sync . s3://$bucket --exclude="*" --include="*.zip" --exclude="*/*"

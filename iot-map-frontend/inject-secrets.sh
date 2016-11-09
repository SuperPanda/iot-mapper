awk -v "api_key=`cat maps-api-key.secret`" "{gsub(/<INSERT_GOOGLE_MAPS_API_KEY>/,api_key);print;}" index.html.template > index.html.1.secret
# UserPoolId ClientId
awk -v "user_pool_id=`cat cognito-pool.secret | cut --delimiter=" " --fields=1`" "{gsub(/<INSERT_USER_POOL_ID>/,user_pool_id);print;}" index.html.1.secret > index.html.2.secret
awk -v "client_id=`cat cognito-pool.secret | cut --fields=2 --delimiter=" " `" "{gsub(/<INSERT_CLIENT_ID>/,client_id);print;}" index.html.2.secret > index.html
rm index.html.1.secret
rm index.html.2.secret

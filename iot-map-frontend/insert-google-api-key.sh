awk -v "api_key=$1" "{gsub(/<INSERT_GOOGLE_MAPS_API_KEY>/,api_key);print;}" index.html.template > index.html

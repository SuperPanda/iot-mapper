DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$DIR/deregister-device.sh
while [ $? -ne 100 ]; do
  $DIR/deregister-device.sh
done

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
./deregister-device.sh
while [ $? -ne 100 ]; do
  $DIR/deregister-device.sh
done

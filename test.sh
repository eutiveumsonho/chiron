#!/bin/bash

uuid=$(uuidgen)
random_str=$(shuf -er -n8  {A..Z} {a..z} {0..9} | paste -sd "")


# Request 1 - with valid vendorId and apiKey headers
response1=$(curl -X POST \
  http://localhost:3000/api/data/completions \
  -H 'vendorId: 572FCEFE637B8AC7' \
  -H 'apiKey: 25kcnWwj1G51wavfyK0vJyvx4sWisksypyI4kV7P3m/3W1oEpPEjizXDHm2bWFIM0u2Ir42mx/TZXd4ioQBTqA==' \
  -d '{
    "_id": "'$uuid'",
    "property1": "'$random_str'",
    "property2": "'$random_str'"
}')

if [[ $response1 == *"Bad Request"* ]]; then
  echo "Request 1 failed with error: Bad Request"
else
  echo "Request 1 succeeded with response:"
  echo $response1
fi

# New line
echo

# # Request 2 - with invalid vendorId and apiKey headers
# response2=$(curl -X POST \
#   http://localhost:3000/api/data/completions \
#   -H 'vendorId: invalid' \
#   -H 'apiKey: invalid' \
#   -d '{
#     "property1": "value1",
#     "property2": "value2"
# }')

# if [[ $response2 == *"Bad Request"* ]]; then
#   echo "Request 2 failed with error: Bad Request"
# else
#   echo "Request 2 succeeded with response:"
#   echo $response2
# fi

# # New line
# echo

# # Request 3 - with vendorId header only
# response3=$(curl -X POST \
#   http://localhost:3000/api/data/completions \
#   -H 'vendorId: your_vendor_id' \
#   -d '{
#     "property1": "value1",
#     "property2": "value2"
# }')

# if [[ $response3 == *"Bad Request"* ]]; then
#   echo "Request 3 failed with error: Bad Request"
# else
#   echo "Request 3 succeeded with response:"
#   echo $response3
# fi

# # New line
# echo

# # Request 4 - with apiKey header only
# response4=$(curl -X POST \
#   http://localhost:3000/api/data/completions \
#   -H 'apiKey: your_api_key' \
#   -d '{
#     "property1": "value1",
#     "property2": "value2"
# }')

# if [[ $response4 == *"Bad Request"* ]]; then
#   echo "Request 4 failed with error: Bad Request"
# else
#   echo "Request 4 succeeded with response:"
#   echo $response4
# fi

# # New line
# echo

# # Request 5 - no headers
# response5=$(curl -X POST \
#   http://localhost:3000/api/data/completions \
#   -d '{
#     "property1": "value1",
#     "property2": "value2"
# }')

# if [[ $response5 == *"Bad Request"* ]]; then
#   echo "Request 5 failed with error: Bad Request"
# else
#   echo "Request 5 succeeded with response:"
#   echo $response5
# fi
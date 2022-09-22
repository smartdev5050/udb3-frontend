#!/bin/bash

REQUIRED_COMMANDS=(jq)

for cmd in ${REQUIRED_COMMANDS[@]}; do
    command -v ${cmd} >/dev/null 2>&1 ||
        {
            echo >&2 "I require ${cmd} but it's not installed. Aborting."
            exit 1
        }
done

if [ $# -ne 2 ]; then
    echo "🚨 Please specify the correct arguments:"
    echo -e "\t - Input filename as first argument"
    echo -e "\t - Output filename as second argument"
    exit 1
fi

MAPANET_FILE_NAME=$1
NEW_FILE_NAME=$2

echo "⌛️ Starting conversion"
echo "--------------------------------------"

if [ -f "$NEW_FILE_NAME" ]; then
    rm $NEW_FILE_NAME
    echo "🗑 $NEW_FILE_NAME removed"
fi

echo "📖 Reading $MAPANET_FILE_NAME"

if ! [ -f "$MAPANET_FILE_NAME" ]; then
    echo "🚨 $MAPANET_FILE_NAME not found"
    exit 1
fi

jq '[ .features[].properties | { label: (.PostalCode + " " + .Region2), name: .Region2, zip: .PostalCode } ] | { cities: . }' $MAPANET_FILE_NAME >$NEW_FILE_NAME

echo "📁 Created $NEW_FILE_NAME"

echo "--------------------------------------"
echo "✅ Done converting"

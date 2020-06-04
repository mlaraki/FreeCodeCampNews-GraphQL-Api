#!/bin/sh

# Decrypt the file
gpg --batch --yes --decrypt --passphrase="$DECRYPT_KEY" --output $GITHUB_WORKSPACE/config/serviceAccount.json $GITHUB_WORKSPACE/config/serviceAccount.json.gpg

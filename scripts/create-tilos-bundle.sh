#!/usr/bin/env sh

set -xe

# Set BASE_NAME
export BASE_NAME="/maratonprogram"

if [[ $(git branch --show-current) != "master" ]]; then
    echo "You are not on the master branch. Please switch to master before deploying."
    exit 1
fi

if [[ $(git status --porcelain) ]]; then
    echo "Git repository is not clean. Please commit or stash your changes before deploying."
    exit 1
fi

# Build dist
yarn build

# zip dist
zip -r maratonprogram.zip dist

echo "maratonprogram.zip created"
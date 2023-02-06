#!/bin/sh

# Get the current version from package.json
version=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

# Create a Git tag with the version
git tag -a v$version -m "Version $version"

# Push the tag to the remote repository
git push origin v$version

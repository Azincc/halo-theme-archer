#!/bin/bash

# Check if version is provided
if [ -z "$1" ]; then
  echo "Error: Version argument is required."
  echo "Usage: ./package-theme.sh <version>"
  exit 1
fi

VERSION=$1
DIST_DIR="dist"
FILE_NAME="halo-theme-archer-$VERSION.zip"

echo "Packaging theme version $VERSION..."

# Create dist directory
mkdir -p $DIST_DIR

# Create zip file
zip -r "$DIST_DIR/$FILE_NAME" templates annotation-setting.yaml settings.yaml theme.yaml README.md

echo "Package created at $DIST_DIR/$FILE_NAME"

#!/bin/bash

set -e

REPO_URL="https://github.com/Cherryvue/cherrynodes-client.git"
CLONE_DIR="cherrynodes-client"

# If directory exists, remove it
if [ -d "$CLONE_DIR" ]; then
  echo "Directory '$CLONE_DIR' already exists. Removing it..."
  rm -rf "$CLONE_DIR"
fi

echo "Cloning repository..."
git clone "$REPO_URL"
cd "$CLONE_DIR"

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

# Get full absolute path to dist/cli.js
CLI_PATH="$(pwd)/dist/cli.js"

echo "Creating CLI launcher script..."
echo "#!/usr/bin/env node" > cherrynodes
echo "require('$CLI_PATH');" >> cherrynodes
chmod +x cherrynodes

echo "Copying CLI script to /usr/local/bin..."
sudo cp cherrynodes /usr/local/bin/cherrynodes

echo "CLI installed successfully. You can now run 'cherrynodes' globally."
echo "Example: cherrynodes --help"

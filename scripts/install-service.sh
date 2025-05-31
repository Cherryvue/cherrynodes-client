#!/bin/bash

set -e

APP_NAME="cherrynodes"
SRC_DIR="cherrynodes-client"
INSTALL_DIR="/opt/${APP_NAME}-server"
SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"
USER_NAME=$(whoami)
NODE_PATH=$(which node)
NODE_BIN_PATH=$(dirname "$NODE_PATH")
MAIN_JS_PATH="${INSTALL_DIR}/dist/main.js"

# Twoje wartości środowiskowe:
ENV_PORT="4042"
ENV_STORAGE_KEY="super-strong-secret-key"

if [ -z "$NODE_PATH" ]; then
  echo "Error: Node.js not found in PATH. Make sure it's installed."
  exit 1
fi

echo "Using node: $NODE_PATH"
echo "Using user: $USER_NAME"

echo "Copying project from $SRC_DIR to $INSTALL_DIR..."
sudo rm -rf "$INSTALL_DIR"
sudo mkdir -p "$INSTALL_DIR"
sudo cp -r "$SRC_DIR"/* "$INSTALL_DIR"
sudo chown -R "$USER_NAME" "$INSTALL_DIR"

cd "$INSTALL_DIR"

echo "Installing dependencies..."
# usuń potencjalnie problematyczny preinstall (nvm)
sed -i '/preinstall/d' package.json || true
npm install

echo "Building NestJS project..."
npm run build

echo "Creating systemd service file..."

cat <<EOF | tee cherrynodes.tmp.service > /dev/null
[Unit]
Description=CherryNodes NestJS HTTP Server
After=network.target

[Service]
User=$USER_NAME
WorkingDirectory=$INSTALL_DIR
ExecStart=$NODE_PATH $MAIN_JS_PATH
Environment=NODE_ENV=production
Environment=PORT=$ENV_PORT
Environment=STORAGE_KEY=$ENV_STORAGE_KEY
Environment=PATH=$NODE_BIN_PATH:/usr/bin:/bin
Restart=always
RestartSec=10
StandardOutput=append:/var/log/$APP_NAME.log
StandardError=append:/var/log/$APP_NAME-error.log

[Install]
WantedBy=multi-user.target
EOF

sudo mv cherrynodes.tmp.service "$SERVICE_FILE"

echo "Reloading systemd and starting service..."
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable "$APP_NAME"
sudo systemctl restart "$APP_NAME"

echo "Service '$APP_NAME' is now active."
sudo systemctl status "$APP_NAME" --no-pager

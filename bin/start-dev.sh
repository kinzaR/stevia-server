#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Stopping..."
$SCRIPT_DIR/stop.sh

echo "Starting..."
$SCRIPT_DIR/start-dev-server.sh
$SCRIPT_DIR/start-dev-daemon.sh

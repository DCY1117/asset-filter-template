#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

java -Dedc.fs.config="${ROOT_DIR}/resources/configuration/provider-configuration.properties" \
  -jar "${ROOT_DIR}/provider-proxy-data-plane/build/libs/connector.jar"

#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

java -Dedc.fs.config="${ROOT_DIR}/resources/configuration/consumer-configuration.properties" \
  -jar "${ROOT_DIR}/connector/build/libs/connector.jar"

#!/usr/bin/env bash

set -e

if [ -n "$GOOGLE_SERVICES_JSON" ]; then
  echo "$GOOGLE_SERVICES_JSON" > google-services.json
  echo "✅ Created google-services.json from secret"
fi
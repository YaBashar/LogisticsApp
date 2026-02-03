#!/usr/bin/env bash

set -euo pipefail

echo "🔧 Setting up google-services.json from EAS Secret..."

if [ -n "${GOOGLE_SERVICES_JSON:-}" ]; then
  cp "${GOOGLE_SERVICES_JSON}" google-services.json
  echo "✅ google-services.json created successfully"
else
  echo "⚠️  GOOGLE_SERVICES_JSON secret not found"
  exit 1
fi


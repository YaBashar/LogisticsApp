#!/usr/bin/env bash

set -euo pipefail

echo "🔧 Setting up google-services.json from EAS Secret..."

if [ -n "${GOOGLE_SERVICES_JSON:-}" ]; then
  # Copy to project root where prebuild expects it
  cp "${GOOGLE_SERVICES_JSON}" google-services.json
  echo "✅ google-services.json created successfully at $(pwd)/google-services.json"
  ls -la google-services.json || echo "❌ File not found after copy!"
else
  echo "⚠️  GOOGLE_SERVICES_JSON secret not found"
  exit 1
fi
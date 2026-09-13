#!/usr/bin/env bash
set -euo pipefail

PINNED_VERSION="1.18.30"
VERSION="${OPENCODE_VERSION:-$PINNED_VERSION}"

echo "[opencode] Installing opencode-ai@${VERSION} (set OPENCODE_VERSION to override)..."
sudo npm install -g "opencode-ai@${VERSION}"

echo "[opencode] Done. Run 'opencode' from the workspace root to start."
echo "[opencode] On first run, OpenCode will auto-install the superpowers plugin."

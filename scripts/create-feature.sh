#!/usr/bin/env bash
# Helper to create a feature branch named ft-<featurename> from dev
# Usage: ./scripts/create-feature.sh <featurename>

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <featurename>"
  exit 2
fi

NAME="$1"
# sanitize: lowercase, replace spaces with hyphens, remove invalid chars
SAFE_NAME=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9._-]+/-/g' | sed -E 's/^-+|-+$//g')
BRANCH="ft-$SAFE_NAME"

# Validate branch name
if [[ ! "$SAFE_NAME" =~ ^[a-z0-9._-]+$ ]]; then
  echo "Invalid feature name after sanitization: $SAFE_NAME"
  echo "Use only letters, numbers, dots, underscores or hyphens."
  exit 3
fi

# Create branch from dev
git fetch origin dev
git checkout dev
git pull origin dev

git checkout -b "$BRANCH"

echo "Created and switched to branch: $BRANCH"

echo "Run: git push -u origin $BRANCH" for the first push.

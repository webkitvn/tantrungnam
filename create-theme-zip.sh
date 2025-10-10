#!/bin/bash

# WordPress Theme Zip Builder
# This script creates a production-ready zip file of the theme

set -e # Exit on error

# Configuration
THEME_NAME="ttn"
OUTPUT_DIR="dist"
ZIP_NAME="${THEME_NAME}.zip"
TEMP_DIR="${OUTPUT_DIR}/${THEME_NAME}"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  WordPress Theme Zip Builder${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Build production files
echo -e "${GREEN}[1/4]${NC} Building production files..."
pnpm run build

# Step 2: Clean up old dist
echo -e "${GREEN}[2/4]${NC} Cleaning up old distribution files..."
rm -rf "${OUTPUT_DIR}"
mkdir -p "${TEMP_DIR}"

# Step 3: Copy files to temp directory
echo -e "${GREEN}[3/4]${NC} Copying theme files..."

# Copy all files except excluded ones
rsync -av --progress \
  --exclude="${OUTPUT_DIR}" \
  --exclude="node_modules" \
  --exclude="src" \
  --exclude=".git" \
  --exclude=".gitignore" \
  --exclude=".DS_Store" \
  --exclude="package.json" \
  --exclude="pnpm-lock.yaml" \
  --exclude="build.mjs" \
  --exclude="postcss.config.mjs" \
  --exclude="tailwind.config.mjs" \
  --exclude="AGENT.md" \
  --exclude="AGENTS.md" \
  --exclude="CLAUDE.md" \
  --exclude="create-theme-zip.sh" \
  --exclude="*.log" \
  --exclude="*.map" \
  --exclude=".env" \
  --exclude=".env.local" \
  ./ "${TEMP_DIR}/"

# Step 4: Create zip file
echo -e "${GREEN}[4/4]${NC} Creating zip file..."
cd "${OUTPUT_DIR}"
zip -r "${ZIP_NAME}" "${THEME_NAME}" -q

# Cleanup temp directory
rm -rf "${THEME_NAME}"

# Get file size
FILE_SIZE=$(du -h "${ZIP_NAME}" | cut -f1)

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Theme package created successfully!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Location: ${OUTPUT_DIR}/${ZIP_NAME}"
echo -e "  Size: ${FILE_SIZE}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""


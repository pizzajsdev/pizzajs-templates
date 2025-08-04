#!/bin/bash

set -e # exit when any command fails

DEST_DIR='public/images/pwa'
BG_COLOR=$(node -e 'import {webManifest} from "./app/config.ts"; console.log(webManifest.background_color);')

echo "PWA BG_COLOR: $BG_COLOR"

pnpm dlx pwa-asset-generator@8 public/images/logo.svg $DEST_DIR \
    --icon-only --favicon --padding '5%' --opaque false

pnpm dlx pwa-asset-generator@8 public/images/logo.svg $DEST_DIR \
    --splash-only --padding '15%' --background $BG_COLOR

#!/bin/bash
echo "Starting Verto Language Translator..."
echo ""
echo "Installing dependencies..."
npm install
echo ""
echo "Starting development server..."
export NODE_ENV=development
tsx server/index.ts
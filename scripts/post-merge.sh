#!/bin/bash
set -e

# Install any new/changed dependencies from merged work.
npm install

# Sync the database schema (non-interactive). Only affects the dev database.
npm run db:push -- --force

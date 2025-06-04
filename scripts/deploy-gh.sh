#!/usr/bin/env sh

set -xe

if [[ $(git branch --show-current) != "master" ]]; then
    echo "You are not on the master branch. Please switch to master before deploying."
    exit 1
fi

if [[ $(git status --porcelain) ]]; then
    echo "Git repository is not clean. Please commit or stash your changes before deploying."
    exit 1
fi

# Uncomment /tilos-maraton specific paths:
# Replace //* with nothing
sed -i '' 's/\/\/\*//g' src/router.tsx
sed -i '' 's/\/\/\*//g' vite.config.ts

# Build dist
yarn build

# Git reset
git checkout -- src/router.tsx vite.config.ts

# Remove gh-pages
git branch -D gh-pages || true
git checkout -b gh-pages

# Clean up unneded files
rm -rf src biome.json index.html package.json yarn.lock postcss.config.js vite.config.ts tsconfig.json tailwind.config.js

# Extract dist
mv dist/* .

# Add files
git add .

# Commit
git commit -m "Deploy to GitHub Pages"

# Push
echo "Run this command if everything is OK:"
echo "git push --set-upstream origin gh-pages --force"


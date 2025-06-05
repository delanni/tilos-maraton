#!/usr/bin/env sh

set -xe

# Set BASE_NAME
export BASE_NAME="/tilos-maraton"

if [[ $(git branch --show-current) != "master" ]]; then
    echo "You are not on the master branch. Please switch to master before deploying."
    exit 1
fi

if [[ $(git status --porcelain) ]]; then
    echo "Git repository is not clean. Please commit or stash your changes before deploying."
    exit 1
fi

# Build dist
yarn build

# Remove gh-pages
git branch -D gh-pages || true
git checkout -b gh-pages

# Clean up unneded files
rm -rf src biome.json index.html package.json yarn.lock postcss.config.js vite.config.ts tsconfig.json tailwind.config.js

# Extract dist
mv dist/* .

# Update resource links
node scripts/updateResourceLinks.cjs --target="$PWD" --basename="$BASE_NAME"

# Copy index.html to 404.html (fallback for github pages routing behaviour)
cp index.html 404.html

# Remove unused folders
rm -rf programme resources scripts

# Add files
git add .

# Commit
git commit -m "Deploy to GitHub Pages: $(git log master --pretty=format:%s | head -1)"

# Push
echo "Run this command if everything is OK:"
echo "git push --set-upstream origin gh-pages --force"

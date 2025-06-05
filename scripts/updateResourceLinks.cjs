#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const getopts = require("getopts");

const opts = getopts(process.argv.slice(2), {
  string: ["target", "basename"],
});

const indexHtmlPath = path.join(opts.target, "index.html");
const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const updatedIndexHtml = indexHtml.replace(/(href="|src="|rel=")(\/[^"\s]+)/g, (match, p1, p2) => {
  if (!p2.startsWith("/tilos-maraton")) {
    console.log(`Replacing ${match} with ${p1}${opts.basename}${p2}`);
    return `${p1}${opts.basename}${p2}`;
  }
  return match;
});

if (indexHtml.length !== updatedIndexHtml.length) {
  fs.writeFileSync(indexHtmlPath, updatedIndexHtml);
  console.log("Updated index.html");
} else {
  console.log("index.html is already up to date");
}

#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const artistsJsonPath = path.join(__dirname, "artists.json");
const updatedPath = path.join(__dirname, "artists_updated.json");
const artists = JSON.parse(fs.readFileSync(artistsJsonPath, "utf8"));
const performancesJsonPath = path.join(__dirname, "performances.json");
const performances = JSON.parse(fs.readFileSync(performancesJsonPath, "utf8"));

// for each artist, check if the artist is performing on "bogracs" stage or "tilos-caravan-studio"
// if they are, test the artistId if it is a valid URL as https://tilos.hu/show/:artistId
// if the response is 200, update the artists, set the description to
// `A <artist name> műsorkészítői. https://tilos.hu/show/:artistId`
// if the response is not 200, update the artists, set the description to
// `A <artist name> műsorkészítői.`

(async () => {
  for (const artist of artists) {
    const performance = performances.find((p) => p.artistId === artist.id);
    if (!performance) {
      continue;
    }
    if (performance.stageId === "bogracs" || performance.stageId === "tilos-caravan-studio") {
      const response = await fetch(`https://tilos.hu/show/${artist.id}`);

      const article = artist.name[0].toLowerCase().match(/[aeiouáéíóúőűüö]/) ? "Az" : "A";
      if (artist.name.includes(" & ") || artist.name.includes(" + ")) {
        const artistNames = artist.name.split(/ [&+] /).join(" és ");
        artist.description = `${article} ${artistNames} műsorkészítői.`;
      } else {
        artist.description = `${article} ${artist.name} műsorkészítői.`;
      }

      if (response.status === 200) {
        artist.description += ` - https://tilos.hu/show/${artist.id}`;
      }

      console.log(`Updated description for ${artist.name}: ${artist.description}`);
    }
  }

  fs.writeFileSync(updatedPath, JSON.stringify(artists, null, 2));
})();

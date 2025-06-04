const fs = require("fs");
const data = fs.readFileSync(__dirname + "/performances.json", "utf8");
const performances = JSON.parse(data);

const festivalStart = new Date("2025-06-06T08:00:00+02:00");

performances.forEach((performance) => {
  const { id, dayId, startTime, endTime } = performance;

  // verify it's on the correct date:
  const day = dayId.replace("day-", "");

  const start = new Date(startTime);
  const end = new Date(endTime);

  const supposedDayId = `day-${start.getDate() - festivalStart.getDate() + 1}`;
  const supposedDayIdForEarlyActs = `day-${start.getDate() - festivalStart.getDate()}`;

  if (start.getHours() < 8) {
    if (supposedDayIdForEarlyActs !== dayId) {
      console.log(
        `Morning-performance ${performance.id} is not on the correct day: ${dayId} (should be ${supposedDayIdForEarlyActs})`,
      );
    }
  } else {
    if (supposedDayId !== dayId) {
      console.log(
        `Performance ${performance.id} is not on the correct day: ${dayId} (should be ${supposedDayId})`,
      );
    }
  }

  const supposedIdStart = `06-${(5 + parseInt(day)).toString().padStart(2, "0")}`;
  if (!id.startsWith(supposedIdStart)) {
    console.log(
      `Performance ${performance.id} is not on the correct day: ${dayId} (should be ${supposedIdStart})`,
    );

    performance.id = supposedIdStart + id.slice(5);
  }

  // No set should be longer than 5 hours
  const duration = new Date(endTime) - new Date(startTime);
  if (duration > 5 * 60 * 60 * 1000 && !performance.id.includes("heti-betevo")) {
    console.log(
      `Performance ${performance.id} is longer than 5 hours: ${duration / 1000 / 60 / 60} hours`,
    );
  }
});

const performancesPerDay = performances.reduce((acc, performance) => {
  const day = performance.dayId.replace("day-", "");
  if (!acc[day]) {
    acc[day] = [];
  }
  acc[day].push(performance);
  return acc;
}, {});

// Last artists on stages past midnight should play for ~2 hours
Object.entries(performancesPerDay).forEach(([day, performances]) => {
  const performancesPerStage = performances.reduce((acc, performance) => {
    const stage = performance.stageId;
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(performance);
    return acc;
  }, {});

  const lastPerformancePerStage = Object.fromEntries(
    Object.entries(performancesPerStage).map(([stage, performances]) => {
      const performancesSorted = performances.sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );
      const lastPerformance = performancesSorted[performancesSorted.length - 1];
      return [stage, lastPerformance];
    }),
  );

  Object.entries(lastPerformancePerStage).forEach(([stage, performance]) => {
    if (["kerti-szinpad", "bogracs", "etc", "tilos-caravan-studio"].includes(stage)) {
      return;
    }
    const duration = new Date(performance.endTime) - new Date(performance.startTime);
    if (duration < 2 * 60 * 60 * 1000) {
      console.log(
        `Performance ${performance.id} on stage ${stage} on day ${day} is not long enough: ${duration / 1000 / 60 / 60} hours`,
      );
      performance.endTime = toIsoWithOffset(
        new Date(new Date(performance.startTime).getTime() + 2 * 60 * 60 * 1000),
      );
    }
  });
});

function toIsoWithOffset(date) {
  // Get offset in minutes and convert to ±HH:MM
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, "0");
  const hours = pad(offset / 60);
  const minutes = pad(offset % 60);
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    sign +
    hours +
    ":" +
    minutes
  );
}

// All artists should be in performances.json, and all artists from performances.json should be in artists.json
const artists = fs.readFileSync(__dirname + "/artists.json", "utf8");
const artistsJson = JSON.parse(artists);

const artistIdsInPerformanceJson = performances.map((p) => p.artistId);
const artistIdsInArtistsJson = artistsJson.map((a) => a.id);

const artistsPresentInPerfNotInArtistsJson = performances.filter(
  (p) => !artistIdsInArtistsJson.includes(p.artistId),
);

if (artistsPresentInPerfNotInArtistsJson.length > 0) {
  console.log(
    "Artists present in performances.json but not in artists.json:",
    artistsPresentInPerfNotInArtistsJson.map((p) => p.artistId),
  );
}

const artistsPresentInArtistsJsonNotInPerf = artistsJson.filter(
  (a) => !artistIdsInPerformanceJson.includes(a.id),
);

if (artistsPresentInArtistsJsonNotInPerf.length > 0) {
  console.log(
    "Artists present in artists.json but not in performances.json:",
    artistsPresentInArtistsJsonNotInPerf.map((a) => a.id),
  );
}

// All caravan programmes should have a similar message: "Élő közvetítés a Dürer Kertből"
const caravanProgrammes = performances.filter((p) => p.stageId === "tilos-caravan-studio");
const caravanProgrammesWithoutSimilarMessage = caravanProgrammes.filter(
  (p) => !p.description.includes("Élő közvetítés a Dürer Kertből"),
);
if (caravanProgrammesWithoutSimilarMessage.length > 0) {
  console.log(
    "Not all caravan programmes have a similar message:",
    caravanProgrammesWithoutSimilarMessage.map((p) => p.id),
  );
  caravanProgrammesWithoutSimilarMessage.forEach((p) => {
    p.description = "Élő közvetítés a Dürer Kertből";
  });
}

// No duplicate performances
const performancesById = performances.reduce((acc, performance) => {
  if (acc[performance.id]) {
    console.log("Duplicate performance:", performance.id);
  }
  acc[performance.id] = performance;
  return acc;
}, {});

if (Object.keys(performancesById).length !== performances.length) {
  console.log(
    "Duplicate performances:",
    Object.keys(performancesById).filter(
      (id) => performancesById[id] !== performances.find((p) => p.id === id),
    ),
  );
}

// No duplicate artists
artistIdsInArtistsJson.forEach((id) => {
  const count = artistIdsInArtistsJson.filter((pid) => pid === id).length;
  if (count > 1) {
    console.log("Duplicate artist:", id);
  }
});

// Every day should have a tombola
const days = performances
  .map((p) => p.dayId)
  .filter((value, index, self) => self.indexOf(value) === index);
const tombolas = performances.filter((p) => p.artistId.includes("tombola"));
if (days.length !== tombolas.length) {
  console.log(
    "Not every day has a tombola:",
    days.filter((day) => !tombolas.some((p) => p.dayId === day)),
  );
}

// fs.writeFileSync(__dirname + "/performances_fixed.json", JSON.stringify(performances, null, 2));

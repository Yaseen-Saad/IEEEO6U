const prevEventsSection = document.querySelector("#prev-events > div");
const comingEventsSection = document.querySelector("#up-coming-events > div");


(async () => {
  await appendEvent("events", prevEventsSection, false);
  await appendEvent("events", comingEventsSection, true);
  toggleLoader("loader");
})();

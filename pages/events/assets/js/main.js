const prevEventsSection = document.querySelector("#prev-events > div");
const comingEventsSection = document.querySelector("#up-coming-events > div");
const collectionRef = db.collection("events");


(async () => {
  await appendEvent(collectionRef, prevEventsSection, false);
  await appendEvent(collectionRef, comingEventsSection, true);
  toggleLoader("loader");
})();

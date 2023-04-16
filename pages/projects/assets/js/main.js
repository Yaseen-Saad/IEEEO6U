const prevEventsSection = document.querySelector("#prev-projects > div");
const comingEventsSection = document.querySelector("#up-coming-projects > div");
const collectionRef = db.collection("projects");

(async () => {
  await appendEvent(collectionRef, prevEventsSection, false);
  await appendEvent(collectionRef, comingEventsSection, true);
  toggleLoader("loader");
})();

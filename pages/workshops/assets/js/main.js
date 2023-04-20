const prevEventsSection = document.querySelector("#prev-projects > div");
const comingEventsSection = document.querySelector("#up-coming-projects > div");

(async () => {
  await appendEvent("Workshops", prevEventsSection, false);
  await appendEvent("Workshops", comingEventsSection, true);
  toggleLoader("this-is-loader");
pauseAnimation();
})();

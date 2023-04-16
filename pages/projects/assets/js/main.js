const prevEventsSection = document.querySelector("#prev-projects > div");
const comingEventsSection = document.querySelector("#up-coming-projects > div");

(async () => {
  await appendEvent("Projects", prevEventsSection, false);
  await appendEvent("Projects", comingEventsSection, true);
  toggleLoader("this-is-loader");
pauseAnimation();
})();

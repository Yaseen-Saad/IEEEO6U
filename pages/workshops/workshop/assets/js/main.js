const PARAMS = new URLSearchParams(window.location.search);
const doc = PARAMS.get("doc");
const eventSec = document.querySelector(".Workshops-sec #Workshop");
if (doc) {
  (async () => {
    await db
      .collection("Workshops")
      .doc(doc)
      .get()
      .then((doc) => {
        const event = doc.data();
        const eventImage = document.createElement("img");
        eventImage.src = event.eventImage;

        const eventTitle = document.createElement("h2");
        eventTitle.textContent = event.eventName;
        eventTitle.id = "Workshop Title";
        const eventDescription = document.createElement("p");
        eventDescription.innerHTML = event.eventDescription;

        const eventImages = document.createElement("div");
        event.eventAdditionalImages.map((image) => {
          const img = document.createElement("img");
          img.src = image;
          eventImages.append(img);
        });
        eventSec.append(eventImage, eventTitle, eventDescription, eventImages);
      });
    toggleLoader("this-is-loader");
    pauseAnimation();
  })();
}

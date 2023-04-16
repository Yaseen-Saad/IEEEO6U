const eventsSection = document.querySelector("#events > div");
const collectionRef = db.collection("events");
(async () => {
  await collectionRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const event = doc.data(),
        eventArticle = document.createElement("a"),
        eventImage = document.createElement("img"),
        eventImageDiv = document.createElement("div"),
        eventData = document.createElement("div"),
        eventName = document.createElement("h2"),
        eventDescription = document.createElement("p");

      eventArticle.title = "Click To Show More";
      eventImage.src = event.eventImage;
      eventName.innerHTML = event.eventName;
      eventDescription.innerHTML = limitWords(event.eventDescription, 320);
      console.log(!event.neededData[0]);
      console.log(event);
      if (event.neededData[0]) {
        eventArticle.href = `../register/?doc=${doc.id}`;
      } else {
        eventArticle.href = `./event/?doc=${doc.id}`;
      }

      eventData.append(eventName, eventDescription);
      eventImageDiv.append(eventImage);
      eventArticle.append(eventImageDiv, eventData);
      eventsSection.append(eventArticle);
    });
  });
  toggleLoader("this-is-loader");
pauseAnimation();
})();

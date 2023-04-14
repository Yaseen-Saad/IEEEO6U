(async function () {
  let events = 0,
    upcomingEvents = 0;
  await db
    .collection("events")
    .where("neededData", "==", [])
    .orderBy("dateCreated", "desc")
    .limit(6)
    .get()
    .then((querySnapshot) => {
      const slider = $(".slider");
      const upEvents = $(".our-events ");
      querySnapshot.forEach((doc) => {
        const event = doc.data();
        const EventParent = document.createElement("div");
        EventParent.className = "item";

        const EventImage = document.createElement("img");
        EventImage.src = event.eventImage;
        EventParent.append(EventImage);

        const EventDiv = document.createElement("div"),
          EventName = document.createElement("p"),
          EventDesc = document.createElement("p");

        EventName.textContent = event.eventName;
        EventDesc.innerHTML = limitWords(event.eventDescription, 200);

        const toEventButton = document.createElement("a");
        toEventButton.href = `./pages/events/event/index.html?doc=${doc.id}`;
        toEventButton.textContent = "Learn More";
        toEventButton.className = "button";

        EventDiv.append(EventName, EventDesc, toEventButton);
        EventParent.append(EventDiv);

        slider.append(EventParent);
        events++;
      });
      const landing = $(".landing");
      if (events > 1) {
        landing.owlCarousel({
          items: 1,
          loop: true,
          autoplay: true,
          autoplayTimeout: 5000,
          autoplayHoverPause: true,
          mouseDrag: true,
          touchDrag: true,
        });
      } else {
        document.body.style.height;
        landing[0].style.display = "block";
      }
    });

  await db
    .collection("events")
    .where("neededData", "!=", [])
    .orderBy("neededData")
    .orderBy("dateCreated", "asc")
    .limit(4)
    .get()
    .then((querySnapshot) => {
      const upEvents = $(".our-events ");
      querySnapshot.forEach((doc) => {
        const event = doc.data();

        const EventImage = document.createElement("img");
        EventImage.src = event.eventImage;

        const EventImageDiv = document.createElement("div");
        EventImageDiv.append(EventImage);
        EventImageDiv.className = "right";

        const EventName = document.createElement("h3");
        EventName.textContent = event.eventName;

        const EventDesc = document.createElement("p");
        EventDesc.innerHTML = limitWords(event.eventDescription, 200);

        const EventButton = document.createElement("a");
        EventButton.textContent = "register";
        EventButton.href = `../../pages/regestier/index.html?doc=${doc.id}`;
        EventButton.className = "button";

        const EventDiv = document.createElement("div");
        EventDiv.append(EventName, EventDesc, EventButton);

        const EventParent = document.createElement("div");
        EventParent.className = "up-coming-event";
        if (upcomingEvents % 2 == 0) {
          EventParent.append(EventDiv, EventImageDiv);
        } else {
          console.log("done");
          EventParent.append(EventImageDiv, EventDiv);
        }
        upEvents[0].append(EventParent);
        upcomingEvents++;
      });
    });

  console.log("loaded");
})();

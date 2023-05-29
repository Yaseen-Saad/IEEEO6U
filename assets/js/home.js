(async function () {
  let events = 0,
    upcomingEvents = 0;
  const collection = "events";
  // Promise.all()
  await db
    .collection(collection)
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
        toEventButton.href = `./pages/events/event/?doc=${doc.id}&collection=${collection}`;
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
    .collection(collection)
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
        EventButton.href = `./pages/register/?doc=${doc.id}&collection=${collection}`;
        EventButton.className = "button";

        const EventDiv = document.createElement("div");
        EventDiv.append(EventName, EventDesc, EventButton);

        const EventParent = document.createElement("div");
        EventParent.className = "up-coming-event";
        if (upcomingEvents % 2 == 0) {
          EventParent.append(EventDiv, EventImageDiv);
        } else {
          EventParent.append(EventImageDiv, EventDiv);
        }
        upEvents[0].append(EventParent);
        upcomingEvents++;
      });
    });
  await db
    .collection("best-members")
    .get()
    .then((querySnapshot) => {
      const leaders = document.querySelector(
        "body .meet-us > article:last-child"
      );
      querySnapshot.forEach((data) => {
        const doc = data.data();
        const head = document.createElement("article"),
          headContacts = document.createElement("div"),
          headImageCont = document.createElement("div"),
          headName = document.createElement("p"),
          headImage = document.createElement("img"),
          headRole = document.createElement("span");
        // facebook
        const facebookIcon = document.createElement("a");
        facebookIcon.href = doc.BestMemberFace;
        const facebookIconContent = document.createElement("i");
        facebookIconContent.classList.add("fa-brands", "fa-facebook");
        facebookIcon.append(facebookIconContent);
        headContacts.append(facebookIcon);

        // linked in
        const linkedInIcon = document.createElement("a");
        linkedInIcon.href = doc.BestMemberLinked;
        const linkedInIconContent = document.createElement("i");
        linkedInIconContent.classList.add("fa-brands", "fa-linkedIn");
        linkedInIcon.append(linkedInIconContent);
        headContacts.append(linkedInIcon);

        // phone number
        let icon = document.createElement("a");
        let iconContent = document.createElement("i");
        iconContent.classList.add("fa-solid", "fa-phone");
        icon.append(iconContent);
        let text = document.createElement("input");
        text.style.cssText = "position:absolute;left:-43829px;top-432432px;";
        text.value = doc.BestMemberPhone;
        document.body.append(text);
        //handling hoe the will user either copy the phone number or call him
        icon.onclick = (e) => {
          e.preventDefault();
          //checking if the user's device supports making calls
          if (
            navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)
          ) {
            // If so, make the call
            window.location.href = `tel:${text.value}`;
          } else {
            // if the device doesn't support then coppy the number
            text.select();
            document.execCommand("copy");
            alert("Phone Number Copied");
          }
        };
        headContacts.append(icon);
        headImage.src = doc.BestMemberImage;
        headName.textContent = doc.BestMemberName;
        headRole.textContent = doc.BestMemberRole;

        head.classList.add("card", "item");

        headImageCont.append(headImage);
        head.append(headImageCont, headName, headRole, headContacts);
        leaders.append(head);
      });

      $(".officers").owlCarousel({
        items: 3,
        autoplay: true,
        autoplayTimeout: 5000,
        nav: true,
        dots: false,
        margin: 20,
        autoplayHoverPause: true,
        mouseDrag: true,
        navText: [
          '<i class="fa-solid fa-chevron-left"></i>',
          '<i class="fa-solid fa-chevron-right"></i>',
        ],
        touchDrag: true,
        responsive: {
          0: {
            items: 1,
          },
          400: {
            items: 2,
          },
          600: {
            items: 3,
          },
          1000: {
            items: 5,
          },
        },
      });
    });

  toggleLoader("this-is-loader");
  pauseAnimation();
})();
$(".committees").owlCarousel({
  items: 3,
  autoplay: true,
  autoplayTimeout: 5000,
  nav: true,
  dots: false,
  margin: 20,
  autoplayHoverPause: true,
  mouseDrag: true,
  navText: [
    '<i class="fa-solid fa-chevron-left"></i>',
    '<i class="fa-solid fa-chevron-right"></i>',
  ],
  touchDrag: true,
  responsive: {
    0: {
      items: 1,
    },
    400: {
      items: 2,
    },
    600: {
      items: 3,
    },
    1000: {
      items: 5,
    },
  },
});
(async () => {
  await db
    .collection("officers")
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
        facebookIcon.href = doc.officerFace;
        const facebookIconContent = document.createElement("i");
        facebookIconContent.classList.add("fa-brands", "fa-facebook");
        facebookIcon.append(facebookIconContent);
        headContacts.append(facebookIcon);

        // linked in
        const linkedInIcon = document.createElement("a");
        linkedInIcon.href = doc.officerLinked;
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
        text.value = doc.officerPhone;
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
        headImage.src = doc.officerImage;
        headName.textContent = doc.officerName;
        headRole.textContent = doc.officerRole;

        head.classList.add("card", "item");

        headImageCont.append(headImage);
        head.append(headImageCont, headName, headRole, headContacts);
        leaders.append(head);
      });

      $(".officers").owlCarousel({
        items: 4,
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

  const partnersSection = $(".our-partners > article:last-of-type")[0];
  await db
    .collection("partners")
    .limit(20)
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        const partner = doc.data();

        const partnerImage = document.createElement("img");
        partnerImage.src = partner.partnerImage;

        const partnerDiv = document.createElement("div");
        partnerDiv.title = partner.partnerName;
        partnerDiv.append(partnerImage);

        partnersSection.append(partnerDiv);
      });
    });
  toggleLoader("this-is-loader");
  pauseAnimation();
})();

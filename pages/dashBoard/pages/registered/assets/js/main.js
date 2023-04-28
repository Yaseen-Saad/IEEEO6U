firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    const cont = document.querySelector(".remove-section");

    document.querySelector(".remove-options").addEventListener("click", (e) => {
      if (!e.target.innerText.match(/\n/)) {
        cont.innerHTML = "";
        const collection = e.target.getAttribute("collection");
        db.collection(collection)
          .where("neededData", "!=", [])
          .orderBy("neededData")
          .orderBy("dateCreated")
          .get()
          .then((snap) => {
            if (snap.empty) {
              cont.innerHTML = `<quote>No ${collection} To Show</quote>`;
            }
            snap.forEach((doc) => {
              const element = doc.data();
              const image = document.createElement("img");
              image.src =
                element.eventImage ||
                element.officerImage ||
                element.partnerImage ||
                element.BestMemberImage;

              const title = document.createElement("h2");
              title.textContent =
                element.eventName ||
                element.officerName ||
                element.partnerName ||
                element.BestMemberName;

              const desc = document.createElement("p");
              desc.innerHTML = limitWords(
                element.eventDescription ||
                  element.officerRole ||
                  " " ||
                  element.BestMemberRole,
                100
              );
              const deleteButton = document.createElement("a");
              deleteButton.classList.add("deleteButton", "normal-button");
              deleteButton.textContent = "To Data";
              deleteButton.href = `./data/?doc=${doc.id}&collection=${collection}`;
              const article = document.createElement("article");
              article.setAttribute("DOCID", doc.id);
              article.setAttribute("COLLECTION", collection);
              article.append(image, title, desc, deleteButton);

              cont.append(article);
            });
          });
      }
    });
  } else {
    giveAlert("PLEASE SIGN IN AGAIN", "#ff5733", "the developer says", 1);
    setTimeout(() => {
      location.href = "../../";
    }, 3000);
  }
});

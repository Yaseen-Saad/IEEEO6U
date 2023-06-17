firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    const cont = document.querySelector(".remove-section");

    document.querySelector(".remove-options").addEventListener("click", (e) => {
      if (!e.target.innerText.match(/\n/)) {
        cont.innerHTML = "";
        const collection = e.target.getAttribute("collection").trim();
        db.collection(collection)
          .get()
          .then((snap) => {
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
              const deleteButton = document.createElement("button");
              deleteButton.className = "deleteButton";
              deleteButton.textContent = "DELETE !";
              deleteButton.addEventListener("click", function (e) {
                const object = this.parentNode;
                giveAlert(
                  "are you sure you want to delete this document?",
                  "#e92929",
                  "",
                  "",
                  true
                ).then(() => {
                  db.collection(object.getAttribute("COLLECTION"))
                    .doc(object.getAttribute("DOCID"))
                    .delete();
                  if (object.getAttribute("regis")) {
                    (async () => {
                      await db
                        .collection("registered-events")
                        .where("doc", "==", object.getAttribute("DOCID"))
                        .where(
                          "collection",
                          "==",
                          object.getAttribute("COLLECTION")
                        )
                        .get()
                        .then((snap) => {
                          snap.forEach((doc) => {
                            console.log(doc.data());
                            doc.ref.delete();
                          });
                        })
                        .catch((error) => {
                          console.error("Error deleting document: ", error);
                        });
                    })();
                  }
                  giveAlert("Object successfully deleted!");
                  object.remove();
                });
                //code here ...
              });
              const article = document.createElement("article");
              article.setAttribute("DOCID", doc.id);
              article.setAttribute("COLLECTION", collection);
              if (
                !["officers", "best-members", "partners"].includes(collection)
              ) {
                article.setAttribute("regis", element.neededData.length);
              }
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

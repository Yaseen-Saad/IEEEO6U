firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    const cont = document.querySelector(".remove-section");

    document.querySelector(".remove-options").addEventListener("click", (e) => {
      if (!e.target.innerText.match(/\n/)) {
        cont.innerHTML = "";
        const collection = e.target.getAttribute("collection");
        giveAlert(
          "ONCE YOU CLICK THE DELETE BUTTON THE OBJECT WILL BE DELETED PERMANENTLY AND THERE IS NO UNDO !!",
          "#ff5733",
          "the DEVELOPER says"
        );

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
                db
                  .collection(
                    object.getAttribute("COLLECTION")
                  )
                  .doc(object.getAttribute("DOCID"))
                  .delete()
                  .then(() => {
                    giveAlert("Object successfully deleted!");
object.remove()
                  })
                  .catch((error) => {
                    console.error("Error deleting document: ", error);
                  });
                //code here ...
              });
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

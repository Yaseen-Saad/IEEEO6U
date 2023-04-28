const params = new URLSearchParams(location.search),
  doc = params.get("doc"),
  collection = params.get("collection");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // const cont = document.querySelector(".remove-section");
    db.collection("registered-events")
      .where("doc", "==", doc)
      .where("collection", "==", collection)
      .get()
      .then((snap) => {
        if (snap.empty) {
          // cont.innerHTML = `<quote>No ${collection} To Show</quote>`;
        }
        snap.forEach((doc) => {
          const element = doc.data();
          console.log(element);
        });
      });
  } else {
    giveAlert("PLEASE SIGN IN AGAIN", "#ff5733", "the developer says", 1);
    setTimeout(() => {
      location.href = "../../";
    }, 3000);
  }
});

const PARAMS = new URLSearchParams(window.location.search);
const doc = PARAMS.get("doc");
const eventSec = document.querySelector("#events #event");
if (doc) {
  db.collection("events")
    .doc(doc)
    .get()
    .then((doc) => {
      const event = doc.data();
      console.log(event);
      const eventImage = document.createElement("img");
      eventImage.src = event.eventImage;

      const eventTitle = document.createElement("h2");
      eventTitle.textContent = event.eventName;
      eventTitle.id = "eventTitle";
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
}
/* 

section id="events">
      <div id="event">
        <img src="../assets/images/techne.jpg" alt="">
        <h2>techne summit cairo</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem delectus vel, praesentium inventore deserunt tempora modi ullam, labore libero, voluptate nemo. Exercitationem earum quidem sequi quasi ad nemo aliquid perspiciatis!</p>
        <div>
            <img src="../../../assets/images/abdelaziz.png" alt="">
            <img src="../../../assets/images/abdelaziz.png" alt="">
            <img src="../../../assets/images/abdelaziz.png" alt="">
            <img src="../../../assets/images/abdelaziz.png" alt="">
            <img src="../../../assets/images/abdelaziz.png" alt="">
            <img src="../../../assets/images/abdelaziz.png" alt="">
            <img src="../../../assets/images/abdelaziz.png" alt="">
        </div>
      </div>
      <div>
        <div class="overlaiers" id="img"></div>
        <div class="overlay overlaiers"></div>
      </div>
    </section>*/

const prevEventsSection = document.querySelector("#prev-projects > div");
const comingEventsSection = document.querySelector("#up-coming-projects > div");
(async () => {
  toggleLoader("this-is-loader");
  pauseAnimation();
})();
const message = document.querySelector("textarea#message"),
  email = document.querySelector("#email"),
  max = document.querySelector("#max"),
  fName = document.querySelector("#first"),
  lName = document.querySelector("#last"),
  form = document.querySelector("#form form"),
  maxWords = 200;
minWords = 10;
document.querySelector("paragraph[for=message]").onclick = () =>
  message.focus();

message.addEventListener("input", function (e) {
  const l = this.value.split(/\w+/).length - 1;
  max.textContent = l;
  max.style.color = "#0a6a9c";
  if (l > maxWords || l < minWords) {
    max.style.color = "red";
  }
});
form.onsubmit = function (e) {
  e.preventDefault();
  if (fName.value) {
    if (lName.value) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
        if (message.value.split(" ").length >= maxWords) {
          giveAlert(
            "You exceeded the maximum number of words, please brief your message"
          );
        } else {
          if (message.value.split(" ").length <= minWords) {
            giveAlert("please enter a valid message");
          } else {
            db.collection("contact")
              .add({
                name: `${fName.value} ${lName.value}`,
                email: email.value,
                message: message.value,
              })
              .then(function (response) {
                giveAlert(
                  "your data has been added successfully, Thank You",
                  "#2ecc71"
                );
              });
          }
        }
      } else {
        giveAlert("please enter a valid email");
      }
    } else {
      giveAlert("please enter Your Last Name");
    }
  } else {
    giveAlert("please enter Your First Name");
  }
};

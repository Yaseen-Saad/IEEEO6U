const firebaseConfig = {
  apiKey: "AIzaSyCaN71Ww3gd_X8C6asvFUDxdzEYZxvgGxo",
  authDomain: "ieeeo6u-ea56d.firebaseapp.com",
  projectId: "ieeeo6u-ea56d",
  storageBucket: "ieeeo6u-ea56d.appspot.com",
  messagingSenderId: "10593373879",
  appId: "1:10593373879:web:7819971067d943a9304732",
  measurementId: "G-XGPTC0VHKT",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

async function view() {
  db.collection("dashBoard")
    .doc("views")
    .update({ data: firebase.firestore.FieldValue.increment(1) });
  sessionStorage.setItem("viewed", true);
}
onload = () => {
  if (!sessionStorage.getItem("viewed")) view();
};
function limitWords(str, maxChars) {
  // remove whitespace at the beginning and end of the string
  str = str.trim();

  // truncate to the maximum character length
  if (str.length > maxChars) {
    return str.substr(0, maxChars) + "...";
  }

  // count the number of words
  return str;
}
function calculateViews() {
  db.collection("dashBoard")
    .doc("views")
    .get()
    .then((snap) => {
      visitors.textContent = snap.data().data;
    });
}
function giveAlert(alert, color, from) {
  return new Promise((resolve, reject) => {
    let body = document.createElement("div"),
      text = document.createElement("p"),
      response = document.createElement("button"),
      admin = document.createElement("p"),
      overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;cursor:pointer;z-index:99998;width:100vw;height:100vh;background-color:#00000030;top:0;left:0;";
    text.textContent = alert;
    response.innerText = "OK";
    admin.textContent = from || "Admins" + " Says";
    response.style.cssText = `width:100px;background-color:${
      color || "#0050b2"
    };padding:5px 10px;cursor:pointer;border:0;align-self:end;border-radius:10px;color:#fff;`;
    body.style.cssText =
      "display:flex;z-index:999999;padding:30px;align-items:start;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-width:90%;background-color:#fff;border-radius:5px;flex-direction:column;justify-content:space-evenly;";

    overlay.addEventListener("click", function () {
      body.remove();
      overlay.remove();
      resolve();
    });
    response.addEventListener("click", function () {
      body.remove();
      overlay.remove();
      resolve();
    });
    body.append(admin, text, response);
    document.body.append(body, overlay);
  });
}

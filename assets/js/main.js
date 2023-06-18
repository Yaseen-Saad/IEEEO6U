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
const db = firebase.firestore();
if (!/dashboard/gi.test(location.href)) {
  const navList = document.querySelector("#NavID");
  const activities = document.querySelector("#activities");

  navList.onclick = (e) => {
    e.preventDefault();
    activities.classList.toggle("active");
    navList.children[0].classList.toggle("active");
  };
}

function toggleLoader(id) {
  const loader = document.querySelector(`#${id}`);
  loader.classList.toggle("active");
}

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

function giveAlert(alert, color, from, clicky, yesNo) {
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
    if (!clicky) {
      overlay.addEventListener("click", function () {
        body.remove();
        overlay.remove();
        if (yesNo) {
          reject()
        }
        resolve();
      });
      response.addEventListener("click", function () {
        body.remove();
        overlay.remove();
        resolve();
      });
    }

    body.append(admin, text);
    if (yesNo) {
      const no = document.createElement("button");
      no.innerText = "No, Don't delete";
      no.style.cssText = `width:120px;background-color:#2ecc71;padding:5px 10px;cursor:pointer;border:0;align-self:end;border-radius:10px;color:#fff;`;
      no.addEventListener("click", function () {
        body.remove();
        overlay.remove();
        reject();
      });
      const res = document.createElement("div");
      response.textContent = 'Yes delete';
      res.append(no, response);
      res.style.cssText = 'display:flex;justify-content:flex-end;gap:10px;width:100%;'
      body.append(res);
    }else{
      body.append(response);
    }
    document.body.append(body, overlay);
  });
}
async function appendEvent(collection, append, neededData) {
  let collectionCondition = db.collection(collection),
    href;
  if (neededData) {
    collectionCondition = collectionCondition
      .where("neededData", "!=", [])
      .orderBy("neededData");
    href = `../register/?doc=`;
  } else {
    collectionCondition = collectionCondition.where("neededData", "==", []);
    href = `./event/?doc=`;
  }
  if (collection == "Projects") {
    href = `./project/?doc=`;
  }
  await collectionCondition
    .orderBy("dateCreated")
    .limit(20)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const event = doc.data(),
          eventArticle = document.createElement("a"),
          eventImage = document.createElement("img"),
          eventImageDiv = document.createElement("div"),
          eventData = document.createElement("div"),
          eventName = document.createElement("h2"),
          eventDescription = document.createElement("p");
        eventArticle.title = "Click To Register";
        if (/.\/event/.test(href)) eventArticle.title = "Click To Show More";
        eventImage.src = event.eventImage;
        eventName.innerHTML = event.eventName;
        eventDescription.innerHTML = limitWords(event.eventDescription, 320);
        eventArticle.href = href + doc.id + `&collection=${collection}`;

        eventData.append(eventName, eventDescription);
        eventImageDiv.append(eventImage);
        eventArticle.append(eventImageDiv, eventData);
        append.append(eventArticle);
      });
    })
    .catch((error) => console.log(error));
}
if (!/dashBoard/gi.test(location.href)) {
  let animation = {
    targets: [".circle-1"],
    translateY: -30,
    translateX: 46,
    direction: "alternate",
    loop: true,
    elasticity: 400,
    easing: "easeInOutQuint",
    duration: 2000,
    delay: 400,
  };
  const circle1 = anime(animation);

  animation.targets = [".circle-2"];
  animation.translateY = 14;
  animation.translateX = -7;
  const circle2 = anime(animation);

  animation.targets = [".circle-3"];
  animation.translateY = -30;
  animation.translateX = -7;
  const circle3 = anime(animation);

  animation.targets = [".circle-4"];
  animation.translateX = -58;
  animation.translateY = 16;
  const circle4 = anime(animation);
  function pauseAnimation() {
    circle1.pause();
    circle2.pause();
    circle3.pause();
    circle4.pause();
  }
}
const committees = [
  "RAS Committee",
  "WIE Committee",
  "CS Committee",
  "SIGHT Committee",
  "HR Committee",
  "Business development Committee",
  "Logistics Committee",
  "MultiMedia Committee",
  "Marketing Committee",
  "Event Management Committee",
  "Training & Development Committee",
  "Fundraising Committee",
  "Entertainment Committee",
  "Multimedia Committee",
];

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    user
      .getIdToken()
      .then((token) => {
        if ((localStorage.getItem(token) - Date.now()) / 1000 <= 0) {
          firebase.auth().signOut();
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
});


const navToggler = document.querySelector('.toggler');

navToggler.addEventListener('click', () =>{
  navToggler.nextElementSibling.classList.toggle('active');
  navToggler.classList.toggle('active');
})
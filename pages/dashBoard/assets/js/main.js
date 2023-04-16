function filesViewer(fileInput, multiple) {
  fileInput.addEventListener("change", async () => {
    const p = fileInput.nextElementSibling.nextElementSibling;
    if (multiple) {
      p.textContent = "";
      for (const file of fileInput.files) {
        p.textContent += fileInput.files.length
          ? `${file.name}, `
          : "No File Selected";
      }
    } else
      p.textContent = fileInput.files.length
        ? fileInput.files[0].name
        : "No File Selected";
  });
}

calculateViews();
filesViewer(document.getElementById("EVENTIMG"), false);
filesViewer(document.getElementById("EVENTIMGs"), true);
filesViewer(document.getElementById("projectsImg"), false);
filesViewer(document.getElementById("projectsImgs"), true);
filesViewer(document.getElementById("officerImage"), false);
filesViewer(document.getElementById("MemberImage"), false);
filesViewer(document.getElementById("partnerImage"), false);
const registrationCheckBoxForEvent = document.getElementById(
    "registrationForEvent"
  ),
  registrationCheckBoxForProject = document.getElementById(
    "registrationForProject"
  ),
  addEventForm = document.querySelector("form#events-form"),
  addProjectForm = document.querySelector("form#projects-form"),
  eventsOptionsContainer = document.createElement("div"),
  projectsOptionsContainer = document.createElement("div"),
  defaultFields = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Whatsapp",
    "LinkedIn",
    "Facebook",
    "Instagram",
    "University",
    "Faculty",
    "Age",
    "Job Title",
    "Committee",
    "Address",
    "Gender",
    "Years Of Experience",
    "TShirt Size",
    "Location",
  ],
  optionalFields = [
    { type: "text", label: "Text" },
    { type: "tel", label: "Phone" },
    { type: "number", label: "Number" },
    { type: "url", label: "URL" },
    { type: "select", label: "Select Box" },
  ];

const handleRegistrationChange = (e, checkBox, form, optionsContainer) => {
  optionsContainer.id = "options";
  optionsContainer.innerHTML = "";
  console.log(checkBox);
  if (checkBox.checked) {
    let html = "";
    for (const field of defaultFields) {
      html += `<div><input type="checkbox" id="${field}"><label for="${field}">${field}</label></div>`;
    }

    html += `<p>Customize Fields</p>`;
    for (const field of optionalFields) {
      html += `
        <div>
          <div>
            <input type="checkbox" id="${field.type}">
            <label for="${field.type}">${field.label}</label>
          </div>
          <input type="text" placeholder="${
            field.type === "select"
              ? "Name, options separated by commas (,)"
              : "Name"
          }">
        </div>
      `;
    }

    optionsContainer.innerHTML = html;
    form.insertBefore(optionsContainer, form.lastElementChild);
  }
};

registrationCheckBoxForEvent.addEventListener("change", () => {
  handleRegistrationChange(
    event,
    registrationCheckBoxForEvent,
    addEventForm,
    eventsOptionsContainer
  );
});
console.log(registrationCheckBoxForProject);
registrationCheckBoxForProject.addEventListener("change", () => {
  handleRegistrationChange(
    event,
    registrationCheckBoxForProject,
    addProjectForm,
    projectsOptionsContainer
  );
});

async function addImagesToDataBase(file, event) {
  const EventimageId = file.name;
  const EventimageRefernce = `events/${event}/${EventimageId}`;

  // connecting the database storage
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child(EventimageRefernce);
  try {
    // Upload the file to Firebase Storage
    const snapshot = await imageRef.put(file);

    // Get the download URL of the uploaded file
    const downloadURL = await snapshot.ref.getDownloadURL();

    // Add the image URL to a document in Firestore
    const docRef = await db.collection("images").add({
      url: downloadURL,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

async function uploadImageToStorage(file, reference) {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child(reference);
  try {
    const snapshot = await imageRef.put(file);
    const downloadUrl = await snapshot.ref.getDownloadURL();
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Error uploading image");
  }
}

async function addDocToCollection(collection, doc) {
  try {
    await db.collection(collection).add(doc);
  } catch (error) {
    console.error("Error adding event to database:", error);
  }
}

async function AddEvent(e) {
  e.preventDefault();
  const eventName = addEventForm.children[1].children[0].value,
    eventDesc = addEventForm.children[2].children[0].value,
    eventImage = addEventForm.children[3].children[0].files[0],
    additionalImages = addEventForm.children[4].children[0].files;
  let neededData = [];
  let event = {};

  // Validate required fields

  if (!eventName) {
    giveAlert("Please enter a valid event name.", "#0a6a9c");
    return;
  }
  if (!eventDesc) {
    giveAlert("Event description cannot be empty.", "#0a6a9c");
    return;
  }
  if (!eventImage) {
    giveAlert("Please choose an event image.", "#0a6a9c");
    return;
  }
  toggleLoader("loader");
  if (registrationCheckBoxForEvent.checked) {
    const getFields = (options) => {
      return options
        .filter((option) => option.checked)
        .map((option) =>
          option.nextSibling.textContent
            .split(" ")
            .map((word) =>
              word.toLowerCase() == word ? word : word.toLowerCase()
            )
            .join("")
        )
        .map((field) => `${field}`);
    };
    neededData = getFields([
      ...document.querySelectorAll("#options > div > input[type=checkbox]"),
    ]);
    const customFields = [
      ...document.querySelectorAll(
        "#options > div > div > input[type=checkbox]"
      ),
    ]
      .map((field) => {
        if (!field.checked) {
          return null;
        }
        const fieldName = field.parentElement.nextElementSibling.value;
        if (!fieldName) {
          giveAlert(
            `You must choose your ${field.nextElementSibling.textContent} name`,
            "#0a6a9c"
          );
          return null;
        }
        if (field.id == "select") {
          const fieldName =
            field.parentElement.nextElementSibling.value.split(",")[0];
          console.log(fieldName);
          let options = field.parentElement.nextElementSibling.value.split(",");
          options.shift();
          options = options.map((option) => option.trim());
          return { type: "dropDown", name: fieldName, options: options };
        } else {
          const fieldType = field.nextElementSibling.textContent
            .split(" ")
            .map((word) =>
              word.toLowerCase() == word ? word : word.toLowerCase()
            )
            .join("");
          return { type: fieldType, name: fieldName };
        }
      })
      .filter((field) => field !== null);
    console.log(customFields);
    neededData.push(...customFields);
  }

  // Upload event image
  const eventImageName = `${eventName}.${eventImage.name.split(".").pop()}`;
  const eventImageReference = `events/${eventName}/${eventImageName}`;
  const eventImageUrl = await uploadImageToStorage(
    eventImage,
    eventImageReference
  );

  // Upload additional images
  const additionalImageUrls = await Promise.all(
    [...additionalImages].map((file) => {
      const additionalImageName = file.name;
      const additionalImageReference = `events/${eventName}/${additionalImageName}`;
      return uploadImageToStorage(file, additionalImageReference);
    })
  );

  // Convert the Markdown to HTML using markdown-it

  eventDesc;
  const md = window.markdownit();

  const HTMLeventDesc = md.render(eventDesc);

  // Update event object

  event.eventName = eventName;
  event.eventDescription = HTMLeventDesc;
  event.eventImage = eventImageUrl;
  event.eventAdditionalImages = additionalImageUrls;
  event.dateCreated = firebase.firestore.FieldValue.serverTimestamp();
  event.neededData = neededData;

  // Add event to database
  await addDocToCollection("events", event);
  toggleLoader("loader");
  giveAlert("event added successfully");
}

addEventForm.addEventListener("submit", AddEvent);

const addOfficerForm = document.querySelector("form#officers-form");

async function AddOfficer(e) {
  e.preventDefault();
  const officerName = addOfficerForm.children[1].children[0].value,
    officerRole = addOfficerForm.children[2].children[0].value,
    officerImage = addOfficerForm.children[3].children[0],
    officerFace = addOfficerForm.children[4].children[0].value,
    officerLinked = addOfficerForm.children[5].children[0].value,
    officerPhone = addOfficerForm.children[6].children[0].value;
  if (!officerName) {
    giveAlert("Please enter a valid officer name.", "#0a6a9c");
    return;
  }
  if (!officerRole) {
    giveAlert("Please enter a valid officer role.", "#0a6a9c");
    return;
  }
  if (!officerImage.value) {
    giveAlert("Please enter a valid officer Image.", "#0a6a9c");
    return;
  }
  if (!officerFace) {
    giveAlert("Please enter a valid officer FaceBook.", "#0a6a9c");
    return;
  }
  if (!officerLinked) {
    giveAlert("Please enter a valid officer Linked In.", "#0a6a9c");
    return;
  }
  if (!officerPhone) {
    giveAlert("Please enter a valid officer Phone.", "#0a6a9c");
    return;
  }
  toggleLoader("loader");
  let officerImageUrl = await uploadImageToStorage(
    officerImage.files[0],
    `officers/${officerName}.${officerImage.files[0].name.split(".").pop()}`
  );
  await addDocToCollection("officers", {
    officerName: officerName,
    officerRole: officerRole,
    officerImage: officerImageUrl,
    officerFace: officerFace,
    officerPhone: officerPhone,
    officerLinked: officerLinked,
  });
  toggleLoader("loader");
  giveAlert("officer added successfully");
}

addOfficerForm.addEventListener("submit", AddOfficer);

const addPartnerForm = document.querySelector("form#partners-form");
async function AddPartner(e) {
  e.preventDefault();

  const partnerName = addPartnerForm.children[1].children[0].value,
    partnerImage = addPartnerForm.children[2].children[0];
  if (!partnerName) {
    giveAlert("Please enter a valid partner name.", "#0a6a9c");
    return;
  }
  if (!partnerImage.value) {
    giveAlert("Please enter a valid partner Image.", "#0a6a9c");
    return;
  }
  toggleLoader("loader");

  const partnerImageUrl = await uploadImageToStorage(
    partnerImage.files[0],
    `partners/${partnerName}.${partnerImage.files[0].name.split(".").pop()}`
  );
  await addDocToCollection("partners", {
    partnerName: partnerName,
    partnerImage: partnerImageUrl,
  });

  toggleLoader("loader");
  giveAlert("partner added successfully");
}
addPartnerForm.addEventListener("submit", AddPartner);

const addBestMemberForm = document.querySelector("form#best-members-form");
async function AddBestMember(e) {
  e.preventDefault();

  const BestMemberName = addBestMemberForm.children[1].children[0].value,
    BestMemberRole = addBestMemberForm.children[2].children[0].value,
    BestMemberImage = addBestMemberForm.children[3].children[0],
    BestMemberFace = addBestMemberForm.children[4].children[0].value,
    BestMemberLinked = addBestMemberForm.children[5].children[0].value,
    BestMemberPhone = addBestMemberForm.children[6].children[0].value;

  if (!BestMemberName) {
    giveAlert("Please enter a valid Member name.", "#0a6a9c");
    return;
  }
  if (!BestMemberRole) {
    giveAlert("Please enter a valid Member committee.", "#0a6a9c");

    return;
  }
  if (!BestMemberImage.value) {
    giveAlert("Please enter a valid Member Image.", "#0a6a9c");
    return;
  }
  if (!BestMemberFace) {
    giveAlert("Please enter a valid Member FaceBook.", "#0a6a9c");
    return;
  }
  if (!BestMemberLinked) {
    giveAlert("Please enter a valid Member Linked In.", "#0a6a9c");
    return;
  }
  if (!BestMemberPhone) {
    giveAlert("Please enter a valid Member Phone.", "#0a6a9c");
    return;
  }
  toggleLoader("loader");

  let BestMemberImageUrl = await uploadImageToStorage(
    BestMemberImage.files[0],
    `BestMembers/${BestMemberName}.${BestMemberImage.files[0].name
      .split(".")
      .pop()}`
  );
  await addDocToCollection("best-members", {
    BestMemberName: BestMemberName,
    BestMemberRole: BestMemberRole,
    BestMemberImage: BestMemberImageUrl,
    BestMemberFace: BestMemberFace,
    BestMemberPhone: BestMemberPhone,
    BestMemberLinked: BestMemberLinked,
  });
  toggleLoader("loader");
  giveAlert("Best Member added successfully");
}
addBestMemberForm.addEventListener("submit", AddBestMember);

async function addProject(e) {
  e.preventDefault();
  const ProjectName = addProjectForm.children[1].children[0].value,
    ProjectDesc = addProjectForm.children[2].children[0].value,
    ProjectImage = addProjectForm.children[3].children[0].files[0],
    additionalImages = addProjectForm.children[4].children[0].files;
  let neededData = [];
  let Project = {};

  // Validate required fields

  if (!ProjectName) {
    giveAlert("Please enter a valid Project name.", "#0a6a9c");
    return;
  }
  if (!ProjectDesc) {
    giveAlert("Event description cannot be empty.", "#0a6a9c");
    return;
  }
  if (!ProjectImage) {
    giveAlert("Please choose an Project image.", "#0a6a9c");
    return;
  }
  toggleLoader("loader");
  if (registrationCheckBoxForProject.checked) {
    const getFields = (options) => {
      return options
        .filter((option) => option.checked)
        .map((option) =>
          option.nextSibling.textContent
            .split(" ")
            .map((word) =>
              word.toLowerCase() == word ? word : word.toLowerCase()
            )
            .join("")
        )
        .map((field) => `${field}`);
    };
    neededData = getFields([
      ...document.querySelectorAll("#options > div > input[type=checkbox]"),
    ]);
    const customFields = [
      ...document.querySelectorAll(
        "#options > div > div > input[type=checkbox]"
      ),
    ]
      .map((field) => {
        if (!field.checked) {
          return null;
        }
        const fieldName = field.parentElement.nextElementSibling.value;
        if (!fieldName) {
          giveAlert(
            `You must choose your ${field.nextElementSibling.textContent} name`,
            "#0a6a9c"
          );
          return null;
        }
        if (field.id == "select") {
          const fieldName =
            field.parentElement.nextElementSibling.value.split(",")[0];
          console.log(fieldName);
          let options = field.parentElement.nextElementSibling.value.split(",");
          options.shift();
          options = options.map((option) => option.trim());
          return { type: "dropDown", name: fieldName, options: options };
        } else {
          const fieldType = field.nextElementSibling.textContent
            .split(" ")
            .map((word) =>
              word.toLowerCase() == word ? word : word.toLowerCase()
            )
            .join("");
          return { type: fieldType, name: fieldName };
        }
      })
      .filter((field) => field !== null);
    console.log(customFields);
    neededData.push(...customFields);
  }

  // Upload event image
  const ProjectImageName = `${ProjectName}.${ProjectImage.name
    .split(".")
    .pop()}`;
  const ProjectImageReference = `ProjectsProject/${ProjectName}/${ProjectImageName}`;
  const ProjectImageUrl = await uploadImageToStorage(
    ProjectImage,
    ProjectImageReference
  );

  // Upload additional images
  const additionalImageUrls = await Promise.all(
    [...additionalImages].map((file) => {
      const additionalImageName = file.name;
      const additionalImageReference = `Projects/${ProjectName}/${additionalImageName}`;
      return uploadImageToStorage(file, additionalImageReference);
    })
  );

  // Convert the Markdown to HTML using markdown-it

  const md = window.markdownit();

  const HTMLeventDesc = md.render(ProjectDesc);

  // Update event object

  Project.eventName = ProjectName;
  Project.eventDescription = HTMLeventDesc;
  Project.eventImage = ProjectImageUrl;
  Project.eventAdditionalImages = additionalImageUrls;
  Project.dateCreated = firebase.firestore.FieldValue.serverTimestamp();
  Project.neededData = neededData;
  console.log(Project);
  // Add event to database
  await addDocToCollection("Projects", Project);
  toggleLoader("loader");
  giveAlert("Project added successfully");
}

addProjectForm.addEventListener("submit", addProject);

function Ticker(elem) {
  elem.lettering();
  this.done = false;
  this.cycleCount = 5;
  this.cycleCurrent = 0;
  this.chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+{}|[]\\;':\"<>?,./`~".split(
      ""
    );
  this.charsCount = this.chars.length;
  this.letters = elem.find("span");
  this.letterCount = this.letters.length;
  this.letterCurrent = 0;

  this.letters.each(function () {
    var $this = $(this);
    $this.attr("data-orig", $this.text());
    $this.text("-");
  });
}

Ticker.prototype.getChar = function () {
  return this.chars[Math.floor(Math.random() * this.charsCount)];
};

Ticker.prototype.reset = function () {
  this.done = false;
  this.cycleCurrent = 0;
  this.letterCurrent = 0;
  this.letters.each(function () {
    var $this = $(this);
    $this.text($this.attr("data-orig"));
    $this.removeClass("done");
  });
  this.loop();
};

Ticker.prototype.loop = function () {
  var self = this;

  this.letters.each(function (index, elem) {
    var $elem = $(elem);
    if (index >= self.letterCurrent) {
      if ($elem.text() !== " ") {
        $elem.text(self.getChar());
        $elem.css("opacity", Math.random());
      }
    }
  });

  if (this.cycleCurrent < this.cycleCount) {
    this.cycleCurrent++;
  } else if (this.letterCurrent < this.letterCount) {
    var currLetter = this.letters.eq(this.letterCurrent);
    this.cycleCurrent = 0;
    currLetter
      .text(currLetter.attr("data-orig"))
      .css("opacity", 1)
      .addClass("done");
    this.letterCurrent++;
  } else {
    this.done = true;
  }

  if (!this.done) {
    requestAnimationFrame(function () {
      self.loop();
    });
  } else {
    setTimeout(function () {
      self.reset();
    }, 750);
  }
};

$words = $(".word");

$words.each(function () {
  var $this = $(this),
    ticker = new Ticker($this).reset();
  $this.data("ticker", ticker);
});

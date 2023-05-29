const urlParams = new URLSearchParams(window.location.search),
  doc = urlParams.get("doc"),
  collection = urlParams.get("collection");
document.querySelectorAll("nav .active").forEach((li) => {
  li.classList.remove("active");
  document.querySelector("nav ul :has(#NavID)").classList.add("active");
});
if (collection == "Projects")
  document
    .querySelector("nav ul li #activities p:last-child")
    .classList.add("active");
else if (collection == "events")
  document
    .querySelector("nav ul li #activities p:first-child")
    .classList.add("active");
else if (collection == "Workshops")
  document
    .querySelector("nav ul li #activities p:nth-child(2)")
    .classList.add("active");

if (doc) {
  (async () => {
    db.collection(collection)
      .doc(doc)
      .get()
      .then((doc) => {
        const data = doc.data();
        const realForm = document.forms[0];
        const form = document.querySelector("form > div");

        const eventName = document.createElement("h2"),
          eventDescription = document.createElement("p"),
          eventImage = document.createElement("img");
        eventImage.src = data.eventImage;
        eventName.textContent = "Meet Us At " + data.eventName;
        eventDescription.innerHTML = data.eventDescription;

        eventDescription.id = "EventDesc";

        realForm.prepend(eventImage);

        form.append(eventName, eventDescription);
        let neededData = data.neededData;
        neededData.map((key) => {
          let filed = document.createElement("div"),
            input = document.createElement("input"),
            label = document.createElement("label");
          input.type = "text";
          input.required = "required";

          if (key === "tshirtsize") {
            let filed = document.createElement("div"),
              select = document.createElement("div"),
              defualt = document.createElement("p"),
              box = document.createElement("div"),
              label = document.createElement("p");
            select.classList.add("select");
            box.classList.add("select-box");
            defualt.id = "default_option";
            defualt.textContent = "Small";
            label.textContent = `Your T-Shirt Size :`;
            label.onclick = select.click();
            label.style.cursor = "pointer";
            select.onclick = (e) => {
              if (e.target.tagName == "P") {
                defualt.textContent = e.target.textContent;
                select.setAttribute("value", e.target.textContent);
              }
              box.classList.toggle("active");
              onclick = (e) => {
                if (!select.contains(e.target)) box.classList.remove("active");
              };
            };
            [
              "XSmall",
              "Small",
              "Medium",
              "Large",
              "Xlarge",
              "XXlarge",
              "3Xlarge",
              "4Xlarge",
            ].map((option, i) => {
              let op = document.createElement("p");
              op.textContent = option;
              box.append(op);
            });
            // label.textContent = "Your " + inputFiled.name;
            select.append(defualt, box);
            filed.append(label, select);
            filed.setAttribute("fieldType", key);
            form.append(filed);
            form.append(document.createElement("hr"));
            return;
          }
          if (key === "location") {
            let data = GOVERNRATES;
            let fieldgov = document.createElement("div"),
              selectGov = document.createElement("div"),
              selectGovdefualt = document.createElement("p"),
              selectGovbox = document.createElement("div");
            selectGov.classList.add("select");
            selectGovbox.classList.add("select-box");
            selectGovdefualt.id = "default_option";
            selectGovdefualt.textContent = "القاهرة";
            let = Govlabel = document.createElement("p");
            Govlabel.textContent = `Your governorate :`;
            Govlabel.onclick = selectGov.click();
            Govlabel.style.cursor = "pointer";
            selectGov.append(selectGovdefualt, selectGovbox);
            fieldgov.append(Govlabel);
            fieldgov.append(selectGov);
            fieldgov.setAttribute("fieldType", "governorate");
            form.append(fieldgov);
            form.append(document.createElement("hr"));

            data.governorates.map((ele) => {
              let op = document.createElement("p");
              op.textContent = ele.governorate_name_ar;
              op.value = ele.id;
              selectGovbox.append(op);
            });
            let field = document.createElement("div"),
              select = document.createElement("div"),
              defualt = document.createElement("p"),
              box = document.createElement("div"),
              label = document.createElement("p");
            select.classList.add("select");
            box.classList.add("select-box");
            defualt.id = "default_option";
            defualt.textContent = "الشيخ زايد";
            label.textContent = `Your City :`;
            label.onclick = select.click();
            label.style.cursor = "pointer";
            select.onclick = (e) => {
              if (e.target.tagName == "P") {
                defualt.textContent = e.target.textContent;
                select["value"] = e.target.value;
              }
              box.classList.toggle("active");
              onclick = (e) => {
                if (!select.contains(e.target)) box.classList.remove("active");
              };
            };
            let first = 1;
            for (const city of data.cities) {
              if (city.governorate_id != 1) continue;
              else {
                if (first) {
                  first = !first;
                  defualt.textContent = city.city_name_ar;
                }
              }
              let option = document.createElement("p");
              option.textContent = city.city_name_ar;
              option.value = city.city_name_en;
              box.append(option);
            }
            selectGov.onclick = function (e) {
              if (e.target.tagName == "P") {
                selectGovdefualt.textContent = e.target.textContent;
                selectGov["value"] = e.target.value;
              }
              selectGovbox.classList.toggle("active");
              onclick = (e) => {
                if (!selectGov.contains(e.target))
                  selectGovbox.classList.remove("active");
              };

              box.innerHTML = "";
              let first = 1;
              for (const city of data.cities) {
                if (city.governorate_id != this.value) continue;
                else {
                  if (first) {
                    first = !first;
                    defualt.textContent = city.city_name_ar;
                  }
                }
                let option = document.createElement("p");
                option.textContent = city.city_name_ar;
                option.value = city.city_name_en;
                box.append(option);
              }
            };
            select.append(defualt, box);
            field.append(label, select);
            field.setAttribute("fieldType", "city");
            form.append(field);
            form.append(document.createElement("hr"));
            return;
          }
          if (key.type == "dropDown") {
            let field = document.createElement("div"),
              select = document.createElement("div"),
              defualt = document.createElement("p"),
              box = document.createElement("div"),
              label = document.createElement("p");
            select.classList.add("select");
            box.classList.add("select-box");
            defualt.id = "default_option";
            defualt.textContent = key.options[0];
            label.textContent = `Your ${key.name} :`;
            label.onclick = select.click();
            label.style.cursor = "pointer";

            select.onclick = (e) => {
              if (e.target.tagName == "P") {
                defualt.textContent = e.target.textContent;
                select.setAttribute("value", e.target.textContent);
              }
              box.classList.toggle("active");
              onclick = (e) => {
                if (!select.contains(e.target)) box.classList.remove("active");
              };
            };
            key.options.sort();
            key.options.map((option, i) => {
              let op = document.createElement("p");
              op.textContent = option;
              box.append(op);
            });
            select.append(defualt, box);
            field.append(label, select);
            field.setAttribute("fieldType", key.name);
            form.append(field);
            form.append(document.createElement("hr"));
            return;
          }
          if (
            key === "firstname" ||
            key === "lastname" ||
            key === "university" ||
            key === "faculty" ||
            key === "committee" ||
            key === "jobtitle" ||
            key === "address"
          ) {
            label.textContent = "Your ";
            if (key === "lastname") {
              label.textContent += " Last Name";
            } else if (key === "firstname") {
              label.textContent += " First Name";
            } else if (key === "university") {
              label.textContent += " University";
            } else if (key === "faculty") {
              label.textContent += " Faculty";
            } else if (key === "committee") {
              label.textContent += " Committee";
            } else if (key === "jobtitle") {
              label.textContent += " Job Title";
            } else if (key === "address") {
              label.textContent += " Address";
            }
          }

          if (key === "email") label.textContent = "Your Email";

          if (key === "phone" || key === "whatsapp" || key.type == "phone") {
            label.textContent = "Your ";
            if (key === "phone") {
              label.textContent += " Phone Number";
            } else if (key === "whatsapp") {
              label.textContent += " whatsapp Number";
            } else {
              label.textContent += key.name;
            }
          }

          if (key === "linkedin")
            label.textContent = "Your linkedin Profile URL";

          if (key === "facebook")
            label.textContent = "Your FaceBook Profile URL";

          if (key === "instagram")
            label.textContent = "Your instagram Profile URL";

          if (key === "yearsofexperience") {
            input.type = "number";
            label.textContent = "Your Years Of Experince";
          }

          if (key.type) label.textContent = "Your " + key.name;

          filed.setAttribute(
            "fieldType",
            typeof key == "object" ? key.type : key
          );
          filed.append(input, label);
          form.append(filed);
          form.append(document.createElement("hr"));
        });
        let button = document.createElement("button");
        button.textContent = "Meet Us";
        button.id = "register";
        form.lastElementChild.insertAdjacentElement("afterend", button);
      })
      .then(async () => {
        document
          .getElementById("register")
          .addEventListener("click", async (e) => {
            e.preventDefault();
            const keys = [...document.querySelectorAll("form > div >div")].map(
              (ele) => ele.getAttribute("fieldtype")
            );
            // form > div > input > value
            const userData = [...document.querySelectorAll("form > div > div")]
              .concat([...document.querySelectorAll("form>div>input")])
              .map((ele) => {
                if (ele.querySelector("p")) {
                  return ele.querySelector("#default_option").textContent;
                }
                return ele.querySelector("input").value;
              })
              .reduce(
                (acc, key, index) => ({ ...acc, [keys[index]]: key }),
                {}
              );

            let validated = true;
            const alertMessage = "Please Enter ";
            for (const input of document.querySelectorAll(
              "form >div div input"
            )) {
              const field = input.parentNode.getAttribute("fieldType");
              if (
                field === "firstname" ||
                field === "lastname" ||
                field === "university" ||
                field === "faculty" ||
                field === "committee" ||
                field === "jobtitle" ||
                field === "address"
              ) {
                if (input.value == "") {
                  giveAlert(
                    alertMessage + input.nextElementSibling.textContent
                  );
                  validated = 0;
                  return;
                }
              } else if (field === "email") {
                if (
                  !/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
                    input.value
                  )
                ) {
                  giveAlert(
                    alertMessage + input.nextElementSibling.textContent
                  );
                  validated = 0;
                  return;
                }
              } else if (
                field === "phone" ||
                field === "whatsapp" ||
                field === "phone"
              ) {
                if (input.value.length < 11) validated = 0;
              } else if (field === "linkedin")
                if (
                  !/^https?:\/\/(www\.)?linkedin\.com\/(in|profile)\/[a-z0-9_-]+\/?$/i.test(
                    input.value
                  )
                ) {
                  giveAlert(
                    alertMessage + input.nextElementSibling.textContent
                  );
                  validated = 0;
                  return;
                } else if (field === "facebook") {
                  if (
                    !/^https?:\/\/(www\.)?facebook\.com\/[a-z0-9\.]+\/?$/i.test(
                      input.value
                    )
                  ) {
                    giveAlert(
                      alertMessage + input.nextElementSibling.textContent
                    );
                    validated = 0;
                    return;
                  }
                } else if (field === "instagram") {
                  if (
                    !/^https?:\/\/(www\.)?instagram\.com\/[a-z0-9_\.]+\/?$/i.test(
                      input.value
                    )
                  ) {
                    giveAlert(
                      alertMessage + input.nextElementSibling.textContent
                    );
                    validated = 0;
                    return;
                  }
                } else if (field === "yearsofexperience") {
                  if (Number(input.value) > 0 && Number(input.value) % 1 == 0) {
                    giveAlert(
                      alertMessage + input.nextElementSibling.textContent
                    );
                    validated = 0;
                    return;
                  }
                } else if (field == "text" || field == "number") {
                  if (!input.value) {
                    giveAlert(
                      alertMessage + input.nextElementSibling.textContent
                    );
                    validated = 0;
                    return;
                  }
                } else if (field == "url")
                  if (!/^https?:\/\/\w+/.test(input.value)) {
                    giveAlert(
                      alertMessage + input.nextElementSibling.textContent
                    );
                    validated = 0;
                    return;
                  }
            }
            if (!validated) {
              giveAlert("Please Fill Out all the fields");
            } else {
              db.collection("registered-events").add({
                ...userData,
                doc: doc,
                collection: collection,
                registeredTime: new Date(Date.now()).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  }
                ),
              });
              giveAlert(
                "your data has been added successfully, see you soon",
                "#2ecc71"
              );
              setTimeout(() => {
                location.reload();
              }, 3000);
            }
          });
      });
    toggleLoader("this-is-loader");
    pauseAnimation();
  })();
}

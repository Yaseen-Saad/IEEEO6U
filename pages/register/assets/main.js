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
            fieldgov.append(selectGov);
            form.append(Govlabel, fieldgov);
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
            input.onblur = (e) => {
              if (/\d/.test(input.value)) validated = false;
            };
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

          if (key === "email") {
            label.textContent = "Your Email";
            input.onblur = (e) => {
              if (
                !/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
                  input.value
                )
              )
                validated = false;
            };
          }
          if (key === "phone" || key === "whatsapp" || key.type == "phone") {
            label.textContent = "Your ";
            input.onblur = (e) => {
              if (input.value.length < 11) validated = false;
            };
            if (key === "phone") {
              label.textContent += " Phone Number";
            } else if (key === "whatsapp") {
              label.textContent += " whatsapp Number";
            } else {
              label.textContent += key.name;
            }
          }

          if (key === "linkedin") {
            label.textContent = "Your linkedin Profile URL";
            input.onblur = (e) => {
              if (
                !/^https?:\/\/(www\.)?linkedin\.com\/(in|profile)\/[a-z0-9_-]+\/?$/i.test(
                  input.value
                )
              )
                validated = false;
            };
          }
          if (key === "facebook") {
            label.textContent = "Your FaceBook Profile URL";
            input.onblur = (e) => {
              if (
                !/^https?:\/\/(www\.)?facebook\.com\/[a-z0-9\.]+\/?$/i.test(
                  input.value
                )
              ) {
              }
            };
          }
          if (key === "instagram") {
            label.textContent = "Your instagram Profile URL";
            input.onblur = (e) => {
              if (
                !/^https?:\/\/(www\.)?instagram\.com\/[a-z0-9_\.]+\/?$/i.test(
                  input.value
                )
              )
                validated = false;
            };
          }

          if (key === "yearsofexperience") {
            input.onblur = (e) => {
              if (Number(input.value) > 0 && Number(input.value) % 1 == 0)
                validated = false;
            };
            input.type = "number";
            label.textContent = "Your Years Of Experince";
          }

          if (key.type == "text") {
            input.onblur = () => {
              if (!input.value) validated = false;
            };
            label.textContent = "Your " + key.name;
          }
          if (key.type == "number") {
            input.onblur = (e) => {
              if (!input.value) validated = false;
            };
            input.type = "number";
            label.textContent = "Your " + key.name;
          }

          if (key.type == "url") {
            label.textContent = "Your " + key.name;
            input.onblur = (e) => {
              if (!/^https?:\/\/\w+/.test(input.value)) validated = false;
            };
          }

          filed.append(input, label);
          form.append(filed);
          form.append(document.createElement("hr"));
        });
        let button = document.createElement("button");
        button.textContent = "Meet Us";
        form.lastElementChild.insertAdjacentElement("afterend", button);
      });
  toggleLoader("this-is-loader");
  pauseAnimation();
  })();
}

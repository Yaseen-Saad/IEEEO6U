const params = new URLSearchParams(location.search),
  doc = params.get("doc"),
  collection = params.get("collection");
function deleteDoc(button) {
  const doc = button.getAttribute("doc");
  giveAlert(
    "are you sure you want to delete this document?",
    "#e92929",
    "",
    "",
    true
  ).then(() => {
    db.collection(collection).doc(doc).delete();
    button.parentNode.parentNode.remove();
  });
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    (async () => {
      const tableData = document.querySelector(".table-data");

      const wb = new ExcelJS.Workbook();

      // create worksheet 1
      const ws1 = wb.addWorksheet("Data");
      let sortingArray;
      if (!doc && collection == "contact") {
        await db
          .collection(collection)
          .get()
          .then(async (snap) => {
            if (snap.empty) {
              document.querySelector(
                ".table-data"
              ).innerHTML = `<quote>No Data To Show</quote>`;
            } else {
              registries.textContent = snap.size;
              let id = 1;
              snap.forEach((doc, i) => {
                const element = doc.data();
                let keys = Object.keys(element);
                if (id == 1) {
                  keys = keys.filter(
                    (key) => key != "collection" && key != "doc"
                  );
                  keys.sort((a, b) => a - b);
                  sortingArray = keys;
                  const headerValues = ["id", ...sortingArray];
                  const table = document.createElement("table");
                  const thead = document.createElement("thead");
                  const tr = document.createElement("tr");
                  for (let i = 0; i < headerValues.length; i++) {
                    const th = document.createElement("th");
                    th.textContent = headerValues[i];
                    tr.appendChild(th);
                  }
                  const tableColumn = document.createElement("td");
                  tableColumn.textContent = "DELETE";
                  tr.appendChild(tableColumn);
                  thead.appendChild(tr);
                  table.appendChild(thead);
                  // add tbody section
                  const tbody = document.createElement("tbody");
                  table.appendChild(tbody);
                  tableData.appendChild(table);
                  // set horizontal alignment of cells in first row to "center"
                  const row = ws1.addRow(headerValues);
                  row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center" };
                  });
                }
                const tbody = document.querySelector("tbody");
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${id}</td>${sortingArray
                  .map((key) => "<td>" + element[key] + "</td>")
                  .join("")}`;
                tr.innerHTML += `<td><button class='delete-button' onclick=deleteDoc(this) doc='${doc.id}'>DELETE </button></td>`;
                tbody.appendChild(tr);
                ws1.addRow([id, ...keys.map((key) => element[key])]);
                id++;
              });
            }
          });
        // set column width based on longest cell value
        ws1.columns.forEach((column) => {
          const columnWidth = column.values.reduce(
            (acc, value) => Math.max(acc, value.toString().length),
            0
          );
          columnWidth > 0 && (column.width = columnWidth + 2);
        });
        document
          .querySelector(".download-button")
          .addEventListener("click", () =>
            wb.xlsx.writeBuffer().then((buffer) => {
              saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `contacts.xlsx`
              );
            })
          );
      } else {
        await db
          .collection(collection)
          .doc(doc)
          .get()
          .then(async (data) => {
            const event = data.data();
            document.querySelector(".event h2").textContent = event.eventName;
            document.querySelector(".event img").src = event.eventImage;

            await db
              .collection("registered-events")
              .where("doc", "==", doc)
              .where("collection", "==", collection)
              .get()
              .then((snap) => {
                if (snap.empty) {
                  document.querySelector(
                    ".table-data"
                  ).innerHTML = `<quote>No Data To Show</quote>`;
                } else {
                  registries.textContent = snap.size;
                  let id = 1;
                  snap.forEach((doc, i) => {
                    const element = doc.data();
                    let keys = Object.keys(element);
                    if (id == 1) {
                      keys = keys.filter(
                        (key) => key != "collection" && key != "doc"
                      );
                      keys.sort((a, b) => a - b);
                      sortingArray = keys;
                      const headerValues = ["id", ...sortingArray];
                      const table = document.createElement("table");
                      const thead = document.createElement("thead");
                      const tr = document.createElement("tr");
                      for (let i = 0; i < headerValues.length; i++) {
                        const th = document.createElement("th");
                        th.textContent = headerValues[i];
                        tr.appendChild(th);
                      }
                      thead.appendChild(tr);
                      table.appendChild(thead);
                      // add tbody section
                      const tbody = document.createElement("tbody");
                      table.appendChild(tbody);
                      tableData.appendChild(table);
                      // set horizontal alignment of cells in first row to "center"
                      const row = ws1.addRow(headerValues);
                      row.eachCell((cell) => {
                        cell.alignment = { horizontal: "center" };
                      });
                    }
                    const tbody = document.querySelector("tbody");
                    const tr = document.createElement("tr");
                    tr.innerHTML = `<td>${id}</td>${sortingArray
                      .map((key) => "<td>" + element[key] + "</td>")
                      .join("")}`;
                    tbody.appendChild(tr);
                    ws1.addRow([id, ...keys.map((key) => element[key])]);

                    id++;
                  });
                }
              });

            // set column width based on longest cell value
            ws1.columns.forEach((column) => {
              const columnWidth = column.values.reduce(
                (acc, value) => Math.max(acc, value.toString().length),
                0
              );
              columnWidth > 0 && (column.width = columnWidth + 2);
            });
            document
              .querySelector(".download-button")
              .addEventListener("click", () =>
                wb.xlsx.writeBuffer().then((buffer) => {
                  saveAs(
                    new Blob([buffer], { type: "application/octet-stream" }),
                    `${event.eventName}.xlsx`
                  );
                })
              );
          });
      }
    })();
  } else {
    giveAlert("PLEASE SIGN IN AGAIN", "#ff5733", "the developer says", 1);
    setTimeout(() => {
      location.href = "../../../";
    }, 3000);
  }
});

const submit = document.getElementById("unique_button");
async function authorized() {
  document.body.innerHTML = `
    <section class="right">
      <div class="overview">
        <article>
          <i class="fa fa-eye"></i> <span id="visitors"></span>Total Visitors
        </article>
        <article>
          <i class="fa fa-users"></i> <span>00999</span>total members
        </article>
        <article>
          <i class="fa-solid fa-envelope"></i> <span id="registries">99900</span>total
          registrations
        </article>
        <article><i class="fa fa-user"></i> <span>90909</span> sample</article>
      </div>
      <section class="sections">
        <a href="./pages/add/">
          <article class="card">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
              />
            </svg>
            <p>add</p>
          </article>
        </a>
        <a href="./pages/remove/">
          <article class="card">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
              />
            </svg>
            <p>remove</p>
          </article>
        </a>
        <a href="./pages/edit/">
          <article class="card">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
              />
            </svg>
            <p>edit</p>
          </article>
        </a>
        <a href="./pages/registered/">
          <article class="card">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <path
                d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"
              />
            </svg>
            <p>registered data</p>
          </article>
        </a>
      </section>
    </section>
    `;
  async function calculateViews() {
    db.collection("dashBoard")
      .doc("views")
      .get()
      .then((snap) => {
        visitors.textContent = snap.data().data;
      });
  }

  calculateViews();

  async function registered() {
    return await db
      .collection("registered-events")
      .get()
      .then((query) => query.size);
  }

  registries.textContent = await registered();
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    authorized();
  }
});
submit.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.forms[0].children[0].value,
    password = document.forms[0].children[1].value;

  // Set the expiration time to 30 minutes
  const expiresIn = 3600;

  // Sign in the user with Firebase Auth
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Get the user and token result
      const user = userCredential.user;
      user.getIdTokenResult().then((idTokenResult) => {
        // Calculate the expiration time
        const authTime = idTokenResult.authTime;
        const date = new Date(authTime);
        localStorage.setItem(
          idTokenResult.token,
          date.setMilliseconds(date.getMilliseconds() + expiresIn * 1000)
        );
      });
    })
    .catch((error) => {
      giveAlert(error.message, "#e92929");
    });
});

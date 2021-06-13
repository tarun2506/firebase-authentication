// Add admin cloud  function:
const adminForm = document.querySelector(".admin-actions");

adminForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const adminEmail = document.querySelector("#admin-email").value;
  const addAdminRole = functions.httpsCallable("addAdminRole");
  addAdminRole({ email: adminEmail }).then((result) => {
    console.log(result);
  });
});

// listen to auth state change:
auth.onAuthStateChanged((user) => {
  if (user) {
    user.getIdTokenResult().then((idTokenResult) => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    // getting  data:
    db.collection("guides").onSnapshot(
      (snapshot) => {
        setupGuides(snapshot.docs);
      },
      (error) => {
        console.log(error.message);
      }
    );
  } else {
    setupUI();
    setupGuides([]);
  }
});

// Create new Guide:
const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("guides")
    .add({
      title: createForm["title"].value,
      content: createForm["content"].value,
    })
    .then(() => {
      // close the  modal & reset the form:
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch((error) => {
      console.log(error.message);
    });
});

// Signup:
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get  user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  // Signup the user:
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((credential) => {
      return db.collection("users").doc(credential.user.uid).set({
        bio: signupForm["signup-bio"].value,
      });
    })
    .then(() => {
      // Close the signup modal and reset the form:
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
      signupForm.querySelector(".error").innerHTML = "";
    })
    .catch((err) => {
      signupForm.querySelector(".error").innerText = err.message;
    });
});

// logout:
const logOut = document.querySelector("#logout");
logOut.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut();
});

// Login:
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get the user info:
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  // Signin/login the user:
  auth
    .signInWithEmailAndPassword(email, password)
    .then((credential) => {
      // Close the login modal and reset the form:
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    })
    .catch((err) => {
      loginForm.querySelector(".error").innerText = err.message;
    });
});

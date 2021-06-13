const guideList = document.querySelector(".guides");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accDetails = document.querySelector(".account-details");
const adminItems = document.querySelectorAll(".admin");
// setup the UI:
const setupUI = (user) => {
  if (user) {
    if (user.admin) {
      adminItems.forEach((item) => {
        item.style.display = "block";
      });
    }
    // acc info:
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        const html = `
    <div>Logged in as ${user.email}</div>
    <div>Bio is ${doc.data().bio}</div>
    <div class='pink-text'>${user.admin ? "Admin" : ""}</div>
    `;
        accDetails.innerHTML = html;
      });

    // toggle UI elements:
    loggedInLinks.forEach((link) => {
      return (link.style.display = "block");
    });
    loggedOutLinks.forEach((link) => {
      return (link.style.display = "none");
    });
  } else {
    adminItems.forEach((item) => {
      item.style.display = "none";
    });
    // hide acc info:
    accDetails.innerHTML = "";
    // toggle UI elements:
    loggedInLinks.forEach((link) => {
      return (link.style.display = "none");
    });
    loggedOutLinks.forEach((link) => {
      return (link.style.display = "block");
    });
  }
};

// setup the guides:
const setupGuides = (data) => {
  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      const guide = doc.data();
      const li = `
    <li>
    <div class="collapsible-header grey lighten-4">${guide.title}</div> 
    <div class="collapsible-body white">${guide.content}</div> 
    </li>
    `;
      html += li;
    });
    guideList.innerHTML = html;
  } else {
    guideList.innerHTML = `<h2 class='center-align' >CRY MOREEEE KID, YOU ARE NOT LOGGED IN!</h2>`;
  }
};

// setup materialize components:
document.addEventListener("DOMContentLoaded", function () {
  let modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  let items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});

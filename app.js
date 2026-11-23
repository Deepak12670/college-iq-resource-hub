
// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxiKCLVtciRewOQQqm5nGLurDh-YpUTCV67NMlJvziXfUfmeSKR7I8lqA11BjWPIcc/exec";

// Google Drive resource folder links
const RESOURCE_LINKS = {
  "1st Year": "https://drive.google.com/drive/folders/1JhxT7_70RPfrdFfncopX2m-WIHjhXO9q?usp=drive_link",
  "2nd Year": "https://drive.google.com/drive/folders/1mJgbqlAMa-nBQYz7uQ4laq6Y9-leEc_p?usp=drive_link"
};


// TOP 20 COLLEGES
const colleges = [
  ["JNTUH College of Engineering, Hyderabad","Kukatpally, Hyderabad"],
  ["University College of Engineering, Osmania University","Hyderabad, Telangana"],
  ["Chaitanya Bharathi Institute of Technology","Gandipet, Hyderabad"],
  ["VNR Vignana Jyothi Institute of Engineering & Technology","Bachupally, Hyderabad"],
  ["Vasavi College of Engineering","Ibrahim Bagh, Hyderabad"],
  ["CVR College of Engineering","Ibrahimpatnam, Hyderabad"],
  ["Gokaraju Rangaraju Institute of Engineering & Technology","Bachupally, Hyderabad"],
  ["Keshav Memorial Institute of Technology","Narayanguda, Hyderabad"],
  ["G Narayanamma Institute of Technology & Science","Shaikpet, Hyderabad"],
  ["Mahatma Gandhi Institute of Technology","Gandipet, Hyderabad"],
  ["Sreenidhi Institute of Science and Technology","Ghatkesar, Hyderabad"],
  ["M V S R Engineering College","Nadergul, Hyderabad"],
  ["B V Raju Institute of Technology","Narsapur, Telangana"],
  ["Vardhaman College of Engineering","Shamshabad, Hyderabad"],
  ["Neil Gogte Institute of Technology","Kachiguda, Hyderabad"],
  ["Anurag University","Ghatkesar, Hyderabad"],
  ["Institute of Aeronautical Engineering","Dundigal, Hyderabad"],
  ["CMR College of Engineering & Technology","Kandlakoya, Hyderabad"],
  ["MLR Institute of Technology","Dundigal, Hyderabad"],
  ["Vidya Jyothi Institute of Technology","Aziz Nagar, Hyderabad"]
];


// PAGE NAVIGATION
function showPage(pageId) {

  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });

  const target = document.getElementById(pageId);

  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll(".nav-link[data-page]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === pageId
    );
  });

  document.querySelector(".nav").classList.remove("open");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// LOGOUT
function logout() {

  const form = document.getElementById("leadForm");

  if (form) {
    form.reset();
  }

  const message = document.getElementById("formMessage");

  if (message) {
    message.textContent = "";
  }

  showPage("home");
}


// DISPLAY COLLEGES
const collegeList = document.getElementById("collegeList");

if (collegeList) {

  collegeList.innerHTML = colleges.map((c, i) => `
    <article class="college-item">
      <span class="college-number">
        ${String(i + 1).padStart(2, "0")}
      </span>

      <div>
        <h3>${c[0]}</h3>
        <p>${c[1]}</p>
      </div>
    </article>
  `).join("");

}


// DISPLAY CURRENT YEAR
const yearNow = document.getElementById("yearNow");

if (yearNow) {
  yearNow.textContent = new Date().getFullYear();
}


// STUDENT REGISTRATION FORM
const leadForm = document.getElementById("leadForm");

if (leadForm) {

  leadForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const years = [
      ...leadForm.querySelectorAll('input[name="year"]:checked')
    ].map(input => input.value);

    const message = document.getElementById("formMessage");
    const button = document.getElementById("submitBtn");

    // Validate year selection
    if (years.length === 0) {

      message.style.color = "#dc2626";
      message.textContent = "Please select at least one Intermediate year.";

      return;
    }

    // Validate Google Apps Script URL
    if (!GOOGLE_SCRIPT_URL.endsWith("/exec")) {

      message.textContent = "Please check your Google Apps Script URL.";

      return;
    }

    // Collect student details
    const data = {

      name: document.getElementById("name").value.trim(),

      email: document.getElementById("email").value.trim(),

      phone: document.getElementById("phone").value.trim(),

      years: years.join(", "),

      college: "",
      address: "",
      parentName: "",
      parentPhone: "",

      consent: "Yes",

      submittedAt: new Date().toISOString()

    };

    button.disabled = true;
    button.textContent = "Opening your resources...";

    message.style.color = "#1769D2";
    message.textContent = "Preparing your study toolkit...";

    // Save student information for the resources page
    try {
      sessionStorage.setItem("mpcStudent", JSON.stringify(data));
    } catch (error) {
      console.error("Unable to save session data:", error);
    }

    // Start Google Sheets submission in the background
    try {

      const submission = fetch(GOOGLE_SCRIPT_URL, {

        method: "POST",

        mode: "no-cors",

        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },

        body: new URLSearchParams(data).toString(),

        keepalive: true

      });

      submission.catch(error => {
        console.error("Google Sheets submission error:", error);
      });

    } catch (error) {

      console.error("Registration request error:", error);

    }

    // Open toolkit approximately 1 second after clicking
    setTimeout(() => {

      window.location.href =
        "resources.html?years=" +
        encodeURIComponent(years.join(","));

    }, 1000);

  });

}

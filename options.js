const form = document.getElementById("profile-form");
const status = document.getElementById("status");

const defaultProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  currentTitle: "",
  currentCompany: "",
  experienceYears: "",
  educationLevel: "",
  portfolioUrl: "",
  skills: "",
  gender: "",
  race: "",
  ethnicity: "",
  disabilityStatus: "",
  veteranStatus: "",
  customFields: {}
};

function readFormData() {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function populateForm(profile) {
  Object.entries(profile).forEach(([key, value]) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) {
      input.value = value ?? "";
    }
  });
}

function showStatus(message) {
  status.textContent = message;
  window.setTimeout(() => {
    status.textContent = "";
  }, 2500);
}

async function loadProfile() {
  const result = await chrome.storage.sync.get("profile");
  populateForm({ ...defaultProfile, ...result.profile });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const profile = { ...defaultProfile, ...readFormData() };
  await chrome.storage.sync.set({ profile });
  showStatus("Profile saved.");
});

loadProfile();

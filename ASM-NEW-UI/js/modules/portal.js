// This local profile stores a name and email, never a password.
const profileKey = "asmNextGenDemoProfiles";
const sessionKey = "asmNextGenDemoSession";
const loginForm = document.querySelector("#portal-login");
const registerForm = document.querySelector("#portal-register");
const formPanel = document.querySelector("#portal-form-panel");
const profilePanel = document.querySelector("#portal-profile");
const status = document.querySelector("#portal-status");

// Read the browser-stored profiles and report malformed or unavailable data.
function readProfiles() {
  try {
    const profiles = JSON.parse(localStorage.getItem(profileKey) || "[]");
    if (!Array.isArray(profiles)) throw new TypeError("Profile data should be a list");
    return profiles;
  } catch (error) {
    // Show a visible error and stop profile actions when saved data is unreadable.
    console.error("Could not read local profiles:", error);
    status.classList.add("error");
    status.textContent = "Saved profile data could not be read. Clear this site's browser data to reset.";
    return null;
  }
}

// Switch between the local sign-in and profile-creation forms.
function changeMode(mode) {
  const showRegister = mode === "register";
  loginForm.hidden = showRegister;
  registerForm.hidden = !showRegister;
  // Update every tab's selected styling and accessibility state.
  document.querySelectorAll("[data-mode]").forEach((button) => {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  status.textContent = "";
}

// Save the local session and display the selected profile.
function startSession(profile) {
  try {
    localStorage.setItem(sessionKey, JSON.stringify({ email: profile.email }));
    document.querySelector("#profile-name").textContent = profile.name;
    document.querySelector("#profile-program").textContent = profile.program;
    formPanel.hidden = true;
    profilePanel.hidden = false;
  } catch (error) {
    // Report that the profile view could not be backed by a saved browser session.
    console.error("Could not save the local session:", error);
    status.classList.add("error");
    status.textContent = "This browser could not save the local session.";
  }
}

// Connect each profile tab to its matching form mode.
document.querySelectorAll("[data-mode]").forEach((button) => {
  // Display the form selected by this tab.
  button.addEventListener("click", () => changeMode(button.dataset.mode));
});

// Validate a new local profile and save it in this browser.
registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const profiles = readProfiles();
  if (!profiles) return;
  const data = new FormData(registerForm);
  const profile = {
    name: String(data.get("name")).trim(),
    email: String(data.get("email")).trim().toLowerCase(),
    program: String(data.get("program"))
  };
  // Prevent duplicate local profiles from using the same email address.
  if (profiles.some((savedProfile) => savedProfile.email === profile.email)) {
    status.classList.add("error");
    status.textContent = "That email already has a profile saved in this browser. Sign in instead.";
    return;
  }
  try {
    localStorage.setItem(profileKey, JSON.stringify([...profiles, profile]));
    registerForm.reset();
    startSession(profile);
  } catch (error) {
    // Report a failed profile write rather than presenting it as a successful sign-up.
    console.error("Could not save the local profile:", error);
    status.classList.add("error");
    status.textContent = "This browser could not save the profile.";
  }
});
// Sign in by matching the entered email to a saved local profile.
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const profiles = readProfiles();
  if (!profiles) return;
  const email = String(new FormData(loginForm).get("email")).trim().toLowerCase();
  // Find the profile associated with the normalized email address.
  const profile = profiles.find((savedProfile) => savedProfile.email === email);
  if (!profile) {
    status.classList.add("error");
    status.textContent = "No local profile uses that email. Create a profile first.";
    return;
  }
  loginForm.reset();
  startSession(profile);
});
// Clear the local session and return to the sign-in form.
document.querySelector("#portal-signout").addEventListener("click", () => {
  try {
    localStorage.removeItem(sessionKey);
    profilePanel.hidden = true;
    formPanel.hidden = false;
    changeMode("login");
    status.textContent = "Signed out of this browser profile.";
  } catch (error) {
    // Keep the profile visible and report the failure if local sign-out cannot finish.
    console.error("Could not sign out of the local profile:", error);
    status.classList.add("error");
    status.textContent = "Could not clear the local session.";
  }
});
try {
  // Restore a valid saved session when the student space is reopened.
  const session = JSON.parse(localStorage.getItem(sessionKey) || "null");
  if (session && typeof session.email === "string") {
    // Find the profile for this session and restore its signed-in view.
    const profile = readProfiles()?.find((savedProfile) => savedProfile.email === session.email);
    if (profile) startSession(profile);
  }
} catch (error) {
  // Report a failed session restore instead of assuming the visitor is signed in.
  console.error("Could not restore the local session:", error);
  status.classList.add("error");
  status.textContent = "The saved local session could not be read.";
}

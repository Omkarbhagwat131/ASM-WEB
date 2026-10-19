const loginForm = document.querySelector("#login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginMessage = document.querySelector("#login-message");
const passwordToggle = document.querySelector(".password-toggle");
const forgotPassword = document.querySelector("#forgot-password");

if (passwordToggle && loginPassword) {
  passwordToggle.addEventListener("click", () => {
    const showingPassword = loginPassword.type === "password";
    loginPassword.type = showingPassword ? "text" : "password";
    passwordToggle.textContent = showingPassword ? "Hide" : "Show";
    passwordToggle.setAttribute("aria-label", showingPassword ? "Hide password" : "Show password");
    passwordToggle.setAttribute("aria-pressed", String(showingPassword));
  });
}

if (loginForm && loginEmail && loginPassword && loginMessage) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginMessage.textContent = "Login is not connected to an account service yet.";
  });
}

if (forgotPassword && loginEmail && loginMessage) {
  forgotPassword.addEventListener("click", () => {
    if (!loginEmail.value.trim() || !loginEmail.validity.valid) {
      loginMessage.textContent = "Enter a valid email address first.";
      loginEmail.focus();
      return;
    }

    loginMessage.textContent = "Password reset is not connected to an email service yet.";
  });
}

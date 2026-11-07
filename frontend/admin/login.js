
const API_URL = "https://global-digital-agency-api.onrender.com/api/admin";

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const loginButton = document.getElementById("login-button");

// IMPORTANT: Do not automatically redirect on page load.
// This prevents login/dashboard redirect loops.

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginButton.disabled = true;
  loginButton.textContent = "Signing in...";
  loginMessage.textContent = "";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Login failed.");
    }

    loginMessage.style.color = "green";
    loginMessage.textContent = "Login successful!";

    // Redirect only after successful login
    window.location.replace("dashboard.html");

  } catch (error) {
    loginMessage.style.color = "red";
    loginMessage.textContent = error.message;
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Sign in →";
  }
});

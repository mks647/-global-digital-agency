
// Global Digital Agency — Navigation and Enquiry Form

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  const year = document.querySelector("#current-year");
  const contactForm = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");

  const API_URL = "https://global-digital-agency.onrender.com/api";

  // Update copyright year
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        nav.classList.remove("is-open");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  // Customer Enquiry Form
  if (contactForm && formNote) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      const submitButton = contactForm.querySelector(
        'button[type="submit"]'
      );

      if (!submitButton) {
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";

      formNote.textContent = "Please wait...";
      formNote.style.color = "";

      const formData = {
        full_name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        business_name: document.getElementById("business").value.trim(),
        service_type: document.getElementById("service").value,
        message: document.getElementById("message").value.trim()
      };

      try {
        const response = await fetch(
          `${API_URL}/enquiries`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to submit enquiry."
          );
        }

        formNote.textContent =
          "Thank you! Your enquiry has been submitted successfully.";

        formNote.style.color = "green";

        contactForm.reset();

      } catch (error) {
        console.error("Contact Form Error:", error);

        formNote.textContent =
          error.message === "Failed to fetch"
            ? "Unable to connect to the server. Please try again."
            : error.message;

        formNote.style.color = "red";

      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML =
          'Submit enquiry <span>↗</span>';
      }
    });
  }
});

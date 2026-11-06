// Global Digital Agency — navigation and enquiry form
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  const year = document.querySelector("#current-year");
  const form = document.querySelector("#contact-form");
  const formNote = document.querySelector("#form-note");

  if (year) year.textContent = new Date().getFullYear();

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
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

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const business = String(data.get("business") || "").trim();
      const service = String(data.get("service") || "").trim();
      const message = String(data.get("message") || "").trim();

      const subject = encodeURIComponent(`Website enquiry: ${service}`);
      const body = encodeURIComponent(
        `Hello Global Digital Agency,\n\n` +
        `My name is ${name}.\n` +
        `Email: ${email}\n` +
        `Business: ${business || "Not provided"}\n` +
        `Service needed: ${service}\n\n` +
        `Project details:\n${message}\n\n` +
        `Sent from the Global Digital Agency website enquiry form.`
      );

      if (formNote) {
        formNote.textContent = "Your email application should open with the enquiry prepared. Please review it and press Send. This website does not store your information.";
      }

      window.location.href = `mailto:mukulmks647@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});

const contactForm = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");

if (contactForm && formNote) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = contactForm.querySelector(
      'button[type="submit"]'
    );

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    const formData = {
      full_name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      business_name: document.getElementById("business").value.trim(),
      service_type: document.getElementById("service").value,
      message: document.getElementById("message").value.trim()
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/enquiries",
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
        throw new Error(result.message || "Submission failed.");
      }

      formNote.textContent =
        "Thank you! Your enquiry has been submitted successfully.";

      formNote.style.color = "green";

      contactForm.reset();

    } catch (error) {
      formNote.textContent =
        error.message === "Failed to fetch"
          ? "Unable to connect to the server. Please try again."
          : error.message;

      formNote.style.color = "red";

      console.error("Contact Form Error:", error);

    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit enquiry <span>↗</span>';
    }
  });
}

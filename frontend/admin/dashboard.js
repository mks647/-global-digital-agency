
const API_URL = "http://127.0.0.1:5000/api/admin";

const tableBody = document.getElementById("enquiries-table");
const dashboardMessage = document.getElementById("dashboard-message");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");

let allEnquiries = [];

async function checkAdminSession() {
  try {
    const response = await fetch(`${API_URL}/me`, {
      credentials: "include"
    });

    if (!response.ok) {
      window.location.replace("login.html");
      return false;
    }

    const result = await response.json();

    document.getElementById("admin-name").textContent =
      result.admin.username;

    return true;

  } catch (error) {
    dashboardMessage.textContent = "Unable to connect to server.";
    return false;
  }
}

async function loadEnquiries() {
  dashboardMessage.textContent = "Loading enquiries...";

  try {
    const response = await fetch(`${API_URL}/enquiries`, {
      credentials: "include"
    });

    if (response.status === 401) {
      window.location.replace("login.html");
      return;
    }

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load enquiries.");
    }

    allEnquiries = result.enquiries || [];

    updateStats();
    renderEnquiries();

    dashboardMessage.textContent =
      `${allEnquiries.length} enquiries loaded.`;

  } catch (error) {
    dashboardMessage.textContent = error.message;
  }
}

function updateStats() {
  document.getElementById("total-count").textContent =
    allEnquiries.length;

  document.getElementById("new-count").textContent =
    allEnquiries.filter(item => item.status === "new").length;

  document.getElementById("progress-count").textContent =
    allEnquiries.filter(item => item.status === "in_progress").length;

  document.getElementById("completed-count").textContent =
    allEnquiries.filter(item => item.status === "completed").length;
}

function renderEnquiries() {
  const search = searchInput.value.toLowerCase().trim();
  const selectedStatus = statusFilter.value;

  const filtered = allEnquiries.filter(item => {
    const text = [
      item.full_name,
      item.email,
      item.business_name,
      item.service_type
    ].join(" ").toLowerCase();

    return text.includes(search) &&
      (selectedStatus === "all" || item.status === selectedStatus);
  });

  tableBody.innerHTML = "";

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 8;
    cell.textContent = "No enquiries found.";

    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  filtered.forEach(item => {
    const row = document.createElement("tr");

    const cells = [
      createCell(item.id),
      createCell(item.full_name),
      createCell(`${item.email}\n${item.phone || "No phone"}`),
      createCell(item.business_name || "—"),
      createCell(item.service_type),
      createCell(item.message),
      createCell(item.created_at
        ? new Date(item.created_at).toLocaleString()
        : "—")
    ];

    const statusCell = document.createElement("td");
    const badge = document.createElement("span");

    badge.className = `status status-${item.status}`;
    badge.textContent = item.status.replace("_", " ");

    statusCell.appendChild(badge);
    cells.push(statusCell);

    cells.forEach(cell => row.appendChild(cell));
    tableBody.appendChild(row);
  });
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value ?? "—";
  return cell;
}

searchInput.addEventListener("input", renderEnquiries);
statusFilter.addEventListener("change", renderEnquiries);

document.getElementById("refresh-button")
  .addEventListener("click", loadEnquiries);

document.getElementById("logout-button")
  .addEventListener("click", async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include"
      });
    } finally {
      window.location.replace("login.html");
    }
  });

async function initializeDashboard() {
  const authenticated = await checkAdminSession();

  if (authenticated) {
    await loadEnquiries();
  }
}

initializeDashboard();

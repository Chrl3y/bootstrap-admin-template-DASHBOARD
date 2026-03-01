// ============================================================
// IT Operations Dashboard — Dashboard Initializer
// ============================================================
// Fetches data via ApiService (mock or live) and wires it into
// the DOM: KPI cards, four Chart.js charts, the incidents table,
// and the jVectorMap server-locations map.
// ============================================================

// ---- Severity / Status badge class helpers -----------------
function severityClass(sev) {
  switch (sev) {
    case "Critical": return "status-btn close-btn";
    case "High":     return "status-btn warning-btn";
    case "Medium":   return "status-btn primary-btn";
    default:         return "status-btn success-btn";
  }
}

function statusClass(st) {
  switch (st) {
    case "Open":        return "status-btn close-btn";
    case "In Progress": return "status-btn warning-btn";
    default:            return "status-btn success-btn";
  }
}

// ---- KPI card population -----------------------------------
async function loadMetrics() {
  const d = await ApiService.getMetrics();

  document.getElementById("kpi-incidents").textContent   = d.activeIncidents;
  document.getElementById("kpi-uptime").textContent      = d.serverUptime;
  document.getElementById("kpi-tickets").textContent     = d.openTickets;
  document.getElementById("kpi-alerts").textContent      = d.alertsToday;

  // Trend indicators
  _setTrend("trend-incidents", d.incidentTrend, true);  // lower is better
  _setTrend("trend-uptime",    d.uptimeTrend,   false); // higher is better
  _setTrend("trend-tickets",   d.ticketTrend,   true);  // lower is better
  _setTrend("trend-alerts",    d.alertTrend,    true);  // lower is better
}

function _setTrend(elId, value, lowerIsBetter) {
  const el = document.getElementById(elId);
  if (!el) return;
  const good = lowerIsBetter ? value <= 0 : value >= 0;
  const sign  = value > 0 ? "+" : "";
  el.innerHTML = `<i class="lni lni-arrow-${good ? "down" : "up"}"></i> ${sign}${value}%`;
  el.className = "text-sm " + (good ? "text-success" : "text-danger");
}

// ---- Chart 1: CPU & Memory Usage (multi-line) --------------
async function loadChart1() {
  const d   = await ApiService.getServerUsage();
  const ctx = document.getElementById("Chart1").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: d.labels,
      datasets: [
        {
          label: "CPU %",
          backgroundColor: "transparent",
          borderColor: "#365CF5",
          data: d.cpu,
          pointBackgroundColor: "transparent",
          pointHoverBackgroundColor: "#365CF5",
          pointBorderColor: "transparent",
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 5,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          cubicInterpolationMode: "monotone",
        },
        {
          label: "Memory %",
          backgroundColor: "transparent",
          borderColor: "#9b51e0",
          data: d.memory,
          pointBackgroundColor: "transparent",
          pointHoverBackgroundColor: "#9b51e0",
          pointBorderColor: "transparent",
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 5,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          cubicInterpolationMode: "monotone",
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          intersect: false,
          backgroundColor: "#f9f9f9",
          titleColor: "#8F92A1",
          bodyColor: "#171717",
          bodyFont: { family: "Plus Jakarta Sans", size: 14, weight: "bold" },
          displayColors: false,
          padding: { x: 20, y: 10 },
          bodyAlign: "center",
          titleAlign: "center",
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          grid: { display: false, drawTicks: false, drawBorder: false },
          ticks: { padding: 35 },
          max: 100,
          min: 0,
        },
        x: {
          grid: {
            drawBorder: false,
            color: "rgba(143,146,161,.1)",
            zeroLineColor: "rgba(143,146,161,.1)",
          },
          ticks: { padding: 20 },
        },
      },
    },
  });
}

// ---- Chart 2: Monthly Incident Trend (bar) -----------------
async function loadChart2() {
  const d   = await ApiService.getIncidents();
  const ctx = document.getElementById("Chart2").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: d.labels,
      datasets: [
        {
          label: "Incidents",
          backgroundColor: "#d50100",
          borderRadius: 30,
          barThickness: 6,
          maxBarThickness: 8,
          data: d.counts,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#F3F6F8",
          titleColor: "#8F92A1",
          bodyColor: "#171717",
          bodyFont: { size: 14, weight: "bold" },
          displayColors: false,
          padding: { x: 20, y: 10 },
          titleAlign: "center",
          bodyAlign: "center",
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          grid: { display: false, drawTicks: false, drawBorder: false },
          ticks: { padding: 35 },
        },
        x: {
          grid: { display: false, drawBorder: false, drawTicks: false },
          ticks: { padding: 20 },
        },
      },
    },
  });
}

// ---- Chart 3: Alert Severity Trends (multi-line) -----------
async function loadChart3() {
  const d   = await ApiService.getAlertTrends();
  const ctx = document.getElementById("Chart3").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: d.labels,
      datasets: [
        {
          label: "Critical",
          backgroundColor: "transparent",
          borderColor: "#d50100",
          data: d.critical,
          pointBackgroundColor: "transparent",
          pointHoverBackgroundColor: "#d50100",
          pointBorderColor: "transparent",
          pointHoverBorderColor: "#d50100",
          pointHoverBorderWidth: 3,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: false,
          tension: 0.4,
        },
        {
          label: "Warning",
          backgroundColor: "transparent",
          borderColor: "#f2994a",
          data: d.warning,
          pointBackgroundColor: "transparent",
          pointHoverBackgroundColor: "#f2994a",
          pointBorderColor: "transparent",
          pointHoverBorderColor: "#f2994a",
          pointHoverBorderWidth: 3,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: false,
          tension: 0.4,
        },
        {
          label: "Info",
          backgroundColor: "transparent",
          borderColor: "#365CF5",
          data: d.info,
          pointBackgroundColor: "transparent",
          pointHoverBackgroundColor: "#365CF5",
          pointBorderColor: "transparent",
          pointHoverBorderColor: "#365CF5",
          pointHoverBorderWidth: 3,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: false,
          tension: 0.4,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          intersect: false,
          backgroundColor: "#fbfbfb",
          titleColor: "#8F92A1",
          bodyColor: "#272727",
          displayColors: false,
          padding: { x: 20, y: 12 },
          borderColor: "rgba(143,146,161,.1)",
          borderWidth: 1,
        },
      },
      responsive: true,
      scales: {
        y: {
          grid: { display: false, drawTicks: false, drawBorder: false },
          ticks: { padding: 35 },
          min: 0,
        },
        x: {
          grid: {
            drawBorder: false,
            color: "rgba(143,146,161,.1)",
            drawTicks: false,
          },
          ticks: { padding: 20 },
        },
      },
    },
  });
}

// ---- Chart 4: Service Health Comparison (grouped bar) ------
async function loadChart4() {
  const d   = await ApiService.getServiceHealth();
  const ctx = document.getElementById("Chart4").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: d.labels,
      datasets: [
        {
          label: "Current",
          backgroundColor: "#365CF5",
          borderColor: "transparent",
          borderRadius: 20,
          borderWidth: 5,
          barThickness: 14,
          maxBarThickness: 16,
          data: d.current,
        },
        {
          label: "Previous",
          backgroundColor: "#9b51e0",
          borderColor: "transparent",
          borderRadius: 20,
          borderWidth: 5,
          barThickness: 14,
          maxBarThickness: 16,
          data: d.previous,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#F3F6F8",
          titleColor: "#8F92A1",
          bodyColor: "#171717",
          bodyFont: { size: 14, weight: "bold" },
          displayColors: false,
          padding: { x: 20, y: 10 },
          bodyAlign: "center",
          titleAlign: "center",
        },
      },
      responsive: true,
      scales: {
        y: {
          grid: { display: false, drawTicks: false, drawBorder: false },
          ticks: { padding: 35 },
          max: 100,
          min: 80,
        },
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { padding: 20 },
        },
      },
    },
  });
}

// ---- Incidents table (top incidents) -----------------------
async function loadIncidentsTable() {
  const d    = await ApiService.getIncidents();
  const tbody = document.getElementById("incidents-tbody");
  if (!tbody) return;
  tbody.innerHTML = d.list.map(function (inc) {
    return (
      "<tr>" +
        "<td><p class=\"text-sm text-medium\">" + inc.id + "</p></td>" +
        "<td><p class=\"text-sm\">" + inc.service + "</p></td>" +
        "<td><span class=\"" + severityClass(inc.severity) + "\">" + inc.severity + "</span></td>" +
        "<td><span class=\"" + statusClass(inc.status) + "\">" + inc.status + "</span></td>" +
        "<td><p class=\"text-sm\">" + inc.assignee + "</p></td>" +
        "<td><p class=\"text-sm text-gray\">" + inc.time + "</p></td>" +
      "</tr>"
    );
  }).join("");
}

// ---- jVectorMap: Server Locations --------------------------
async function loadMap() {
  const d = await ApiService.getServerLocations();
  new jsVectorMap({
    map: "world_merc",
    selector: "#map",
    zoomButtons: true,
    regionStyle: {
      initial: { fill: "#d1d5db" },
    },
    labels: {
      markers: {
        render: function (marker) { return marker.name; },
      },
    },
    markersSelectable: true,
    markers: d.markers,
    markerStyle: {
      initial: { fill: "#365CF5" },
      selected: { fill: "#d50100" },
    },
    markerLabelStyle: {
      initial: { fontWeight: 400, fontSize: 13 },
    },
  });
}

// ---- Boot: run everything when DOM is ready ----------------
document.addEventListener("DOMContentLoaded", function () {
  loadMetrics();
  loadChart1();
  loadChart2();
  loadChart3();
  loadChart4();
  loadIncidentsTable();
  loadMap();
});

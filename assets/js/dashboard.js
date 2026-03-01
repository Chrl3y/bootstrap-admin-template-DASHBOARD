// ============================================================
// IT Operations Dashboard — Dashboard Initializer
// ============================================================

// ---- Badge helpers -----------------------------------------
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
    case "Open":
    case "Escalated": return "status-btn close-btn";
    case "In Progress":
    case "Planning":
    case "Patching":  return "status-btn warning-btn";
    case "Completed":
    case "Remediated":
    case "Success":   return "status-btn success-btn";
    case "On Hold":   return "status-btn primary-btn";
    default:          return "status-btn";
  }
}
function jobStatusClass(st) {
  if (st === "Success") return "status-btn success-btn";
  if (st === "Warning") return "status-btn warning-btn";
  if (st === "Failed")  return "status-btn close-btn";
  return "status-btn";
}
function priorityClass(p) {
  if (p === "P1" || p === "High")   return "status-btn close-btn";
  if (p === "P2" || p === "Medium") return "status-btn warning-btn";
  return "status-btn success-btn";
}
function progressColor(pct) {
  if (pct >= 80) return "#219653";
  if (pct >= 40) return "#365CF5";
  return "#9b51e0";
}

// ---- Trend indicator helper --------------------------------
function _setTrend(elId, value, lowerIsBetter) {
  var el = document.getElementById(elId);
  if (!el) return;
  var good = lowerIsBetter ? value <= 0 : value >= 0;
  var sign = value > 0 ? "+" : "";
  el.innerHTML = '<i class="lni lni-arrow-' + (good ? "down" : "up") + '"></i> ' + sign + value + '%';
  el.className = "text-sm " + (good ? "text-success" : "text-danger");
}

// ============================================================
// 1. KPI CARDS (both rows)
// ============================================================
async function loadMetrics() {
  var d = await ApiService.getMetrics();

  // Row 1
  document.getElementById("kpi-incidents").textContent = d.activeIncidents;
  document.getElementById("kpi-uptime").textContent    = d.serverUptime;
  document.getElementById("kpi-tickets").textContent   = d.openTickets;
  document.getElementById("kpi-alerts").textContent    = d.alertsToday;
  _setTrend("trend-incidents", d.incidentTrend, true);
  _setTrend("trend-uptime",    d.uptimeTrend,   false);
  _setTrend("trend-tickets",   d.ticketTrend,   true);
  _setTrend("trend-alerts",    d.alertTrend,    true);

  // Row 2
  document.getElementById("kpi-security").textContent = d.securityScore + " / 100";
  document.getElementById("kpi-assets").textContent   = d.totalAssets;
  document.getElementById("kpi-sla").textContent      = d.slaCompliance + "%";
  document.getElementById("kpi-jobs").textContent     = d.scheduledJobsCount;
  _setTrend("trend-security", d.securityTrend, false);
  _setTrend("trend-assets",   d.assetTrend,    false);
  _setTrend("trend-sla",      d.slaTrend,      false);
  _setTrend("trend-jobs",     d.jobsTrend,     false);
}

// ============================================================
// 2. URGENT ALERTS BANNER
// ============================================================
async function loadUrgentAlerts() {
  var alerts = await ApiService.getUrgentAlerts();
  var container = document.getElementById("urgent-alerts-container");
  if (!container || !alerts.length) return;

  var html = alerts.map(function(a) {
    var color = a.severity === "Critical" ? "#d50100" : "#f2994a";
    return (
      '<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;' +
      'border-left:4px solid ' + color + ';background:rgba(0,0,0,.03);' +
      'border-radius:4px;margin-bottom:8px;">' +
        '<span class="' + severityClass(a.severity) + '">' + a.severity + '</span>' +
        '<span class="text-sm text-dark" style="flex:1;">' + a.message + '</span>' +
        '<span class="text-sm text-gray" style="white-space:nowrap;">' + a.service + ' &bull; ' + a.time + '</span>' +
      '</div>'
    );
  }).join("");
  container.innerHTML = html;
}

// ============================================================
// 3. CHART 1 — CPU & Memory Usage
// ============================================================
async function loadChart1() {
  var d   = await ApiService.getServerUsage();
  var ctx = document.getElementById("Chart1").getContext("2d");
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
        y: { grid: { display: false, drawTicks: false, drawBorder: false }, ticks: { padding: 35 }, max: 100, min: 0 },
        x: { grid: { drawBorder: false, color: "rgba(143,146,161,.1)", zeroLineColor: "rgba(143,146,161,.1)" }, ticks: { padding: 20 } },
      },
    },
  });
}

// ============================================================
// 4. CHART 2 — Monthly Incident Trend
// ============================================================
async function loadChart2() {
  var d   = await ApiService.getIncidents();
  var ctx = document.getElementById("Chart2").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: d.labels,
      datasets: [{ label: "Incidents", backgroundColor: "#d50100", borderRadius: 30, barThickness: 6, maxBarThickness: 8, data: d.counts }],
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: "#F3F6F8", titleColor: "#8F92A1", bodyColor: "#171717", bodyFont: { size: 14, weight: "bold" }, displayColors: false, padding: { x: 20, y: 10 }, titleAlign: "center", bodyAlign: "center" },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { grid: { display: false, drawTicks: false, drawBorder: false }, ticks: { padding: 35 } },
        x: { grid: { display: false, drawBorder: false, drawTicks: false }, ticks: { padding: 20 } },
      },
    },
  });
}

// ============================================================
// 5. CHART 3 — Alert Severity Trends
// ============================================================
async function loadChart3() {
  var d   = await ApiService.getAlertTrends();
  var ctx = document.getElementById("Chart3").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: d.labels,
      datasets: [
        { label: "Critical", backgroundColor: "transparent", borderColor: "#d50100", data: d.critical, pointBackgroundColor: "transparent", pointHoverBackgroundColor: "#d50100", pointBorderColor: "transparent", pointHoverBorderColor: "#d50100", borderWidth: 3, pointRadius: 5, pointHoverRadius: 8, fill: false, tension: 0.4 },
        { label: "Warning",  backgroundColor: "transparent", borderColor: "#f2994a", data: d.warning,  pointBackgroundColor: "transparent", pointHoverBackgroundColor: "#f2994a", pointBorderColor: "transparent", pointHoverBorderColor: "#f2994a", borderWidth: 3, pointRadius: 5, pointHoverRadius: 8, fill: false, tension: 0.4 },
        { label: "Info",     backgroundColor: "transparent", borderColor: "#365CF5", data: d.info,     pointBackgroundColor: "transparent", pointHoverBackgroundColor: "#365CF5", pointBorderColor: "transparent", pointHoverBorderColor: "#365CF5", borderWidth: 3, pointRadius: 5, pointHoverRadius: 8, fill: false, tension: 0.4 },
      ],
    },
    options: {
      plugins: { legend: { display: false }, tooltip: { intersect: false, backgroundColor: "#fbfbfb", titleColor: "#8F92A1", bodyColor: "#272727", displayColors: false, padding: { x: 20, y: 12 }, borderColor: "rgba(143,146,161,.1)", borderWidth: 1 } },
      responsive: true,
      scales: {
        y: { grid: { display: false, drawTicks: false, drawBorder: false }, ticks: { padding: 35 }, min: 0 },
        x: { grid: { drawBorder: false, color: "rgba(143,146,161,.1)", drawTicks: false }, ticks: { padding: 20 } },
      },
    },
  });
}

// ============================================================
// 6. CHART 4 — Service Health Comparison
// ============================================================
async function loadChart4() {
  var d   = await ApiService.getServiceHealth();
  var ctx = document.getElementById("Chart4").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: d.labels,
      datasets: [
        { label: "Current",  backgroundColor: "#365CF5", borderColor: "transparent", borderRadius: 20, borderWidth: 5, barThickness: 14, maxBarThickness: 16, data: d.current },
        { label: "Previous", backgroundColor: "#9b51e0", borderColor: "transparent", borderRadius: 20, borderWidth: 5, barThickness: 14, maxBarThickness: 16, data: d.previous },
      ],
    },
    options: {
      plugins: { legend: { display: false }, tooltip: { backgroundColor: "#F3F6F8", titleColor: "#8F92A1", bodyColor: "#171717", bodyFont: { size: 14, weight: "bold" }, displayColors: false, padding: { x: 20, y: 10 }, bodyAlign: "center", titleAlign: "center" } },
      responsive: true,
      scales: {
        y: { grid: { display: false, drawTicks: false, drawBorder: false }, ticks: { padding: 35 }, max: 100, min: 80 },
        x: { grid: { display: false, drawBorder: false }, ticks: { padding: 20 } },
      },
    },
  });
}

// ============================================================
// 7. CHART 5 — SLA Compliance Rate (line)
// ============================================================
async function loadChart5() {
  var d   = await ApiService.getTicketsSLA();
  var ctx = document.getElementById("Chart5");
  if (!ctx) return;
  new Chart(ctx.getContext("2d"), {
    type: "line",
    data: {
      labels: d.slaLabels,
      datasets: [{
        label: "SLA Compliance %",
        backgroundColor: "rgba(54,92,245,.1)",
        borderColor: "#365CF5",
        data: d.slaRates,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#365CF5",
        pointRadius: 4,
        pointHoverRadius: 7,
        borderWidth: 3,
      }],
    },
    options: {
      plugins: { legend: { display: false }, tooltip: { intersect: false, backgroundColor: "#f9f9f9", titleColor: "#8F92A1", bodyColor: "#171717", displayColors: false, padding: { x: 20, y: 10 } } },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { grid: { display: false, drawTicks: false, drawBorder: false }, ticks: { padding: 35 }, max: 100, min: 70 },
        x: { grid: { drawBorder: false, color: "rgba(143,146,161,.1)", drawTicks: false }, ticks: { padding: 20 } },
      },
    },
  });
}

// ============================================================
// 8. CHART 6 — MTTR & Uptime Trends
// ============================================================
async function loadChart6() {
  var d   = await ApiService.getTrends();
  var ctx = document.getElementById("Chart6");
  if (!ctx) return;
  new Chart(ctx.getContext("2d"), {
    type: "line",
    data: {
      labels: d.labels,
      datasets: [
        { label: "MTTR (hrs)", backgroundColor: "transparent", borderColor: "#f2994a", data: d.mttr,          fill: false, tension: 0.4, pointBackgroundColor: "#f2994a", pointRadius: 4, pointHoverRadius: 7, borderWidth: 3 },
        { label: "Uptime %",   backgroundColor: "transparent", borderColor: "#219653", data: d.uptimeHistory, fill: false, tension: 0.4, pointBackgroundColor: "#219653", pointRadius: 4, pointHoverRadius: 7, borderWidth: 3 },
      ],
    },
    options: {
      plugins: { legend: { display: false }, tooltip: { intersect: false, backgroundColor: "#fbfbfb", titleColor: "#8F92A1", bodyColor: "#272727", displayColors: false, padding: { x: 20, y: 12 } } },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { grid: { display: false, drawTicks: false, drawBorder: false }, ticks: { padding: 35 } },
        x: { grid: { drawBorder: false, color: "rgba(143,146,161,.1)", drawTicks: false }, ticks: { padding: 20 } },
      },
    },
  });
}

// ============================================================
// 9. ACTIVE INCIDENTS TABLE
// ============================================================
async function loadIncidentsTable() {
  var d     = await ApiService.getIncidents();
  var tbody = document.getElementById("incidents-tbody");
  if (!tbody) return;
  tbody.innerHTML = d.list.map(function(inc) {
    return "<tr>" +
      "<td><p class='text-sm text-medium'>" + inc.id + "</p></td>" +
      "<td><p class='text-sm'>" + inc.service + "</p></td>" +
      "<td><span class='" + severityClass(inc.severity) + "'>" + inc.severity + "</span></td>" +
      "<td><span class='" + statusClass(inc.status) + "'>" + inc.status + "</span></td>" +
      "<td><p class='text-sm'>" + inc.assignee + "</p></td>" +
      "<td><p class='text-sm text-gray'>" + inc.time + "</p></td>" +
    "</tr>";
  }).join("");
}

// ============================================================
// 10. TICKET & SLA TABLE
// ============================================================
async function loadTicketsSLA() {
  var d     = await ApiService.getTicketsSLA();
  var tbody = document.getElementById("tickets-tbody");
  if (!tbody) return;

  // Update SLA KPIs inside the section
  var el;
  el = document.getElementById("sla-rate");  if (el) el.textContent = d.complianceRate + "%";
  el = document.getElementById("sla-mttr");  if (el) el.textContent = d.avgResolutionHours + "h";
  el = document.getElementById("sla-breach"); if (el) el.textContent = d.breachedCount;

  tbody.innerHTML = d.tickets.map(function(t) {
    var slaCell = t.breached
      ? "<span class='status-btn close-btn'>SLA Breached</span>"
      : "<span class='text-sm text-success'>" + t.slaRemaining + " left</span>";
    return "<tr>" +
      "<td><p class='text-sm text-medium'>" + t.id + "</p></td>" +
      "<td><p class='text-sm'>" + t.title + "</p></td>" +
      "<td><span class='" + priorityClass(t.priority) + "'>" + t.priority + "</span></td>" +
      "<td><p class='text-sm'>" + t.assignee + "</p></td>" +
      "<td>" + slaCell + "</td>" +
      "<td><span class='" + statusClass(t.status) + "'>" + t.status + "</span></td>" +
    "</tr>";
  }).join("");
}

// ============================================================
// 11. ASSET INVENTORY TABLE
// ============================================================
async function loadAssets() {
  var d     = await ApiService.getAssets();
  var tbody = document.getElementById("assets-tbody");
  if (!tbody) return;

  // Update counts
  var el;
  el = document.getElementById("asset-total");       if (el) el.textContent = d.total;
  el = document.getElementById("asset-servers");     if (el) el.textContent = d.byType.servers;
  el = document.getElementById("asset-workstations");if (el) el.textContent = d.byType.workstations;
  el = document.getElementById("asset-licenses");    if (el) el.textContent = d.byType.licenses;

  tbody.innerHTML = d.items.map(function(a) {
    var statusCls = a.status === "Expiring Soon" ? "status-btn warning-btn" : "status-btn success-btn";
    var linkHtml  = a.link && a.link !== "#"
      ? "<a href='" + a.link + "' target='_blank' class='text-sm' style='color:#365CF5;'>Link</a>"
      : "<span class='text-sm text-gray'>—</span>";
    return "<tr>" +
      "<td><p class='text-sm text-medium'>" + a.id + "</p></td>" +
      "<td><p class='text-sm'>" + a.name + "</p></td>" +
      "<td><p class='text-sm'>" + a.type + "</p></td>" +
      "<td><p class='text-sm'>" + a.assignee + "</p></td>" +
      "<td><p class='text-sm'>" + a.vendor + "</p></td>" +
      "<td><p class='text-sm'>" + a.subscription + "</p></td>" +
      "<td><p class='text-sm'>" + a.expiry + "</p></td>" +
      "<td><p class='text-sm'>" + a.cost + "</p></td>" +
      "<td><span class='" + statusCls + "'>" + a.status + "</span></td>" +
      "<td>" + linkHtml + "</td>" +
    "</tr>";
  }).join("");
}

// ============================================================
// 12. SECURITY POSTURE
// ============================================================
async function loadSecurity() {
  var d = await ApiService.getSecurity();

  var el;
  el = document.getElementById("sec-score");     if (el) el.textContent = d.score;
  el = document.getElementById("sec-label");     if (el) el.textContent = d.scoreLabel;
  el = document.getElementById("sec-critical");  if (el) el.textContent = d.vulnerabilities.critical;
  el = document.getElementById("sec-high");      if (el) el.textContent = d.vulnerabilities.high;
  el = document.getElementById("sec-medium");    if (el) el.textContent = d.vulnerabilities.medium;
  el = document.getElementById("sec-low");       if (el) el.textContent = d.vulnerabilities.low;
  el = document.getElementById("sec-lastscan");  if (el) el.textContent = d.lastScan;
  el = document.getElementById("sec-open");      if (el) el.textContent = d.openFindings;

  var tbody = document.getElementById("security-tbody");
  if (!tbody) return;
  tbody.innerHTML = d.findings.map(function(f) {
    return "<tr>" +
      "<td><p class='text-sm text-medium'>" + f.id + "</p></td>" +
      "<td><span class='" + severityClass(f.severity) + "'>" + f.severity + "</span></td>" +
      "<td><p class='text-sm'>" + f.description + "</p></td>" +
      "<td><p class='text-sm text-gray'>" + f.affected + "</p></td>" +
      "<td><span class='" + statusClass(f.status) + "'>" + f.status + "</span></td>" +
    "</tr>";
  }).join("");
}

// ============================================================
// 13. SCHEDULED JOBS
// ============================================================
async function loadScheduledJobs() {
  var d     = await ApiService.getScheduledJobs();
  var tbody = document.getElementById("jobs-tbody");
  if (!tbody) return;
  tbody.innerHTML = d.items.map(function(j) {
    return "<tr>" +
      "<td><p class='text-sm text-medium'>" + j.name + "</p></td>" +
      "<td><p class='text-sm'>" + j.type + "</p></td>" +
      "<td><p class='text-sm text-gray'>" + j.schedule + "</p></td>" +
      "<td><span class='" + jobStatusClass(j.lastStatus) + "'>" + j.lastStatus + "</span></td>" +
      "<td><p class='text-sm text-gray'>" + j.lastRun + "</p></td>" +
      "<td><p class='text-sm'>" + j.nextRun + "</p></td>" +
      "<td><p class='text-sm text-gray'>" + j.duration + "</p></td>" +
    "</tr>";
  }).join("");
}

// ============================================================
// 14. PROJECT MANAGEMENT
// ============================================================
async function loadProjects() {
  var d     = await ApiService.getProjects();
  var tbody = document.getElementById("projects-tbody");
  if (!tbody) return;
  tbody.innerHTML = d.items.map(function(p) {
    var barColor = progressColor(p.progress);
    var progressBar =
      '<div style="background:#eee;border-radius:20px;height:8px;width:100%;min-width:80px;">' +
        '<div style="background:' + barColor + ';border-radius:20px;height:8px;width:' + p.progress + '%;"></div>' +
      '</div>' +
      '<p class="text-sm" style="margin-top:2px;">' + p.progress + '%</p>';
    return "<tr>" +
      "<td><p class='text-sm text-medium'>" + p.name + "</p></td>" +
      "<td><span class='" + statusClass(p.status) + "'>" + p.status + "</span></td>" +
      "<td><p class='text-sm'>" + p.owner + "</p></td>" +
      "<td>" + progressBar + "</td>" +
      "<td><p class='text-sm'>" + p.dueDate + "</p></td>" +
      "<td><span class='" + priorityClass(p.priority) + "'>" + p.priority + "</span></td>" +
    "</tr>";
  }).join("");
}

// ============================================================
// 15. MAP — Server Locations
// ============================================================
async function loadMap() {
  var d = await ApiService.getServerLocations();
  new jsVectorMap({
    map: "world_merc",
    selector: "#map",
    zoomButtons: true,
    regionStyle: { initial: { fill: "#d1d5db" } },
    labels: { markers: { render: function(m) { return m.name; } } },
    markersSelectable: true,
    markers: d.markers,
    markerStyle: { initial: { fill: "#365CF5" }, selected: { fill: "#d50100" } },
    markerLabelStyle: { initial: { fontWeight: 400, fontSize: 13 } },
  });
}

// ============================================================
// BOOT — run all loaders when DOM is ready
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
  loadMetrics();
  loadUrgentAlerts();
  loadChart1();
  loadChart2();
  loadChart3();
  loadChart4();
  loadChart5();
  loadChart6();
  loadIncidentsTable();
  loadTicketsSLA();
  loadAssets();
  loadSecurity();
  loadScheduledJobs();
  loadProjects();
  loadMap();
});

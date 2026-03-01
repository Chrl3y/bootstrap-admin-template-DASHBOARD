// ============================================================
// IT Operations Dashboard — API Configuration
// ============================================================
//
// HOW TO SWITCH FROM MOCK DATA TO A REAL API:
//   1. Set USE_MOCK = false
//   2. Update API_BASE to your server URL
//      e.g. 'https://api.your-company.com' or 'http://localhost:3000'
//   3. Make sure your server returns JSON matching the shapes
//      documented in api-service.js
//
// CUSTOM API BLUEPRINT — implement these routes in your backend:
//
//   GET /api/metrics              → Overview KPI numbers
//   GET /api/servers/usage        → CPU & Memory time-series
//   GET /api/incidents            → Incident list + monthly trend
//   GET /api/alerts/trends        → Alert severity time-series
//   GET /api/alerts/urgent        → Current critical/high alerts
//   GET /api/services/health      → Per-service uptime %
//   GET /api/servers/locations    → Data-centre map markers
//   GET /api/tickets/sla          → Ticket list + SLA compliance
//   GET /api/assets               → Asset inventory + vendor info
//   GET /api/security             → Security score + CVE findings
//   GET /api/jobs                 → Scheduled job status
//   GET /api/projects             → Project list + progress
//   GET /api/trends               → MTTR & uptime history
//
// ============================================================

const USE_MOCK = true; // ← flip to false when your real API is ready
const API_BASE = "http://localhost:3000";

const ENDPOINTS = {
  // --- Operations Overview ---
  metrics:         `${API_BASE}/api/metrics`,
  serverUsage:     `${API_BASE}/api/servers/usage`,
  incidents:       `${API_BASE}/api/incidents`,
  alertTrends:     `${API_BASE}/api/alerts/trends`,
  serviceHealth:   `${API_BASE}/api/services/health`,
  serverLocations: `${API_BASE}/api/servers/locations`,

  // --- Alerts & Urgent Issues ---
  urgentAlerts:    `${API_BASE}/api/alerts/urgent`,

  // --- Ticket & SLA Performance ---
  ticketsSLA:      `${API_BASE}/api/tickets/sla`,

  // --- Asset Inventory ---
  assets:          `${API_BASE}/api/assets`,

  // --- Security Posture ---
  security:        `${API_BASE}/api/security`,

  // --- Scheduled Jobs & Updates ---
  scheduledJobs:   `${API_BASE}/api/jobs`,

  // --- Project Management ---
  projects:        `${API_BASE}/api/projects`,

  // --- Trends & Insights ---
  trends:          `${API_BASE}/api/trends`,
};

// ============================================================
// IT Operations Dashboard — API Configuration
// ============================================================
//
// HOW TO SWITCH FROM MOCK DATA TO A REAL API:
//   1. Set USE_MOCK = false
//   2. Update API_BASE to your server URL
//      e.g. 'https://api.your-company.com' or 'http://localhost:3000'
//   3. Make sure your server returns JSON in the shapes documented in api-service.js
//
// ============================================================

const USE_MOCK = true; // ← flip to false when your real API is ready
const API_BASE = "http://localhost:3000";

const ENDPOINTS = {
  // GET /api/metrics
  // Response: { activeIncidents, serverUptime, openTickets, alertsToday,
  //             incidentTrend, uptimeTrend, ticketTrend, alertTrend }
  metrics: `${API_BASE}/api/metrics`,

  // GET /api/servers/usage
  // Response: { labels[], cpu[], memory[] }
  serverUsage: `${API_BASE}/api/servers/usage`,

  // GET /api/incidents
  // Response: { labels[], counts[], list[{ id, service, severity, status, assignee, time }] }
  incidents: `${API_BASE}/api/incidents`,

  // GET /api/alerts/trends
  // Response: { labels[], critical[], warning[], info[] }
  alertTrends: `${API_BASE}/api/alerts/trends`,

  // GET /api/services/health
  // Response: { labels[], current[], previous[] }
  serviceHealth: `${API_BASE}/api/services/health`,

  // GET /api/servers/locations
  // Response: { markers[{ name, coords: [lat, lng] }] }
  serverLocations: `${API_BASE}/api/servers/locations`,
};

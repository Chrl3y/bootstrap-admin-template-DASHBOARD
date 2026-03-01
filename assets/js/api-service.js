// ============================================================
// IT Operations Dashboard — API Service
// ============================================================
//
// Each function returns a Promise that resolves to the data shape
// described below. When USE_MOCK is true (set in api-config.js),
// mock data is returned immediately — no server required.
//
// When USE_MOCK is false, a real fetch() is attempted. If it fails
// for any reason, the mock data is used as a fallback so the
// dashboard never goes blank.
//
// ============================================================
// CUSTOM API BLUEPRINT
// When you build your backend, implement these endpoints:
//
//   GET /api/metrics
//     → { activeIncidents:Number, serverUptime:String, openTickets:Number,
//         alertsToday:Number, incidentTrend:Number, uptimeTrend:Number,
//         ticketTrend:Number, alertTrend:Number }
//
//   GET /api/servers/usage
//     → { labels:String[], cpu:Number[], memory:Number[] }
//
//   GET /api/incidents
//     → { labels:String[], counts:Number[],
//         list:[{ id, service, severity, status, assignee, time }] }
//
//   GET /api/alerts/trends
//     → { labels:String[], critical:Number[], warning:Number[], info:Number[] }
//
//   GET /api/services/health
//     → { labels:String[], current:Number[], previous:Number[] }
//
//   GET /api/servers/locations
//     → { markers:[{ name:String, coords:[lat, lng] }] }
// ============================================================

const MOCK = {
  metrics: {
    activeIncidents: 12,
    serverUptime: "99.7%",
    openTickets: 43,
    alertsToday: 7,
    incidentTrend: -8,   // negative = improvement (fewer incidents)
    uptimeTrend: 0.2,    // positive = uptime increased
    ticketTrend: 15,     // positive = more open tickets (worse)
    alertTrend: -22,     // negative = fewer alerts (better)
  },

  serverUsage: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    cpu:    [45, 60, 55, 70, 65, 58, 72, 68, 62, 75, 80, 73],
    memory: [60, 65, 70, 72, 68, 74, 78, 76, 71, 80, 85, 82],
  },

  incidents: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    counts: [5, 8, 3, 12, 7, 9, 4, 6, 10, 8, 5, 11],
    list: [
      { id: "INC-0042", service: "Auth API",      severity: "Critical", status: "Open",        assignee: "J. Smith",  time: "2h ago" },
      { id: "INC-0041", service: "Database",      severity: "High",     status: "In Progress", assignee: "M. Lee",    time: "4h ago" },
      { id: "INC-0040", service: "CDN",           severity: "Medium",   status: "Open",        assignee: "R. Patel",  time: "6h ago" },
      { id: "INC-0039", service: "Email Service", severity: "Low",      status: "Resolved",    assignee: "S. Nguyen", time: "1d ago" },
      { id: "INC-0038", service: "DNS",           severity: "High",     status: "Resolved",    assignee: "T. Brown",  time: "1d ago" },
    ],
  },

  alertTrends: {
    labels:   ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    critical: [3, 5, 2, 8, 4, 6, 2, 4, 7, 5, 3, 7],
    warning:  [8, 10, 7, 14, 9, 12, 6, 9, 13, 10, 7, 12],
    info:     [15, 18, 12, 22, 16, 20, 11, 15, 21, 17, 13, 19],
  },

  serviceHealth: {
    labels:   ["Auth", "Database", "API GW", "CDN", "Email", "DNS"],
    current:  [98, 95, 99, 97, 92, 99],
    previous: [96, 92, 98, 94, 90, 97],
  },

  serverLocations: {
    markers: [
      { name: "US-East (Virginia)",  coords: [37.4316,  -78.6569] },
      { name: "EU-West (Ireland)",   coords: [53.3498,   -6.2603] },
      { name: "AP-SE (Singapore)",   coords: [ 1.3521,  103.8198] },
      { name: "US-West (Oregon)",    coords: [43.8041, -120.5542] },
      { name: "AP-NE (Tokyo)",       coords: [35.6762,  139.6503] },
    ],
  },
};

// Internal fetch wrapper — falls back to mock on any error
async function _fetch(endpoint, mockKey) {
  if (typeof USE_MOCK !== "undefined" && USE_MOCK) {
    return Promise.resolve(MOCK[mockKey]);
  }
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("[api-service] Fetch failed for " + endpoint + ". Using mock data.", err);
    return MOCK[mockKey];
  }
}

// Public API — import/call these from dashboard.js
const ApiService = {
  getMetrics:         () => _fetch(ENDPOINTS.metrics,         "metrics"),
  getServerUsage:     () => _fetch(ENDPOINTS.serverUsage,     "serverUsage"),
  getIncidents:       () => _fetch(ENDPOINTS.incidents,       "incidents"),
  getAlertTrends:     () => _fetch(ENDPOINTS.alertTrends,     "alertTrends"),
  getServiceHealth:   () => _fetch(ENDPOINTS.serviceHealth,   "serviceHealth"),
  getServerLocations: () => _fetch(ENDPOINTS.serverLocations, "serverLocations"),
};

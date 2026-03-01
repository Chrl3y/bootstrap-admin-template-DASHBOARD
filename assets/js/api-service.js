// ============================================================
// IT Operations Dashboard — API Service
// ============================================================
// Each exported function returns a Promise that resolves to the
// data shape documented below.
//
// USE_MOCK = true  → mock data returned instantly (no server needed)
// USE_MOCK = false → real fetch() with mock fallback on error
//
// ============================================================

const MOCK = {

  // ---- Operations Overview --------------------------------
  metrics: {
    activeIncidents: 12,
    serverUptime: "99.7%",
    openTickets: 43,
    alertsToday: 7,
    securityScore: 78,
    totalAssets: 342,
    slaCompliance: 87,
    scheduledJobsCount: 24,
    incidentTrend: -8,
    uptimeTrend: 0.2,
    ticketTrend: 15,
    alertTrend: -22,
    securityTrend: 3,
    assetTrend: 5,
    slaTrend: -2,
    jobsTrend: 0,
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

  // ---- Alerts & Urgent Issues ----------------------------
  urgentAlerts: [
    { id: "ALT-001", severity: "Critical", message: "Auth API P99 latency >5 s (current: 7.2 s)", service: "Auth API", time: "5m ago" },
    { id: "ALT-002", severity: "High",     message: "CDN edge node us-east-3 is offline",          service: "CDN",      time: "12m ago" },
    { id: "ALT-003", severity: "High",     message: "SSL certificate expires in 7 days: api.company.com", service: "TLS/PKI", time: "1h ago" },
  ],

  // ---- Ticket & SLA Performance --------------------------
  // GET /api/tickets/sla
  ticketsSLA: {
    complianceRate: 87,
    avgResolutionHours: 4.2,
    breachedCount: 6,
    openCount: 43,
    slaLabels:  ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    slaRates:   [92, 88, 95, 80, 87, 91, 85, 89, 83, 90, 88, 87],
    tickets: [
      { id: "TKT-1234", title: "Auth service intermittent 502s",        priority: "P1", assignee: "J. Smith",  slaRemaining: "2h",  breached: false, status: "In Progress" },
      { id: "TKT-1233", title: "Disk usage >90% on db-prod-03",         priority: "P2", assignee: "M. Lee",    slaRemaining: "—",   breached: true,  status: "Open" },
      { id: "TKT-1232", title: "SSL cert renewal for api.company.com",  priority: "P2", assignee: "R. Patel",  slaRemaining: "22h", breached: false, status: "In Progress" },
      { id: "TKT-1231", title: "VPN timeout for remote users",           priority: "P3", assignee: "T. Brown",  slaRemaining: "6h",  breached: false, status: "Open" },
      { id: "TKT-1230", title: "Log shipping lag on analytics cluster",  priority: "P3", assignee: "S. Nguyen", slaRemaining: "—",   breached: true,  status: "Escalated" },
    ],
  },

  // ---- Asset Inventory ------------------------------------
  // GET /api/assets
  // Response: { total, byType:{}, items:[{ id, name, type, assignee, vendor,
  //             subscription, expiry, cost, status, link }] }
  assets: {
    total: 342,
    byType: { servers: 48, workstations: 178, network: 24, licenses: 92 },
    items: [
      { id: "SRV-001", name: "prod-api-01",         type: "Server",     assignee: "Ops Team",  vendor: "Dell",       subscription: "ProSupport Plus", expiry: "2026-03-15", cost: "$1,200/yr",  status: "Active",        link: "#" },
      { id: "SRV-002", name: "prod-db-01",           type: "Server",     assignee: "DBA Team",  vendor: "AWS",        subscription: "EC2 Reserved",    expiry: "2026-12-31", cost: "$3,400/yr",  status: "Active",        link: "#" },
      { id: "LIC-001", name: "Splunk Enterprise",    type: "License",    assignee: "SecOps",    vendor: "Splunk",     subscription: "Annual",          expiry: "2025-11-30", cost: "$18,000/yr", status: "Expiring Soon", link: "#" },
      { id: "LIC-002", name: "PagerDuty Business",   type: "License",    assignee: "Ops Team",  vendor: "PagerDuty",  subscription: "Annual",          expiry: "2026-06-01", cost: "$4,200/yr",  status: "Active",        link: "#" },
      { id: "NET-001", name: "core-switch-01",       type: "Network",    assignee: "NetOps",    vendor: "Cisco",      subscription: "SmartNet",        expiry: "2026-01-20", cost: "$800/yr",    status: "Active",        link: "#" },
      { id: "WKS-001", name: "ws-finance-batch",     type: "Workstation",assignee: "Finance",   vendor: "HP",         subscription: "HP Care Pack",    expiry: "2026-09-01", cost: "$350/yr",    status: "Active",        link: "#" },
    ],
  },

  // ---- Security Posture -----------------------------------
  // GET /api/security
  // Response: { score, scoreLabel, scoreTrend, vulnerabilities:{critical,high,medium,low},
  //             openFindings, lastScan, findings:[{ id, severity, description, affected, status }] }
  security: {
    score: 78,
    scoreLabel: "Good",
    scoreTrend: 3,
    vulnerabilities: { critical: 2, high: 8, medium: 23, low: 45 },
    openFindings: 33,
    lastScan: "2h ago",
    findings: [
      { id: "CVE-2024-1182", severity: "Critical", description: "OpenSSL buffer overflow",                  affected: "prod-api-01, prod-api-02",  status: "Patching"   },
      { id: "CVE-2024-0987", severity: "High",     description: "Redis unauthenticated RCE",               affected: "cache-prod-01",             status: "Open"       },
      { id: "CVE-2024-3311", severity: "High",     description: "Kubernetes API server misconfiguration",  affected: "k8s-prod-cluster",          status: "Remediated" },
      { id: "CVE-2023-9981", severity: "Medium",   description: "Node.js prototype pollution",             affected: "api-service v2.4.1",        status: "Open"       },
    ],
  },

  // ---- Scheduled Jobs & Updates ---------------------------
  // GET /api/jobs
  // Response: { items:[{ name, type, schedule, lastStatus, lastRun, nextRun, duration }] }
  scheduledJobs: {
    items: [
      { name: "Database Backup",        type: "Backup",      schedule: "Daily 02:00 UTC",      lastStatus: "Success", lastRun: "3h ago",  nextRun: "21h", duration: "14m" },
      { name: "Log Rotation",           type: "Maintenance", schedule: "Daily 00:00 UTC",      lastStatus: "Success", lastRun: "5h ago",  nextRun: "19h", duration: "2m"  },
      { name: "Security Scan (Nessus)", type: "Security",    schedule: "Weekly Sun 01:00",     lastStatus: "Success", lastRun: "2d ago",  nextRun: "5d",  duration: "47m" },
      { name: "SSL Cert Check",         type: "Monitoring",  schedule: "Daily 08:00 UTC",      lastStatus: "Warning", lastRun: "1h ago",  nextRun: "23h", duration: "1m"  },
      { name: "OS Patch Deployment",    type: "Update",      schedule: "Bi-weekly Tue 22:00",  lastStatus: "Failed",  lastRun: "3d ago",  nextRun: "11d", duration: "—"   },
      { name: "DB Index Rebuild",       type: "Maintenance", schedule: "Weekly Sat 03:00",     lastStatus: "Success", lastRun: "4d ago",  nextRun: "3d",  duration: "28m" },
    ],
  },

  // ---- Project Management ---------------------------------
  // GET /api/projects
  // Response: { items:[{ name, status, owner, progress, dueDate, priority }] }
  projects: {
    items: [
      { name: "Cloud Infrastructure Migration", status: "In Progress", owner: "Alice Chen",    progress: 68,  dueDate: "2026-04-30", priority: "High"   },
      { name: "SIEM Platform Upgrade",          status: "In Progress", owner: "Bob Martinez",  progress: 35,  dueDate: "2026-05-15", priority: "High"   },
      { name: "Zero Trust Network Rollout",     status: "Planning",    owner: "Carol Liu",     progress: 10,  dueDate: "2026-07-01", priority: "Medium" },
      { name: "Helpdesk Portal Redesign",       status: "In Progress", owner: "Dave Kim",      progress: 80,  dueDate: "2026-03-15", priority: "Medium" },
      { name: "DR/BCP Plan Update",             status: "Completed",   owner: "Eve Sharma",    progress: 100, dueDate: "2026-02-28", priority: "Low"    },
      { name: "Asset Mgmt Tool Rollout",        status: "On Hold",     owner: "Frank O'Brien", progress: 45,  dueDate: "2026-06-30", priority: "Low"    },
    ],
  },

  // ---- Trends & Insights ----------------------------------
  // GET /api/trends
  // Response: { labels[], mttr[], uptimeHistory[] }
  trends: {
    labels:         ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    mttr:           [5.2, 4.8, 6.1, 4.3, 5.0, 4.7, 4.5, 4.2, 4.8, 3.9, 3.6, 3.4],
    uptimeHistory:  [99.2, 99.8, 99.5, 99.1, 99.7, 99.9, 99.6, 99.3, 99.7, 99.8, 99.6, 99.7],
  },

};

// ---- Internal fetch wrapper (falls back to mock on failure) ------
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

// ---- Public API ----------------------------------------------------
const ApiService = {
  getMetrics:         () => _fetch(ENDPOINTS.metrics,         "metrics"),
  getServerUsage:     () => _fetch(ENDPOINTS.serverUsage,     "serverUsage"),
  getIncidents:       () => _fetch(ENDPOINTS.incidents,       "incidents"),
  getAlertTrends:     () => _fetch(ENDPOINTS.alertTrends,     "alertTrends"),
  getServiceHealth:   () => _fetch(ENDPOINTS.serviceHealth,   "serviceHealth"),
  getServerLocations: () => _fetch(ENDPOINTS.serverLocations, "serverLocations"),
  getUrgentAlerts:    () => _fetch(ENDPOINTS.urgentAlerts,    "urgentAlerts"),
  getTicketsSLA:      () => _fetch(ENDPOINTS.ticketsSLA,      "ticketsSLA"),
  getAssets:          () => _fetch(ENDPOINTS.assets,          "assets"),
  getSecurity:        () => _fetch(ENDPOINTS.security,        "security"),
  getScheduledJobs:   () => _fetch(ENDPOINTS.scheduledJobs,   "scheduledJobs"),
  getProjects:        () => _fetch(ENDPOINTS.projects,        "projects"),
  getTrends:          () => _fetch(ENDPOINTS.trends,          "trends"),
};

export const preloadModules = [
  {
    id: 1,
    name: "Assets & Operations",
    description: "(Vehicle, Driver, Trip)",
    status: "In Progress",
    progress: 70,
    customLabels: {
      current: "Current Work",
      today: "Today's Work",
      next: "Next Work"
    },
    currentWork: [
      "Trip Overview UI refinement"
    ],
    todaysWork: [
      "Completed Trip Creation UI fixes",
      "Improved Vehicle integration"
    ],
    nextWork: [
      "Connect Trip with backend APIs"
    ],
    deadline: "3 days",
    assigned: {
      frontend: "Ashwini",
      backend: "Teammate"
    },
    blocker: ""
  },
  {
    id: 2,
    name: "Service & Maintenance",
    description: "(Service, Repair, Fuel, Expenses)",
    status: "In Progress",
    progress: 40,
    customLabels: {
      current: "Current Work",
      today: "Today's Work",
      next: "Next Work"
    },
    currentWork: [
      "Service module logic + UI"
    ],
    todaysWork: [
      "Completed KM-based service calculation",
      "Added status workflow (Reported → Completed)"
    ],
    nextWork: [
      "API integration for service"
    ],
    deadline: "2 days",
    assigned: {
      frontend: "Ashwini",
      backend: "Teammate"
    },
    blocker: "Waiting for backend API"
  },
  {
    id: 3,
    name: "Administration",
    description: "(Users, Roles, Permissions)",
    status: "Not Started",
    progress: 0,
    customLabels: {
      current: "Current Work",
      today: "Today's Work",
      next: "Next Work"
    },
    currentWork: [],
    todaysWork: [],
    nextWork: [
      "Design role-based access"
    ],
    deadline: "Next phase",
    assigned: {
      frontend: "Unassigned",
      backend: "Unassigned"
    },
    blocker: ""
  },
  {
    id: 4,
    name: "Reports / Analytics",
    description: "(Dashboard, summaries, insights)",
    status: "Not Started",
    progress: 0,
    customLabels: {
      current: "Current Work",
      today: "Today's Work",
      next: "Next Work"
    },
    currentWork: [],
    todaysWork: [],
    nextWork: [
      "Dashboard design"
    ],
    deadline: "Next phase",
    assigned: {
      frontend: "Unassigned",
      backend: "Unassigned"
    },
    blocker: ""
  }
];

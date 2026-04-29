export const preloadDaily = [
  {
    id: "update-10-24",
    date: new Date().toISOString().split('T')[0], // Today
    updates: [
      {
        author: "Ashwini",
        doneToday: ["Completed Trip Creation UI fixes", "Optimized Vehicle selection logic"],
        planTomorrow: ["Integrate Trip Dashboard with live APIs", "Begin UI wiring for Administration module"]
      },
      {
        author: "Sriman",
        doneToday: ["Finished KM-based service generation algorithm"],
        planTomorrow: ["Finalize Service endpoints", "Deploy database changes for Blockers"]
      }
    ],
    sharedBlockers: []
  },
  {
    id: "update-10-23",
    date: "2026-04-23", // A simulated past day
    updates: [
      {
        author: "Ashwini",
        doneToday: ["Drafted basic layout for Assets and Operations module", "Styled navigation framework"],
        planTomorrow: ["Start Trip Creation UI"]
      },
      {
        author: "Sriman",
        doneToday: ["Setup database tables in Aiven", "Configured Express server and routes"],
        planTomorrow: ["Start drafting Service API logic"]
      }
    ],
    sharedBlockers: []
  }
];

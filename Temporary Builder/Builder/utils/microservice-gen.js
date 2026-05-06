function generateMicroservices(intent) {
  return {
    files: [
      {
        path: "services/api/index.js",
        content: `console.log("API Service Running");`
      },
      {
        path: "services/frontend/index.html",
        content: `<h1>Frontend Service</h1>`
      },
      {
        path: "services/worker/index.js",
        content: `console.log("Worker running background jobs");`
      },
      {
        path: "README.md",
        content: `# Microservice System\nGenerated from DAG Engine`
      }
    ]
  };
}

module.exports = { generateMicroservices };

const common = {
  require: ["src/steps/**/*.ts", "src/hooks/**/*.ts", "src/support/**/*.ts"],
  requireModule: ["ts-node/register"],
  paths: ["src/features/**/*.feature"],
  format: [
    "progress-bar",
    "allure-cucumberjs/reporter",
  ],
  formatOptions: {
    resultsDir: "./allure-results",
  },
  publishQuiet: true,
};

module.exports = {
  // Default – run all scenarios sequentially
  default: { ...common },

  // Parallel – run scenarios across multiple workers
  parallel: { ...common, parallel: Number(process.env.PARALLEL_WORKERS || 3) },

  // Smoke – only @smoke tagged scenarios
  smoke: { ...common, tags: "@smoke" },

  // Negative – only @negative scenarios
  negative: { ...common, tags: "@negative" },

  // Practice – all Practice section tests
  practice: { ...common, tags: "@practice" },

  // Exceptions – only Test Exceptions module
  exceptions: { ...common, tags: "@exceptions" },

  // JS Delays / Table – Test Table module
  jsdelays: { ...common, tags: "@table" },

  // Table – Test Table module
  table: { ...common, tags: "@table" },

  // MCP – scenarios demonstrating MCP context integration
  mcp: { ...common, tags: "@mcp-context" },

  // Login only
  login: { ...common, tags: "@login" },
};

#!/usr/bin/env node

import { FeaturebaseClient } from "./client.js";
import { runServer } from "./server.js";
import type { FeaturebaseConfig } from "./types.js";

const DEFAULT_BASE_URL = "https://do.featurebase.app/v2";

function parseArgs(): Partial<FeaturebaseConfig> {
  const args = process.argv.slice(2);
  const config: Partial<FeaturebaseConfig> = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--api-key":
        config.apiKey = args[++i];
        break;
      case "--base-url":
        config.baseUrl = args[++i];
        break;
      case "--org-url":
        config.orgUrl = args[++i];
        break;
    }
  }

  return config;
}

function getConfig(): FeaturebaseConfig {
  const cliArgs = parseArgs();

  const apiKey = cliArgs.apiKey || process.env.FEATUREBASE_API_KEY;
  if (!apiKey) {
    console.error(
      "Error: API key is required. Set FEATUREBASE_API_KEY or pass --api-key.",
    );
    process.exit(1);
  }

  return {
    apiKey,
    baseUrl:
      cliArgs.baseUrl ||
      process.env.FEATUREBASE_BASE_URL ||
      DEFAULT_BASE_URL,
    orgUrl: cliArgs.orgUrl || process.env.FEATUREBASE_ORG_URL,
  };
}

const config = getConfig();
const client = new FeaturebaseClient(config);
runServer(client).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

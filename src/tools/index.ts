import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient, ToolHandler } from "../types.js";

import * as posts from "./posts.js";
import * as upvoters from "./upvoters.js";
import * as comments from "./comments.js";
import * as changelogs from "./changelogs.js";
import * as subscribers from "./subscribers.js";
import * as users from "./users.js";
import * as customFields from "./custom-fields.js";
import * as conversations from "./conversations.js";
import * as helpCenter from "./help-center.js";
import * as utility from "./utility.js";

const modules = [posts, upvoters, comments, changelogs, subscribers, users, customFields, conversations, helpCenter, utility];

export function getAllTools(): Tool[] {
  return modules.flatMap((m) => m.tools);
}

export function getAllHandlers(client: FeaturebaseClient): Record<string, ToolHandler> {
  const handlers: Record<string, ToolHandler> = {};
  for (const m of modules) {
    Object.assign(handlers, m.createHandlers(client));
  }
  return handlers;
}

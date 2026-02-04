import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient, ToolHandler } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_changelog_subscribers",
    description: "List changelog email subscribers with pagination",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number (default: 1)" },
        limit: { type: "number", description: "Results per page (default: 10, max: 100)" },
      },
    },
  },
  {
    name: "add_changelog_subscriber",
    description: "Add a new email subscriber to changelog updates",
    inputSchema: {
      type: "object" as const,
      properties: {
        email: { type: "string", description: "Subscriber email address" },
        name: { type: "string", description: "Subscriber name" },
      },
      required: ["email", "name"],
    },
  },
  {
    name: "remove_changelog_subscriber",
    description: "Remove an email subscriber from changelog updates",
    inputSchema: {
      type: "object" as const,
      properties: {
        email: { type: "string", description: "Email address to unsubscribe" },
      },
      required: ["email"],
    },
  },
];

export function createHandlers(client: FeaturebaseClient): Record<string, ToolHandler> {
  return {
    list_changelog_subscribers: async (args) => {
      const result = await client.listSubscribers(args as Parameters<typeof client.listSubscribers>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    add_changelog_subscriber: async (args) => {
      const result = await client.addSubscriber(args as Parameters<typeof client.addSubscriber>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    remove_changelog_subscriber: async (args) => {
      const result = await client.removeSubscriber(args.email as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  };
}

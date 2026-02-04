import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient, ToolHandler } from "../types.js";

export const tools: Tool[] = [
  {
    name: "get_user",
    description: "Get a specific identified user by email or external user ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        email: { type: "string", description: "User's email address" },
        userId: { type: "string", description: "Your external user ID" },
      },
    },
  },
  {
    name: "list_users",
    description: "List identified users with pagination and optional sorting/filtering",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number (default: 1)" },
        limit: { type: "number", description: "Results per page (default: 10, max: 100)" },
        sortBy: {
          type: "string",
          enum: ["topPosters", "topCommenters", "lastActivity"],
          description: "Sort order (default: lastActivity)",
        },
        query: { type: "string", description: "Search by name or email" },
        segment: { type: "string", description: "Filter by user segment" },
      },
    },
  },
  {
    name: "upsert_user",
    description:
      "Create or update an identified user. Provide email or userId to match existing users. " +
      "If the user exists, their data is updated. If not, a new user is created.",
    inputSchema: {
      type: "object" as const,
      properties: {
        email: { type: "string", description: "User's email address" },
        userId: { type: "string", description: "Your external user ID" },
        name: { type: "string", description: "User's display name" },
        profilePicture: { type: "string", description: "URL to profile picture" },
        subscribedToChangelog: { type: "boolean", description: "Subscribe to changelog emails" },
        companies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "Company ID" },
              name: { type: "string", description: "Company name" },
              monthlySpend: { type: "number", description: "Monthly spend value" },
              createdAt: { type: "string", description: "Company creation date" },
              customFields: { type: "object", description: "Company-level custom fields" },
            },
            required: ["name"],
          },
          description: "Companies the user belongs to",
        },
        customFields: {
          type: "object",
          description: "User-level custom field key-value pairs",
        },
        createdAt: { type: "string", description: "User creation date (ISO 8601)" },
        roles: {
          type: "array",
          items: { type: "string" },
          description: "Role names to assign",
        },
        locale: { type: "string", description: "Preferred language code (e.g. 'en', 'fr')" },
      },
    },
  },
  {
    name: "delete_user",
    description: "Delete an identified user and all their associated data",
    inputSchema: {
      type: "object" as const,
      properties: {
        email: { type: "string", description: "User's email address" },
        userId: { type: "string", description: "Your external user ID" },
      },
    },
  },
];

export function createHandlers(client: FeaturebaseClient): Record<string, ToolHandler> {
  return {
    get_user: async (args) => {
      const result = await client.getUser(args as Parameters<typeof client.getUser>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    list_users: async (args) => {
      const result = await client.listUsers(args as Parameters<typeof client.listUsers>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    upsert_user: async (args) => {
      const result = await client.upsertUser(args as Parameters<typeof client.upsertUser>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    delete_user: async (args) => {
      const result = await client.deleteUser(args as Parameters<typeof client.deleteUser>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  };
}

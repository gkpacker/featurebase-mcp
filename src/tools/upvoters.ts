import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient, ToolHandler } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_post_upvoters",
    description: "Get a paginated list of users who upvoted a specific post",
    inputSchema: {
      type: "object" as const,
      properties: {
        submissionId: { type: "string", description: "Post ID to get upvoters for" },
        page: { type: "number", description: "Page number (default: 1)" },
        limit: { type: "number", description: "Results per page (default: 10, max: 100)" },
      },
      required: ["submissionId"],
    },
  },
  {
    name: "add_post_upvoter",
    description: "Add an upvote to a post on behalf of a user",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Post ID to upvote" },
        email: { type: "string", description: "Upvoter's email address" },
        name: { type: "string", description: "Upvoter's display name" },
      },
      required: ["id", "email", "name"],
    },
  },
];

export function createHandlers(client: FeaturebaseClient): Record<string, ToolHandler> {
  return {
    list_post_upvoters: async (args) => {
      const result = await client.listUpvoters(args as Parameters<typeof client.listUpvoters>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    add_post_upvoter: async (args) => {
      const result = await client.addUpvoter(args as Parameters<typeof client.addUpvoter>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  };
}

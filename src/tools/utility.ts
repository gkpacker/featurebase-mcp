import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient, ToolHandler } from "../types.js";

export const tools: Tool[] = [
  {
    name: "resolve_post_slug",
    description:
      "Resolve a post URL slug to full post data. Requires orgUrl to be configured.",
    inputSchema: {
      type: "object" as const,
      properties: {
        slug: { type: "string", description: "The URL slug of the post" },
      },
      required: ["slug"],
    },
  },
  {
    name: "find_similar_posts",
    description:
      "Find posts semantically similar to a search query. Useful for detecting duplicates. Requires orgUrl to be configured.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query to find similar posts" },
        locale: { type: "string", description: "Locale code (default: 'en')" },
      },
      required: ["query"],
    },
  },
];

export function createHandlers(client: FeaturebaseClient): Record<string, ToolHandler> {
  return {
    resolve_post_slug: async (args) => {
      const result = await client.resolvePostSlug(args.slug as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    find_similar_posts: async (args) => {
      const result = await client.findSimilarPosts(
        args.query as string,
        args.locale as string | undefined,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  };
}

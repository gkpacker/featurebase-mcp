import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient, ToolHandler } from "../types.js";
import { applySelect } from "./select.js";

export const tools: Tool[] = [
  {
    name: "list_changelogs",
    description:
      "List changelog entries with optional filtering and pagination. " +
      "Use the 'select' parameter to return only specific fields. " +
      "Available fields: id, title, htmlContent, markdownContent, changelogCategories, state, date",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Get a specific changelog by ID" },
        q: { type: "string", description: "Search query to filter changelogs" },
        categories: {
          type: "array",
          items: { type: "string" },
          description: "Filter by changelog category names",
        },
        state: {
          type: "string",
          enum: ["draft", "live"],
          description: "Filter by state (draft or live)",
        },
        page: { type: "number", description: "Page number (default: 1)" },
        limit: { type: "number", description: "Results per page (default: 10, max: 100)" },
        select: {
          type: "string",
          description: "Comma-separated fields to include in response",
        },
      },
    },
  },
  {
    name: "create_changelog",
    description: "Create a new changelog entry (created as draft)",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Changelog title" },
        htmlContent: { type: "string", description: "Content as HTML" },
        markdownContent: { type: "string", description: "Content as Markdown (alternative to htmlContent)" },
        changelogCategories: {
          type: "array",
          items: { type: "string" },
          description: "Category names for the changelog",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "update_changelog",
    description: "Update an existing changelog entry",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Changelog ID to update" },
        title: { type: "string", description: "New title" },
        htmlContent: { type: "string", description: "New content as HTML" },
        markdownContent: { type: "string", description: "New content as Markdown" },
        changelogCategories: {
          type: "array",
          items: { type: "string" },
          description: "New category names",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_changelog",
    description: "Permanently delete a changelog entry",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Changelog ID to delete" },
      },
      required: ["id"],
    },
  },
  {
    name: "publish_changelog",
    description: "Publish a draft changelog entry, optionally sending email notifications",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Changelog ID to publish" },
        sendEmail: {
          type: "boolean",
          description: "Whether to send email notification to subscribers",
        },
        locales: {
          type: "array",
          items: { type: "string" },
          description: "Locale codes to publish (e.g. ['en', 'fr'])",
        },
        scheduledDate: {
          type: "string",
          description: "Schedule publish for a future date (ISO 8601)",
        },
      },
      required: ["id", "sendEmail"],
    },
  },
  {
    name: "unpublish_changelog",
    description: "Unpublish a live changelog entry, reverting it to draft",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Changelog ID to unpublish" },
        locales: {
          type: "array",
          items: { type: "string" },
          description: "Locale codes to unpublish",
        },
      },
      required: ["id"],
    },
  },
];

export function createHandlers(client: FeaturebaseClient): Record<string, ToolHandler> {
  return {
    list_changelogs: async (args) => {
      const select = args.select as string | undefined;
      const params = { ...args };
      delete params.select;
      const result = await client.listChangelogs(params as Parameters<typeof client.listChangelogs>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(applySelect(result, select)) }],
      };
    },

    create_changelog: async (args) => {
      const result = await client.createChangelog(args as Parameters<typeof client.createChangelog>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    update_changelog: async (args) => {
      const result = await client.updateChangelog(args as Parameters<typeof client.updateChangelog>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    delete_changelog: async (args) => {
      const result = await client.deleteChangelog(args.id as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    publish_changelog: async (args) => {
      const result = await client.publishChangelog(args as Parameters<typeof client.publishChangelog>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    unpublish_changelog: async (args) => {
      const result = await client.unpublishChangelog(args as Parameters<typeof client.unpublishChangelog>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  };
}

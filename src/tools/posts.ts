import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient, ToolHandler } from "../types.js";
import { applySelect } from "./select.js";

export const tools: Tool[] = [
  {
    name: "list_posts",
    description:
      "List feedback posts with optional filtering and pagination. " +
      "Use the 'select' parameter to return only specific fields and reduce output size. " +
      "Available fields: id, title, content, author, authorId, commentsAllowed, upvotes, " +
      "postCategory(category,id), postTags(name,color,id), postStatus(name,color,type), " +
      "date, lastModified, comments, inReview, customInputValues",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Get a specific post by ID" },
        q: { type: "string", description: "Search query to filter posts" },
        category: {
          type: "array",
          items: { type: "string" },
          description: "Filter by category/board names",
        },
        status: {
          type: "array",
          items: { type: "string" },
          description: "Filter by status names",
        },
        sortBy: { type: "string", description: "Sort order for results" },
        startDate: { type: "string", description: "Filter posts created after this date (ISO 8601)" },
        endDate: { type: "string", description: "Filter posts created before this date (ISO 8601)" },
        page: { type: "number", description: "Page number (default: 1)" },
        limit: { type: "number", description: "Results per page (default: 10, max: 100)" },
        select: {
          type: "string",
          description: "Comma-separated fields to include in response (e.g. 'id,title,upvotes,postStatus(name)')",
        },
      },
    },
  },
  {
    name: "create_post",
    description: "Create a new feedback post",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Post title (min 2 characters)" },
        category: { type: "string", description: "Board/category name for the post" },
        content: { type: "string", description: "Post body content" },
        email: { type: "string", description: "Author email address" },
        authorName: { type: "string", description: "Author display name" },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tag names to apply",
        },
        commentsAllowed: { type: "boolean", description: "Whether comments are allowed" },
        status: { type: "string", description: "Initial status name" },
        date: { type: "string", description: "Post date (ISO 8601)" },
        customInputValues: {
          type: "object",
          description: "Custom field values as key-value pairs",
        },
      },
      required: ["title", "category"],
    },
  },
  {
    name: "update_post",
    description: "Update an existing feedback post",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Post ID to update" },
        title: { type: "string", description: "New title" },
        content: { type: "string", description: "New body content" },
        status: { type: "string", description: "New status name" },
        commentsAllowed: { type: "boolean", description: "Whether comments are allowed" },
        category: { type: "string", description: "New board/category name" },
        sendStatusUpdateEmail: {
          type: "boolean",
          description: "Email upvoters about the status change",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "New tag names (replaces existing)",
        },
        inReview: { type: "boolean", description: "Whether post is in review" },
        date: { type: "string", description: "New date (ISO 8601)" },
        customInputValues: {
          type: "object",
          description: "Custom field values as key-value pairs",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_post",
    description: "Permanently delete a feedback post",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Post ID to delete" },
      },
      required: ["id"],
    },
  },
];

export function createHandlers(client: FeaturebaseClient): Record<string, ToolHandler> {
  return {
    list_posts: async (args) => {
      const select = args.select as string | undefined;
      const params = { ...args };
      delete params.select;
      const result = await client.listPosts(params);
      return {
        content: [{ type: "text", text: JSON.stringify(applySelect(result, select)) }],
      };
    },

    create_post: async (args) => {
      const result = await client.createPost(args as Parameters<typeof client.createPost>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    update_post: async (args) => {
      const result = await client.updatePost(args as Parameters<typeof client.updatePost>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    delete_post: async (args) => {
      const result = await client.deletePost(args.id as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  };
}

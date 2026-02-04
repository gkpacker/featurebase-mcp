import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient, ToolHandler } from "../types.js";
import { applySelect } from "./select.js";

export const tools: Tool[] = [
  {
    name: "list_comments",
    description:
      "List comments on a post or changelog entry. " +
      "Use the 'select' parameter to return only specific fields. " +
      "Available fields: id, content, author, authorId, isPrivate, pinned, inReview, " +
      "upvotes, downvotes, score, parentComment, createdAt, updatedAt, replies",
    inputSchema: {
      type: "object" as const,
      properties: {
        submissionId: { type: "string", description: "Post ID to get comments for" },
        changelogId: { type: "string", description: "Changelog ID to get comments for" },
        privacy: {
          type: "string",
          enum: ["public", "private", "all"],
          description: "Filter by privacy (default: all)",
        },
        inReview: { type: "boolean", description: "Filter for comments in review" },
        commentThreadId: { type: "string", description: "Get a specific comment thread" },
        sortBy: {
          type: "string",
          enum: ["best", "top", "new", "old"],
          description: "Sort order (default: best)",
        },
        page: { type: "number", description: "Page number (default: 1)" },
        limit: { type: "number", description: "Results per page (default: 10)" },
        select: {
          type: "string",
          description: "Comma-separated fields to include in response",
        },
      },
    },
  },
  {
    name: "create_comment",
    description: "Create a new comment on a post or changelog entry",
    inputSchema: {
      type: "object" as const,
      properties: {
        content: { type: "string", description: "Comment text content" },
        submissionId: { type: "string", description: "Post ID to comment on" },
        changelogId: { type: "string", description: "Changelog ID to comment on" },
        parentCommentId: { type: "string", description: "Parent comment ID for replies" },
        isPrivate: { type: "boolean", description: "Whether this is a private/internal comment" },
        sendNotification: {
          type: "boolean",
          description: "Send notification to post author (default: true)",
        },
        createdAt: { type: "string", description: "Comment creation date (ISO 8601)" },
        author: {
          type: "object",
          properties: {
            name: { type: "string", description: "Author name" },
            email: { type: "string", description: "Author email" },
            profilePicture: { type: "string", description: "Author profile picture URL" },
          },
          required: ["name", "email"],
          description: "Comment author details",
        },
      },
      required: ["content"],
    },
  },
  {
    name: "update_comment",
    description: "Update an existing comment",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Comment ID to update" },
        content: { type: "string", description: "New comment content" },
        isPrivate: { type: "boolean", description: "Whether the comment is private" },
        pinned: { type: "boolean", description: "Whether the comment is pinned" },
        inReview: { type: "boolean", description: "Whether the comment is in review" },
        createdAt: { type: "string", description: "Override creation date (ISO 8601)" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_comment",
    description: "Delete a comment. Soft-deletes if the comment has replies.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Comment ID to delete" },
      },
      required: ["id"],
    },
  },
];

export function createHandlers(client: FeaturebaseClient): Record<string, ToolHandler> {
  return {
    list_comments: async (args) => {
      const select = args.select as string | undefined;
      const params = { ...args };
      delete params.select;
      const result = await client.listComments(params as Parameters<typeof client.listComments>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(applySelect(result, select)) }],
      };
    },

    create_comment: async (args) => {
      const result = await client.createComment(args as Parameters<typeof client.createComment>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    update_comment: async (args) => {
      const result = await client.updateComment(args as Parameters<typeof client.updateComment>[0]);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    delete_comment: async (args) => {
      const result = await client.deleteComment(args.id as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  };
}

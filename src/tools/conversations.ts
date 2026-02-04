import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient, ToolHandler } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_conversations",
    description:
      "List support conversations with cursor-based pagination. " +
      "Returns conversations with id, title, state, participants, assignees, timestamps, and source message.",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Results per page (default: 10, max: 100)" },
        cursor: { type: "string", description: "Cursor for next page (from nextCursor in previous response)" },
      },
    },
  },
  {
    name: "get_conversation",
    description:
      "Get a single conversation by ID, including all conversation parts (messages, notes, status changes).",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Conversation ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "create_conversation",
    description: "Create a new support conversation on behalf of a contact or admin.",
    inputSchema: {
      type: "object" as const,
      properties: {
        fromType: {
          type: "string",
          enum: ["contact", "admin"],
          description: "Type of the author starting the conversation",
        },
        fromId: { type: "string", description: "ID of the contact or admin starting the conversation" },
        bodyMarkdown: { type: "string", description: "Message body in Markdown" },
      },
      required: ["fromType", "fromId", "bodyMarkdown"],
    },
  },
  {
    name: "update_conversation",
    description:
      "Update a conversation's state, title, assignee, or snooze. " +
      "Use state 'snoozed' with snoozedUntil to snooze, or set adminAssigneeId/teamAssigneeId to reassign.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Conversation ID to update" },
        title: { type: "string", description: "New conversation title" },
        state: {
          type: "string",
          enum: ["open", "closed", "snoozed"],
          description: "New conversation state",
        },
        adminAssigneeId: {
          type: "string",
          description: "Admin ID to assign to, or null to unassign",
        },
        teamAssigneeId: {
          type: "string",
          description: "Team ID to assign to, or null to unassign",
        },
        snoozedUntil: {
          type: "string",
          description: "Snooze until this datetime (ISO 8601). Set state to 'snoozed' as well.",
        },
        customAttributes: {
          type: "object",
          description: "Custom attribute key-value pairs",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_conversation",
    description: "Permanently delete a conversation.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Conversation ID to delete" },
      },
      required: ["id"],
    },
  },
  {
    name: "reply_to_conversation",
    description:
      "Reply to a conversation as an admin or contact. " +
      "Use messageType 'note' for internal notes visible only to team members, " +
      "or 'reply' for messages visible to the customer.",
    inputSchema: {
      type: "object" as const,
      properties: {
        conversationId: { type: "string", description: "Conversation ID to reply to" },
        type: {
          type: "string",
          enum: ["contact", "admin"],
          description: "Type of the author replying",
        },
        id: { type: "string", description: "ID of the admin or contact replying" },
        bodyMarkdown: { type: "string", description: "Reply body in Markdown" },
        messageType: {
          type: "string",
          enum: ["reply", "note"],
          description: "Message type: 'reply' (visible to customer) or 'note' (internal only)",
        },
      },
      required: ["conversationId", "type", "id", "bodyMarkdown", "messageType"],
    },
  },
];

export function createHandlers(client: FeaturebaseClient): Record<string, ToolHandler> {
  return {
    list_conversations: async (args) => {
      const result = await client.listConversations(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    get_conversation: async (args) => {
      const result = await client.getConversation(args.id as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    create_conversation: async (args) => {
      const result = await client.createConversation({
        from: { type: args.fromType, id: args.fromId },
        bodyMarkdown: args.bodyMarkdown,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    update_conversation: async (args) => {
      const { id, ...data } = args;
      const result = await client.updateConversation(id, data);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    delete_conversation: async (args) => {
      const result = await client.deleteConversation(args.id as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    reply_to_conversation: async (args) => {
      const result = await client.replyToConversation(args.conversationId, {
        type: args.type,
        id: args.id,
        bodyMarkdown: args.bodyMarkdown,
        messageType: args.messageType,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  };
}

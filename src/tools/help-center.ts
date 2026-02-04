import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient, ToolHandler } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_help_centers",
    description:
      "List help centers with cursor-based pagination. " +
      "Returns help centers with id, name, identifier, websiteUrl, createdAt, updatedAt.",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Results per page (default: 10, max: 100)" },
        cursor: { type: "string", description: "Cursor for next page (from nextCursor in previous response)" },
      },
    },
  },
  {
    name: "get_help_center",
    description: "Get a single help center by ID.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Help center ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_collections",
    description:
      "List help center collections with cursor-based pagination. " +
      "Returns collections with id, name, description, icon, parentId, order, helpCenterId, translations, createdAt, updatedAt.",
    inputSchema: {
      type: "object" as const,
      properties: {
        helpCenterId: { type: "string", description: "Filter by help center ID" },
        parentId: { type: "string", description: "Filter by parent collection ID" },
        limit: { type: "number", description: "Results per page (default: 10, max: 100)" },
        cursor: { type: "string", description: "Cursor for next page (from nextCursor in previous response)" },
      },
    },
  },
  {
    name: "create_collection",
    description: "Create a new help center collection.",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Collection name" },
        description: { type: "string", description: "Collection description" },
        icon: {
          type: "object",
          properties: {
            type: { type: "string", description: "Icon type" },
            value: { type: "string", description: "Icon value" },
          },
          description: "Collection icon",
        },
        parentId: { type: "string", description: "Parent collection ID for nesting" },
        translations: { type: "object", description: "Translation key-value pairs by locale" },
      },
      required: ["name"],
    },
  },
  {
    name: "get_collection",
    description: "Get a single collection by ID.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Collection ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "update_collection",
    description: "Update an existing collection.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Collection ID to update" },
        name: { type: "string", description: "New collection name" },
        description: { type: "string", description: "New description" },
        icon: {
          type: "object",
          properties: {
            type: { type: "string", description: "Icon type" },
            value: { type: "string", description: "Icon value" },
          },
          description: "New icon",
        },
        parentId: { type: "string", description: "New parent collection ID" },
        translations: { type: "object", description: "New translations" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_collection",
    description: "Permanently delete a collection.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Collection ID to delete" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_articles",
    description:
      "List help center articles with cursor-based pagination. " +
      "Returns articles with id, title, description, body, formatter, icon, parentId, authorId, state, helpCenterId, translations, createdAt, updatedAt.",
    inputSchema: {
      type: "object" as const,
      properties: {
        helpCenterId: { type: "string", description: "Filter by help center ID" },
        collectionId: { type: "string", description: "Filter by collection ID" },
        state: {
          type: "string",
          enum: ["draft", "live"],
          description: "Filter by article state",
        },
        limit: { type: "number", description: "Results per page (default: 10, max: 100)" },
        cursor: { type: "string", description: "Cursor for next page (from nextCursor in previous response)" },
      },
    },
  },
  {
    name: "create_article",
    description:
      "Create a new help center article. Created as draft by default.",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Article title" },
        body: { type: "string", description: "Article body content (HTML or Markdown depending on formatter)" },
        description: { type: "string", description: "Short description / summary" },
        formatter: {
          type: "string",
          enum: ["default", "ai"],
          description: "Content formatter (default: 'default')",
        },
        parentId: { type: "string", description: "Parent collection ID" },
        icon: {
          type: "object",
          properties: {
            type: { type: "string", description: "Icon type" },
            value: { type: "string", description: "Icon value" },
          },
          description: "Article icon",
        },
        state: {
          type: "string",
          enum: ["draft", "live"],
          description: "Article state (default: 'draft')",
        },
        translations: { type: "object", description: "Translation key-value pairs by locale" },
      },
      required: ["title", "body"],
    },
  },
  {
    name: "get_article",
    description: "Get a single article by ID.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Article ID" },
        state: {
          type: "string",
          enum: ["draft", "live"],
          description: "Which state version to retrieve",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "update_article",
    description: "Update an existing article.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Article ID to update" },
        title: { type: "string", description: "New title" },
        description: { type: "string", description: "New description" },
        body: { type: "string", description: "New body content" },
        formatter: {
          type: "string",
          enum: ["default", "ai"],
          description: "Content formatter",
        },
        icon: {
          type: "object",
          properties: {
            type: { type: "string", description: "Icon type" },
            value: { type: "string", description: "Icon value" },
          },
          description: "New icon",
        },
        parentId: { type: "string", description: "New parent collection ID" },
        authorId: { type: "string", description: "New author ID" },
        state: {
          type: "string",
          enum: ["draft", "live"],
          description: "New article state",
        },
        translations: { type: "object", description: "New translations" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_article",
    description: "Permanently delete an article.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Article ID to delete" },
      },
      required: ["id"],
    },
  },
];

export function createHandlers(client: FeaturebaseClient): Record<string, ToolHandler> {
  return {
    list_help_centers: async (args) => {
      const result = await client.listHelpCenters(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    get_help_center: async (args) => {
      const result = await client.getHelpCenter(args.id as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    list_collections: async (args) => {
      const result = await client.listCollections(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    create_collection: async (args) => {
      const result = await client.createCollection(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    get_collection: async (args) => {
      const result = await client.getCollection(args.id as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    update_collection: async (args) => {
      const { id, ...data } = args;
      const result = await client.updateCollection(id, data);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    delete_collection: async (args) => {
      const result = await client.deleteCollection(args.id as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    list_articles: async (args) => {
      const result = await client.listArticles(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    create_article: async (args) => {
      const result = await client.createArticle(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    get_article: async (args) => {
      const { id, ...params } = args;
      const result = await client.getArticle(id, params);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    update_article: async (args) => {
      const { id, ...data } = args;
      const result = await client.updateArticle(id, data);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    delete_article: async (args) => {
      const result = await client.deleteArticle(args.id as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  };
}

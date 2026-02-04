import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient, ToolHandler } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_custom_fields",
    description: "List all custom fields defined in your FeatureBase organization",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "get_custom_field",
    description: "Get a specific custom field by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Custom field ID" },
      },
      required: ["id"],
    },
  },
];

export function createHandlers(client: FeaturebaseClient): Record<string, ToolHandler> {
  return {
    list_custom_fields: async () => {
      const result = await client.listCustomFields();
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    get_custom_field: async (args) => {
      const result = await client.getCustomField(args.id as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  };
}

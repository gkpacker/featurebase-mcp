import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient, ToolHandler } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_surveys",
    description:
      "List surveys with optional filtering and cursor-based pagination. " +
      "Returns surveys with id, title, description, isActive, responseCount, targeting, pages, and timestamps.",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Results per page (1-100, default: 10)" },
        cursor: { type: "string", description: "Cursor for next page (from nextCursor in previous response)" },
        type: {
          type: "string",
          enum: ["text", "link", "rating", "multiple-choice"],
          description: "Filter by survey page type",
        },
        isActive: { type: "boolean", description: "Filter by active status" },
      },
    },
  },
  {
    name: "get_survey",
    description:
      "Get a single survey by ID, including its pages (questions) with type, title, description, logic, and default action.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Survey ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "get_survey_responses",
    description:
      "Get responses for a specific survey with cursor-based pagination. " +
      "Each response includes the user (if identified), their answers per page, and a timestamp.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Survey ID" },
        pageId: { type: "string", description: "Filter responses to a specific survey page" },
        limit: { type: "number", description: "Results per page (1-100, default: 10)" },
        cursor: { type: "string", description: "Cursor for next page (from nextCursor in previous response)" },
      },
      required: ["id"],
    },
  },
];

export function createHandlers(client: FeaturebaseClient): Record<string, ToolHandler> {
  return {
    list_surveys: async (args) => {
      const result = await client.listSurveys(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    get_survey: async (args) => {
      const result = await client.getSurvey(args.id as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },

    get_survey_responses: async (args) => {
      const { id, ...params } = args;
      const result = await client.getSurveyResponses(id as string, params);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  };
}

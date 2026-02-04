import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import type { FeaturebaseClient } from "./types.js";
import { getAllTools, getAllHandlers } from "./tools/index.js";

export function createServer(client: FeaturebaseClient): Server {
  const server = new Server(
    { name: "featurebase-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  const allTools = getAllTools();
  const allHandlers = getAllHandlers(client);

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: allTools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const handler = allHandlers[name];
    if (!handler) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }

    try {
      return await handler(args ?? {});
    } catch (error) {
      if (error instanceof McpError) throw error;

      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  return server;
}

export async function runServer(client: FeaturebaseClient): Promise<void> {
  const server = createServer(client);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("FeatureBase MCP server running on stdio");
}

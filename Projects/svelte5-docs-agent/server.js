import fs from "fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const docs = fs.readFileSync("./svelte5-docs.txt", "utf-8");

const server = new McpServer({
  name: "svelte5-docs-helper",
  version: "1.0.0"
});

// Register a static resource for the Svelte docs
server.registerResource(
  "svelte_docs",
  null,  // since it's static, no template params
  {
    title: "Svelte 5 Documentation",
    description: "Full text of latest Svelte 5 docs",
    mimeType: "text/plain"
  },
  async () => ({
    contents: [
      {
        uri: "resource://svelte/docs",
        text: docs
      }
    ]
  })
);

// Register search tool
server.registerTool(
  "search_svelte_docs",
  {
    title: "Search Svelte 5 Docs",
    description: "Search the Svelte 5 documentation text for a term",
    inputSchema: z.object({ query: z.string() })
  },
  async ({ query }) => {
    const lines = docs.split("\n");
    const matches = lines.filter(l =>
      l.toLowerCase().includes(query.toLowerCase())
    );
    return {
      content: [
        { type: "text", text: matches.slice(0, 25).join("\n") }
      ]
    };
  }
);

// Connect and run MCP server over stdio
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[svelte5-docs] MCP server ready on stdio");

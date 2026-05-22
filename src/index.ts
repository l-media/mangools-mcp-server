#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z, ZodRawShape } from "zod";
import { ENDPOINTS, extractPathParams, EndpointDef } from "./endpoints.js";
import { callMangools } from "./client.js";

function buildInputSchema(endpoint: EndpointDef): ZodRawShape {
  const shape: ZodRawShape = {};
  for (const param of extractPathParams(endpoint.path)) {
    shape[param] = z
      .union([z.string(), z.number()])
      .describe(`Path parameter '${param}' for ${endpoint.path}`);
  }
  shape.query = z
    .record(z.any())
    .optional()
    .describe(
      "Optional query-string parameters (object of key → value). Arrays become repeated keys; objects are JSON-encoded.",
    );
  if (endpoint.method !== "GET") {
    shape.body = z
      .any()
      .optional()
      .describe(
        "Optional JSON body for the request (object). Sent as application/json.",
      );
  }
  return shape;
}

function buildDescription(endpoint: EndpointDef): string {
  return `[${endpoint.method} ${endpoint.path}] ${endpoint.description}`;
}

async function main() {
  const server = new McpServer(
    {
      name: "mangools-mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  for (const endpoint of ENDPOINTS) {
    const inputSchema = buildInputSchema(endpoint);
    server.registerTool(
      endpoint.name,
      {
        description: buildDescription(endpoint),
        inputSchema,
      },
      async (args: Record<string, unknown>) => {
        const pathParamNames = extractPathParams(endpoint.path);
        const pathParams: Record<string, string | number> = {};
        for (const name of pathParamNames) {
          const v = args[name];
          if (typeof v === "string" || typeof v === "number") {
            pathParams[name] = v;
          }
        }

        try {
          const result = await callMangools({
            method: endpoint.method,
            path: endpoint.path,
            pathParams,
            query: (args.query as Record<string, unknown>) ?? undefined,
            body: args.body,
          });

          const payload = {
            status: result.status,
            ok: result.ok,
            url: result.url,
            contentType: result.contentType,
            body: result.body,
          };

          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(payload, null, 2),
              },
            ],
            isError: !result.ok,
          };
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            content: [
              {
                type: "text" as const,
                text: `Error calling ${endpoint.method} ${endpoint.path}: ${message}`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("[mangools-mcp] fatal:", err);
  process.exit(1);
});

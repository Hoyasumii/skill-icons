import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import {
  BADGE_TOOL,
  buildBadge,
  CATEGORY_IDS,
  ICON_COUNT,
  type McpAnswer,
  MCP_SERVER_NAME,
  MCP_SERVER_VERSION,
  SEARCH_DEFAULT_LIMIT,
  SEARCH_TOOL,
  searchIcons,
} from '../shared/mcp';
import {
  API_URL,
  DEFAULT_PER_LINE,
  DEFAULT_THEME,
  MAX_PER_LINE,
  MIN_PER_LINE,
} from '../shared/icons';

// Remote MCP server: stateless Streamable HTTP, one server per request, answers as plain JSON.
// The answers themselves live in shared/mcp.ts, so the /mcp page can show real examples.

function result({ data, isError }: McpAnswer): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    ...(isError && { isError }),
  };
}

const READ_ONLY = { readOnlyHint: true, openWorldHint: false } as const;

function buildSkillIconsMcpServer(): McpServer {
  const server = new McpServer(
    { name: MCP_SERVER_NAME, version: MCP_SERVER_VERSION },
    {
      instructions:
        `Skill Icons (${API_URL}) renders a row of tech icons as one SVG for a README or portfolio. ` +
        'Find icon ids with skill_icons_search, then get the image URL and ready-to-paste Markdown/HTML ' +
        'from skill_icons_badge. Never write a badge URL by hand: unknown ids are dropped silently by the API, ' +
        'and skill_icons_badge reports them with suggestions instead.',
    },
  );

  server.registerTool(
    SEARCH_TOOL,
    {
      title: 'Search icons',
      description:
        `Find icons among the ${ICON_COUNT} available by id, brand name or alias (e.g. "postgres", "Next.js", "k8s"), ` +
        'optionally within a category. With neither, lists every icon. Each result has the id to use in ' +
        'skill_icons_badge, the official brand name, the category, and whether it has dark and light variants.',
      inputSchema: {
        query: z.string().optional().describe('Text to look for in ids, brand names and aliases.'),
        category: z.enum(CATEGORY_IDS).optional().describe('Only icons in this category.'),
        limit: z
          .number()
          .int()
          .min(1)
          .max(ICON_COUNT)
          .optional()
          .describe(`Most results to return (default ${SEARCH_DEFAULT_LIMIT}).`),
      },
      annotations: { title: 'Search icons', ...READ_ONLY },
    },
    async input => result(searchIcons(input)),
  );

  server.registerTool(
    BADGE_TOOL,
    {
      title: 'Build a skills badge',
      description:
        'Turn a list of icons (ids, aliases or brand names, in display order) into the Skill Icons image URL, ' +
        'plus Markdown and HTML ready to paste into a README. Names that match no icon are left out and ' +
        'listed under `unknown` with suggestions.',
      inputSchema: {
        icons: z
          .array(z.string().min(1))
          .min(1)
          .describe('Icons in the order they should appear, e.g. ["ts", "react", "postgres"].'),
        theme: z
          .enum(['dark', 'light'])
          .optional()
          .describe(`Icon background for themed icons (default ${DEFAULT_THEME}).`),
        perLine: z
          .number()
          .int()
          .min(MIN_PER_LINE)
          .max(MAX_PER_LINE)
          .optional()
          .describe(`Icons per row (default ${DEFAULT_PER_LINE}).`),
      },
      annotations: { title: 'Build a skills badge', ...READ_ONLY },
    },
    async input => result(buildBadge(input)),
  );

  return server;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Accept, Authorization, Mcp-Protocol-Version, Mcp-Session-Id',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
};

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(CORS_HEADERS)) headers.set(name, value);
  return new Response(response.body, { status: response.status, headers });
}

/** Serves `/mcp`. Stateless: there is no session, so GET (server stream) and DELETE (end session) get 405. */
export async function handleMcp(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (request.method !== 'POST') {
    const error = {
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed.' },
      id: null,
    };
    return withCors(
      new Response(JSON.stringify(error), {
        status: 405,
        headers: { 'Content-Type': 'application/json', Allow: 'POST, OPTIONS' },
      }),
    );
  }
  const server = buildSkillIconsMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  try {
    await server.connect(transport);
    return withCors(await transport.handleRequest(request));
  } finally {
    await server.close();
  }
}

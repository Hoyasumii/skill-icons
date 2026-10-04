import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import iconList from '../generated/icon-list.json';
import { categories, type IconCategory } from '../shared/icon-categories';
import {
  aliasesOf,
  API_URL,
  buildIconsUrl,
  DEFAULT_PER_LINE,
  DEFAULT_THEME,
  MAX_PER_LINE,
  MIN_PER_LINE,
  shortNames,
} from '../shared/icons';

// Remote MCP server: stateless Streamable HTTP, one server per request, answers as plain JSON.

const SERVER_NAME = 'skill-icons';
const SERVER_VERSION = '1.0.0';

interface Icon {
  id: string;
  name: string;
  category: IconCategory;
  themed: boolean;
  aliases: string[];
}

const ICONS: Icon[] = iconList.map(icon => ({
  id: icon.name,
  name: icon.displayName,
  category: icon.category as IconCategory,
  themed: icon.themed,
  aliases: aliasesOf(icon.name),
}));

const CATEGORY_IDS = Object.keys(categories) as [IconCategory, ...IconCategory[]];

/** "Next.js", "next js" and "NEXTJS" all become "nextjs". */
const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

const byId = new Map(ICONS.map(icon => [icon.id, icon]));
const byDisplayName = new Map(ICONS.map(icon => [icon.name.toLowerCase(), icon]));
const byNormalized = new Map<string, Icon>();
for (const icon of ICONS) {
  for (const key of [icon.id, icon.name, ...icon.aliases].map(normalize)) {
    if (key && !byNormalized.has(key)) byNormalized.set(key, icon);
  }
}

/** The icon a name, alias or display name ("js", "Node.js", "C++") points at. */
function resolve(input: string): Icon | undefined {
  const lower = input.trim().toLowerCase();
  const exact = byId.get(lower) ?? byId.get(shortNames[lower] ?? '') ?? byDisplayName.get(lower);
  if (exact) return exact;
  const key = normalize(lower);
  return byNormalized.get(key) ?? byNormalized.get(`${key}js`);
}

function distance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length];
}

/** How well an icon matches a normalized query; lower is better, undefined is no match. */
function rank(icon: Icon, query: string): number | undefined {
  const keys = [icon.id, normalize(icon.name), ...icon.aliases];
  if (keys.includes(query)) return 0;
  if (keys.some(key => key.startsWith(query))) return 1;
  if (keys.some(key => key.includes(query))) return 2;
  return undefined;
}

/** Close spellings, for a name that resolves to nothing. */
function suggest(input: string, limit = 5): string[] {
  const query = normalize(input);
  if (!query) return [];
  const scored = ICONS.flatMap(icon => {
    const contained = rank(icon, query);
    if (contained !== undefined) return [{ icon, score: contained }];
    const keys = [icon.id, normalize(icon.name), ...icon.aliases];
    const best = Math.min(...keys.map(key => distance(key, query)));
    return best <= Math.max(1, Math.floor(query.length / 3)) ? [{ icon, score: 2 + best }] : [];
  });
  return scored
    .sort((a, b) => a.score - b.score || a.icon.id.localeCompare(b.icon.id))
    .slice(0, limit)
    .map(({ icon }) => icon.id);
}

function search(query: string | undefined, category: IconCategory | undefined): Icon[] {
  const inCategory = ICONS.filter(icon => !category || icon.category === category);
  const q = normalize(query ?? '');
  if (!q) return inCategory;
  return inCategory
    .flatMap(icon => {
      const score = rank(icon, q);
      return score === undefined ? [] : [{ icon, score }];
    })
    .sort((a, b) => a.score - b.score || a.icon.id.localeCompare(b.icon.id))
    .map(({ icon }) => icon);
}

function result(data: unknown, isError = false): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    ...(isError && { isError }),
  };
}

const READ_ONLY = { readOnlyHint: true, openWorldHint: false } as const;

function buildSkillIconsMcpServer(): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      instructions:
        `Skill Icons (${API_URL}) renders a row of tech icons as one SVG for a README or portfolio. ` +
        'Find icon ids with skill_icons_search, then get the image URL and ready-to-paste Markdown/HTML ' +
        'from skill_icons_badge. Never write a badge URL by hand: unknown ids are dropped silently by the API, ' +
        'and skill_icons_badge reports them with suggestions instead.',
    },
  );

  server.registerTool(
    'skill_icons_search',
    {
      title: 'Search icons',
      description:
        `Find icons among the ${ICONS.length} available by id, brand name or alias (e.g. "postgres", "Next.js", "k8s"), ` +
        'optionally within a category. With neither, lists every icon. Each result has the id to use in ' +
        'skill_icons_badge, the official brand name, the category, and whether it has dark and light variants.',
      inputSchema: {
        query: z.string().optional().describe('Text to look for in ids, brand names and aliases.'),
        category: z.enum(CATEGORY_IDS).optional().describe('Only icons in this category.'),
        limit: z
          .number()
          .int()
          .min(1)
          .max(ICONS.length)
          .optional()
          .describe('Most results to return (default 50).'),
      },
      annotations: { title: 'Search icons', ...READ_ONLY },
    },
    async ({ query, category, limit = 50 }) => {
      const found = search(query, category);
      if (found.length === 0) {
        const suggestions = query ? suggest(query) : [];
        return result({
          total: 0,
          message: `No icon matches "${query}".`,
          ...(suggestions.length > 0 && { didYouMean: suggestions }),
        });
      }
      return result({ total: found.length, icons: found.slice(0, limit) });
    },
  );

  server.registerTool(
    'skill_icons_badge',
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
    async ({ icons, theme, perLine }) => {
      const ids: string[] = [];
      const unknown: { input: string; suggestions: string[] }[] = [];
      for (const input of icons) {
        const icon = resolve(input);
        if (!icon) unknown.push({ input, suggestions: suggest(input) });
        else if (!ids.includes(icon.id)) ids.push(icon.id);
      }
      if (ids.length === 0) {
        return result({ error: 'None of the icons exist.', unknown }, true);
      }
      const url = buildIconsUrl(API_URL, { icons: ids, theme, perLine });
      return result({
        url,
        markdown: `[![My Skills](${url})](${API_URL})`,
        html: `<p align="center">\n  <a href="${API_URL}">\n    <img src="${url}" />\n  </a>\n</p>`,
        icons: ids,
        ...(unknown.length > 0 && { unknown }),
      });
    },
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

import { exports } from 'cloudflare:workers';
import { describe, expect, it } from 'vitest';
import {
  buildBadge,
  MCP_EXAMPLES,
  RESOLUTION_EXAMPLES,
  searchIcons,
} from '../shared/mcp';
import worker from '../worker';

const MCP_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json, text/event-stream',
};

let nextId = 1;

async function rpc(method: string, params: Record<string, unknown> = {}) {
  const res = await exports.default.fetch('https://example.com/mcp', {
    method: 'POST',
    headers: MCP_HEADERS,
    body: JSON.stringify({ jsonrpc: '2.0', id: nextId++, method, params }),
  });
  expect(res.status).toBe(200);
  expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  return res.json<{ result?: any; error?: { message: string } }>();
}

async function callTool(name: string, args: Record<string, unknown>) {
  const { result } = await rpc('tools/call', { name, arguments: args });
  return { isError: result.isError === true, data: JSON.parse(result.content[0].text) };
}

describe('/mcp', () => {
  it('initializes without a session', async () => {
    const res = await exports.default.fetch('https://example.com/mcp', {
      method: 'POST',
      headers: MCP_HEADERS,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 0,
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 'test', version: '1' },
        },
      }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('Mcp-Session-Id')).toBeNull();
    const { result } = await res.json<{ result: any }>();
    expect(result.serverInfo.name).toBe('skill-icons');
    expect(result.instructions).toContain('skill_icons_badge');
  });

  it('lists the tools as read-only', async () => {
    const { result } = await rpc('tools/list');
    const tools = result.tools as { name: string; annotations: { readOnlyHint: boolean } }[];
    expect(tools.map(tool => tool.name).sort()).toEqual([
      'skill_icons_badge',
      'skill_icons_search',
    ]);
    expect(tools.every(tool => tool.annotations.readOnlyHint)).toBe(true);
  });

  describe('skill_icons_search', () => {
    it('finds icons by brand name, best match first', async () => {
      const { data } = await callTool('skill_icons_search', { query: 'Next.js' });
      expect(data.icons[0]).toMatchObject({ id: 'nextjs', name: 'Next.js', aliases: ['next'] });
    });

    it('finds icons by alias', async () => {
      const { data } = await callTool('skill_icons_search', { query: 'k8s' });
      expect(data.icons[0].id).toBe('kubernetes');
    });

    it('filters by category and limits the results', async () => {
      const { data } = await callTool('skill_icons_search', { category: 'database', limit: 3 });
      expect(data.total).toBeGreaterThan(3);
      expect(data.icons).toHaveLength(3);
      expect(data.icons.every((icon: { category: string }) => icon.category === 'database')).toBe(
        true,
      );
    });

    it('suggests close spellings when nothing matches', async () => {
      const { data } = await callTool('skill_icons_search', { query: 'kuberntes' });
      expect(data.total).toBe(0);
      expect(data.didYouMean).toContain('kubernetes');
    });

    it('rejects an unknown category', async () => {
      const { result } = await rpc('tools/call', {
        name: 'skill_icons_search',
        arguments: { category: 'nope' },
      });
      expect(result.isError).toBe(true);
    });
  });

  describe('skill_icons_badge', () => {
    it('resolves ids, aliases and brand names into a short URL', async () => {
      const { isError, data } = await callTool('skill_icons_badge', {
        icons: ['typescript', 'Node.js', 'C++', 'postgres', 'ts'],
        theme: 'light',
        perLine: 4,
      });
      expect(isError).toBe(false);
      expect(data.icons).toEqual(['typescript', 'nodejs', 'cpp', 'postgresql']);
      expect(data.url).toBe(
        'https://skill-icons.alanreisanjo.workers.dev/icons?i=ts,nodejs,cpp,postgres&theme=light&perline=4',
      );
      expect(data.markdown).toBe(
        `[![My Skills](${data.url})](https://skill-icons.alanreisanjo.workers.dev)`,
      );
      expect(data.unknown).toBeUndefined();
    });

    it('leaves out unknown icons and suggests replacements', async () => {
      const { isError, data } = await callTool('skill_icons_badge', {
        icons: ['react', 'reactt', 'zzzzzz'],
      });
      expect(isError).toBe(false);
      expect(data.icons).toEqual(['react']);
      expect(data.unknown).toEqual([
        { input: 'reactt', suggestions: expect.arrayContaining(['react']) },
        { input: 'zzzzzz', suggestions: [] },
      ]);
    });

    it('is an error when no icon exists', async () => {
      const { isError, data } = await callTool('skill_icons_badge', { icons: ['zzzzzz'] });
      expect(isError).toBe(true);
      expect(data.unknown).toHaveLength(1);
    });

    it('returns a URL the image API renders', async () => {
      const { data } = await callTool('skill_icons_badge', { icons: ['js', 'Docker'] });
      const res = await exports.default.fetch(
        data.url.replace(/^https:\/\/[^/]+/, 'https://example.com'),
      );
      expect(res.status).toBe(200);
      expect((await res.text()).match(/<g transform="translate\(\d+, \d+\)"/g)).toHaveLength(2);
    });
  });

  describe('examples on the /mcp page', () => {
    it.each([
      ['skill_icons_search', MCP_EXAMPLES.search, searchIcons(MCP_EXAMPLES.search)],
      ['skill_icons_search', MCP_EXAMPLES.searchNoMatch, searchIcons(MCP_EXAMPLES.searchNoMatch)],
      ['skill_icons_badge', MCP_EXAMPLES.badge, buildBadge(MCP_EXAMPLES.badge)],
      ['skill_icons_badge', MCP_EXAMPLES.badgeUnknown, buildBadge(MCP_EXAMPLES.badgeUnknown)],
      ['skill_icons_badge', MCP_EXAMPLES.badgeNone, buildBadge(MCP_EXAMPLES.badgeNone)],
    ])('%s %j answers what the page shows', async (name, args, shown) => {
      const { isError, data } = await callTool(name, args);
      expect(data).toEqual(shown.data);
      expect(isError).toBe(shown.isError === true);
    });

    it('resolves every name in the resolution order', () => {
      for (const [input, id] of RESOLUTION_EXAMPLES.flat()) {
        expect(buildBadge({ icons: [input] }).data).toMatchObject({ icons: [id] });
      }
    });
  });

  it('answers CORS preflights', async () => {
    const res = await exports.default.fetch('https://example.com/mcp', { method: 'OPTIONS' });
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('Mcp-Protocol-Version');
  });

  it('refuses a GET stream, since there are no sessions', async () => {
    const res = await exports.default.fetch('https://example.com/mcp', {
      headers: { Accept: 'text/event-stream' },
    });
    expect(res.status).toBe(405);
  });

  it('hands a browser the site, which renders the install page', async () => {
    const requested: string[] = [];
    const env = {
      ASSETS: {
        fetch: async (input: Request) => {
          requested.push(new URL(input.url).pathname);
          return new Response('<!doctype html>', { headers: { 'Content-Type': 'text/html' } });
        },
      },
    } as unknown as Env;
    const res = await worker.fetch(
      new Request('https://example.com/mcp', {
        headers: { Accept: 'text/html,application/xhtml+xml' },
      }),
      env,
    );
    expect(res.status).toBe(200);
    expect(requested).toEqual(['/']);
  });
});

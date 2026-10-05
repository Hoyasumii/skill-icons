import { exports } from 'cloudflare:workers';
import { describe, expect, it } from 'vitest';

const get = (path: string) => exports.default.fetch(`https://example.com${path}`);

describe('/icons', () => {
  it('returns an SVG for valid icons', async () => {
    const res = await get('/icons?i=js,ts,react');
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/svg+xml');
    expect(res.headers.get('Cache-Control')).toContain('max-age');
    const svg = await res.text();
    expect(svg).toContain('<svg');
    expect(svg.match(/<g transform="translate\(\d+, \d+\)"/g)).toHaveLength(3);
  });

  it('accepts the long param names and a trailing slash', async () => {
    const res = await get('/icons/?icons=js&t=light');
    expect(res.status).toBe(200);
  });

  it('returns every icon for i=all', async () => {
    const all = await (await get('/api/icons')).json<string[]>();
    const svg = await (await get('/icons?i=all')).text();
    expect(svg.match(/<g transform="translate\(\d+, \d+\)"/g)).toHaveLength(all.length);
  });

  it('requires the i param', async () => {
    const res = await get('/icons');
    expect(res.status).toBe(400);
  });

  it('rejects an invalid theme', async () => {
    const res = await get('/icons?i=js&theme=blue');
    expect(res.status).toBe(400);
  });

  it.each(['0', '-1', '51', 'abc', '2.5'])('rejects perline=%s', async perline => {
    const res = await get(`/icons?i=js&perline=${perline}`);
    expect(res.status).toBe(400);
  });

  it('ignores unknown icons instead of rendering "undefined"', async () => {
    const svg = await (await get('/icons?i=js,notanicon,ts')).text();
    expect(svg).not.toContain('undefined');
    expect(svg.match(/<g transform="translate\(\d+, \d+\)"/g)).toHaveLength(2);
  });

  it('returns 400 when no icon is valid', async () => {
    const res = await get('/icons?i=notanicon');
    expect(res.status).toBe(400);
  });

  it('resolves aliases and themes', async () => {
    const [alias, full] = await Promise.all([
      get('/icons?i=js&theme=light').then(r => r.text()),
      get('/icons?i=javascript&theme=light').then(r => r.text()),
    ]);
    expect(alias).toBe(full);
  });

  it('uses the theme only for themed icons', async () => {
    const [dark, light] = await Promise.all([
      get('/icons?i=react&theme=dark').then(r => r.text()),
      get('/icons?i=react&theme=light').then(r => r.text()),
    ]);
    expect(dark).not.toBe(light);
  });

  it('wraps icons according to perline', async () => {
    const svg = await (await get('/icons?i=js,ts,py,go&perline=2')).text();
    // 2 columns x 2 rows: (2 * 300 - 44) * 48 / 256 = 104.25
    expect(svg).toContain('width="104.25" height="104.25"');
  });
});

describe('/icons opened in a browser', () => {
  const open = (path: string, headers: Record<string, string>) =>
    exports.default.fetch(`https://example.com${path}`, { headers, redirect: 'manual' });

  it('redirects a navigation to the home page', async () => {
    const res = await open('/icons?i=js,ts&theme=light', {
      'Sec-Fetch-Dest': 'document',
      Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
    });
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://example.com/');
    expect(res.headers.get('Cache-Control')).toBe('no-store');
  });

  it('redirects browsers without Fetch Metadata that ask for HTML', async () => {
    const res = await open('/icons?i=js', { Accept: 'text/html,*/*;q=0.8' });
    expect(res.status).toBe(302);
  });

  it('keeps serving the SVG to an <img>', async () => {
    const res = await open('/icons?i=js', { 'Sec-Fetch-Dest': 'image', Accept: 'image/*' });
    expect(res.headers.get('Content-Type')).toBe('image/svg+xml');
    expect(res.headers.get('Vary')).toContain('Sec-Fetch-Dest');
  });
});

describe('/api', () => {
  it('lists icon names', async () => {
    const names = await (await get('/api/icons')).json<string[]>();
    expect(names).toContain('javascript');
    expect(names.every(n => !n.includes('-'))).toBe(true);
  });

  it('returns the SVG map', async () => {
    const svgs = await (await get('/api/svgs')).json<Record<string, string>>();
    expect(svgs['react-dark']).toContain('<svg');
  });

  it('returns 404 for unknown API routes', async () => {
    const res = await get('/api/nope');
    expect(res.status).toBe(404);
  });
});

describe('link previews', () => {
  const asBot = (path: string, userAgent: string) =>
    exports.default.fetch(`https://example.com${path}`, { headers: { 'User-Agent': userAgent } });

  it.each([
    'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
    'Twitterbot/1.0',
    'facebookexternalhit/1.1',
    'WhatsApp/2.23.20.0',
  ])('serves OpenGraph tags to %s', async userAgent => {
    const res = await asBot('/icons?i=js,ts&theme=light', userAgent);
    expect(res.headers.get('Content-Type')).toContain('text/html');
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    const html = await res.text();
    expect(html).toContain(
      '<meta property="og:image" content="https://example.com/og?i=js,ts&amp;theme=light" />',
    );
    expect(html).toContain('javascript, typescript');
  });

  it('passes the title on to the card and the page title', async () => {
    const res = await asBot('/icons?i=js&title=Stack%20%26%20mais', 'Discordbot/2.0');
    const html = await res.text();
    expect(html).toContain('content="https://example.com/og?i=js&amp;title=Stack%20%26%20mais"');
    expect(html).toContain('<title>Stack &amp; mais · Skill Icons</title>');
  });

  it.each(['github-camo (876de43e)', 'Mozilla/5.0 (Macintosh) Chrome/140.0'])(
    'keeps serving the SVG to %s',
    async userAgent => {
      const res = await asBot('/icons?i=js,ts', userAgent);
      expect(res.headers.get('Content-Type')).toBe('image/svg+xml');
    },
  );

  it('still rejects invalid params for bots', async () => {
    const res = await asBot('/icons?i=notanicon', 'Discordbot/2.0');
    expect(res.status).toBe(400);
  });

  it('renders a 1200x630 PNG', async () => {
    const res = await get('/og?i=js,ts,react');
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/png');
    const png = new DataView(await res.arrayBuffer());
    expect(png.getUint32(0)).toBe(0x89504e47);
    expect([png.getUint32(16), png.getUint32(20)]).toEqual([1200, 630]);
  });

  it('renders a link title, even a long one with markup in it', async () => {
    const title = encodeURIComponent('<Stack> do "trabalho" & mais um título bem comprido');
    const res = await get(`/og?i=js,ts&title=${title}`);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/png');
  });

  it('renders the light icons on a dark background', async () => {
    const res = await get('/og?i=js,ts&theme=light&bg=dark');
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/png');
  });

  it.each(['/og?i=js&theme=blue', '/og?i=js&bg=blue'])('validates %s', async path => {
    const res = await get(path);
    expect(res.status).toBe(400);
  });

  it('keeps bg off the SVG and passes it on to the card', async () => {
    const svg = await get('/icons?i=js&bg=dark');
    expect(svg.headers.get('Content-Type')).toBe('image/svg+xml');
    const html = await (await asBot('/icons?i=js&bg=dark', 'Discordbot/2.0')).text();
    expect(html).toContain('content="https://example.com/og?i=js&amp;bg=dark"');
  });
});

describe('pages without a language prefix', () => {
  const open = (path: string, headers: Record<string, string>) =>
    exports.default.fetch(`https://example.com${path}`, {
      headers: { Accept: 'text/html', ...headers },
      redirect: 'manual',
    });

  it.each([
    ['/', '/pt-BR/'],
    ['/?i=js,ts', '/pt-BR/?i=js,ts'],
    ['/mcp', '/pt-BR/mcp'],
  ])('send %s to %s for a Portuguese browser', async (path, target) => {
    const res = await open(path, { 'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8' });
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe(`https://example.com${target}`);
    expect(res.headers.get('Vary')).toContain('Accept-Language');
  });

  it('sends /mcp/ to /mcp for good, keeping the query', async () => {
    const res = await open('/mcp/?x=1', {});
    expect(res.status).toBe(301);
    expect(res.headers.get('Location')).toBe('https://example.com/mcp?x=1');
  });

  // Pages that stay put are served from the build's assets, which this test Worker doesn't have;
  // shared/page-meta's tests cover when the language stays.
});

describe('search engines', () => {
  it.each(['/icons?i=js', '/og?i=js', '/api/icons', '/api/svgs'])(
    'keeps %s out of the index without blocking it',
    async path => {
      const res = await get(path);
      expect(res.status).toBe(200);
      expect(res.headers.get('X-Robots-Tag')).toBe('noindex');
    },
  );
});

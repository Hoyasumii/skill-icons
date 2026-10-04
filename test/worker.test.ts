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
    expect(svg.match(/<g transform/g)).toHaveLength(3);
  });

  it('accepts the long param names and a trailing slash', async () => {
    const res = await get('/icons/?icons=js&t=light');
    expect(res.status).toBe(200);
  });

  it('returns every icon for i=all', async () => {
    const all = await (await get('/api/icons')).json<string[]>();
    const svg = await (await get('/icons?i=all')).text();
    expect(svg.match(/<g transform/g)).toHaveLength(all.length);
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
    expect(svg.match(/<g transform/g)).toHaveLength(2);
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

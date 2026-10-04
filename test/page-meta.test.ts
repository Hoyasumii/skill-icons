import { describe, expect, it } from 'vitest';
import { pageHead } from '../shared/page-meta';
import { withPageMeta } from '../worker/page';

describe('pageHead', () => {
  it('builds the tags of a page in a locale', () => {
    const head = pageHead('mcp', 'pt-BR', 'https://example.com/');
    expect(head).toContain('<title>Servidor MCP · Skill Icons</title>');
    expect(head).toContain('<meta property="og:url" content="https://example.com/mcp" />');
    expect(head).toContain('<meta property="og:locale" content="pt_BR" />');
    expect(head).toContain('<meta property="og:locale:alternate" content="en_US" />');
    expect(head).toContain('<link rel="canonical" href="https://example.com/mcp" />');
    expect(head).toContain(
      '<meta name="twitter:image" content="https://example.com/og-site.png" />',
    );
  });
});

describe('withPageMeta', () => {
  // index.html as the build writes it.
  const shell = () =>
    new Response(
      `<!doctype html><html lang="en"><head><meta charset="UTF-8" />${pageHead('home', 'en', 'https://example.com/')}</head><body></body></html>`,
      { headers: { 'Content-Type': 'text/html', ETag: '"abc"' } },
    );
  const rewrite = async (path: string, page: 'home' | 'mcp', language?: string) => {
    const request = new Request(`https://example.com${path}`, {
      headers: language ? { 'Accept-Language': language } : {},
    });
    return withPageMeta(shell(), request, page);
  };

  it('gives /mcp its own tags, once', async () => {
    const res = await rewrite('/mcp', 'mcp');
    expect(res.headers.get('Vary')).toContain('Accept-Language');
    expect(res.headers.get('ETag')).toBeNull();
    const html = await res.text();
    expect(html).toContain('<title>MCP server · Skill Icons</title>');
    expect(html).toContain('<meta property="og:url" content="https://example.com/mcp" />');
    expect(html).toContain('<meta charset="UTF-8" />');
    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html.match(/property="og:title"/g)).toHaveLength(1);
    expect(html.match(/name="description"/g)).toHaveLength(1);
  });

  it('answers in the language the client prefers', async () => {
    const html = await (await rewrite('/', 'home', 'en;q=0.5, pt-PT')).text();
    expect(html).toContain('<html lang="pt-BR">');
    expect(html).toContain('<meta property="og:locale" content="pt_BR" />');
    expect(html).toContain('<meta property="og:url" content="https://example.com/" />');
  });

  it('falls back to English', async () => {
    const html = await (await rewrite('/', 'home', 'de-DE,*;q=0.1')).text();
    expect(html).toContain('<meta property="og:locale" content="en_US" />');
  });
});

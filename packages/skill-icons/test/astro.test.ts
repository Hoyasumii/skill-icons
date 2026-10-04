import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Icon from '../src/astro/Icon.astro';
import Icons from '../src/astro/Icons.astro';

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

const html = async (component: typeof Icon | typeof Icons, props: Record<string, unknown> = {}) =>
  (await container.renderToString(component as never, { props }))
    .replace(/ data-astro-source-(file|loc)="[^"]*"/g, '')
    .trim();

const remote = (query: string) => `https://skillicons.dev/icons?${query.replaceAll('&', '&amp;')}`;
const DATA = 'data:image/svg+xml;charset=utf-8,%3Csvg';

describe('Icon', () => {
  it('renders an img with an inline data URI', async () => {
    const out = await html(Icon, { name: 'react' });
    expect(out).toMatch(/^<img [^>]*>$/);
    expect(out).toContain('alt="react"');
    expect(out).toContain('width="48"');
    expect(out).toContain('height="48"');
    expect(out).toContain(`src="${DATA}`);
    expect(out).not.toContain('<picture');
  });

  it('applies size', async () => {
    const out = await html(Icon, { name: 'react', size: 32 });
    expect(out).toContain('width="32"');
    expect(out).toContain('height="32"');
  });

  it('renders the light variant for theme="light"', async () => {
    const dark = await html(Icon, { name: 'github' });
    const light = await html(Icon, { name: 'github', theme: 'light' });
    expect(light).not.toContain('<picture');
    expect(light).not.toBe(dark);
  });

  it('wraps in a picture with a light source for theme="auto"', async () => {
    const out = await html(Icon, { name: 'github', theme: 'auto' });
    expect(out).toMatch(
      /^<picture><source media="\(prefers-color-scheme: light\)" srcset="data:[^"]*"><img [^>]*src="data:[^"]*"><\/picture>$/,
    );
  });

  it('skips the picture for auto when both themes are the same', async () => {
    const out = await html(Icon, { name: 'adonis', theme: 'auto' });
    expect(out).not.toContain('<picture');
  });

  it('resolves aliases and keeps the given name as alt', async () => {
    const out = await html(Icon, { name: 'js' });
    expect(out).toContain('alt="js"');
    expect(out).toContain(`src="${DATA}`);
  });

  it('renders nothing for unknown names', async () => {
    expect(await html(Icon, { name: 'not-an-icon' })).toBe('');
    expect(await html(Icon, { name: '' })).toBe('');
  });

  it('spreads extra attributes and lets alt be overridden', async () => {
    const out = await html(Icon, { name: 'react', class: 'logo', alt: 'React logo', id: 'r' });
    expect(out).toContain('class="logo"');
    expect(out).toContain('id="r"');
    expect(out).toContain('alt="React logo"');
  });

  it('uses the remote API in latest mode', async () => {
    expect(await html(Icon, { name: 'brandnew', latest: true })).toContain(
      `src="${remote('i=brandnew&theme=dark&perline=1')}"`,
    );
    const auto = await html(Icon, { name: 'brandnew', latest: true, theme: 'auto' });
    expect(auto).toContain(`srcset="${remote('i=brandnew&theme=light&perline=1')}"`);
    expect(auto).toContain(`src="${remote('i=brandnew&theme=dark&perline=1')}"`);
  });

  it('honors baseUrl in latest mode', async () => {
    const out = await html(Icon, { name: 'react', latest: true, baseUrl: 'https://x.dev/' });
    expect(out).toContain('src="https://x.dev/icons?i=react&amp;theme=dark&amp;perline=1"');
  });
});

describe('Icons', () => {
  it('renders one composed img sized for the grid', async () => {
    const out = await html(Icons, { names: ['js', 'ts', 'react'], perLine: 2, size: 32 });
    expect(out).toMatch(/^<img [^>]*>$/);
    expect(out).toContain('alt="js, ts, react"');
    expect(out).toContain('width="69.5"');
  });

  it('drops unknown names', async () => {
    const out = await html(Icons, { names: ['js', 'nope', 'ts'] });
    expect(out).toContain('alt="js, ts"');
  });

  it('renders nothing when no names are known', async () => {
    expect(await html(Icons, { names: [] })).toBe('');
    expect(await html(Icons, { names: ['nope'] })).toBe('');
  });

  it('supports auto and extra attributes', async () => {
    const out = await html(Icons, { names: ['github', 'react'], theme: 'auto', class: 'row' });
    expect(out).toContain('<picture>');
    expect(out).toContain('class="row"');
  });

  it('uses the remote API in latest mode', async () => {
    const out = await html(Icons, {
      names: ['js', 'newthing'],
      latest: true,
      perLine: 5,
      baseUrl: 'https://x.dev',
    });
    expect(out).toContain('src="https://x.dev/icons?i=js,newthing&amp;theme=dark&amp;perline=5"');
    expect(out).toContain('alt="js, newthing"');
  });
});

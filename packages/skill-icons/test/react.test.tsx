import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { loadIcon } from '../src/core/index.js';
import { Icon, Icons, SkillIconsProvider } from '../src/react/index.js';

// React 19 also emits a <link rel="preload"> for plain images during SSR.
const render = (node: React.ReactNode) =>
  renderToStaticMarkup(node).replace(/<link rel="preload"[^>]*>/g, '');

const remote = (query: string) =>
  `https://skill-icons.alanreisanjo.workers.dev/icons?${query.replaceAll('&', '&amp;')}`;

describe('Icon', () => {
  it('renders a placeholder until the bundled SVG loads', async () => {
    expect(render(<Icon name="vue" size={32} />)).toBe(
      '<span aria-hidden="true" style="display:inline-block;width:32px;height:32px"></span>',
    );
    await loadIcon('vuejs-dark');
    expect(render(<Icon name="vue" size={32} />)).toMatch(
      /^<img alt="vue" width="32" height="32" src="data:image\/svg\+xml;charset=utf-8,%3Csvg[^"]*"\/>$/,
    );
  });

  it('loads from the deploy in latest mode', () => {
    expect(render(<Icon latest name="brand-new" theme="light" />)).toBe(
      `<img alt="brand-new" width="48" height="48" src="${remote('i=brand-new&theme=light&perline=1')}"/>`,
    );
  });

  it('renders nothing for unknown names', () => {
    // @ts-expect-error: unknown names are rejected outside latest mode
    expect(render(<Icon name="nope" />)).toBe('');
  });

  it('switches to the light variant with the system in auto mode', async () => {
    await Promise.all([loadIcon('react-dark'), loadIcon('react-light')]);
    const html = render(<Icon name="react" theme="auto" />);
    expect(html).toMatch(
      /^<picture><source media="\(prefers-color-scheme: light\)" srcSet="data:[^"]+"\/><img alt="react" width="48" height="48" src="data:[^"]+"\/><\/picture>$/,
    );
    const [light, dark] = [...html.matchAll(/"(data:[^"]+)"/g)].map(m => m[1]);
    expect(light).not.toBe(dark);
  });

  it('skips the <picture> for icons without variants', async () => {
    await loadIcon('adonis');
    expect(render(<Icon name="adonis" theme="auto" />)).toMatch(/^<img /);
  });

  it('requests both variants from the deploy in auto mode', () => {
    expect(render(<Icon latest name="x" theme="auto" />)).toBe(
      `<picture><source media="(prefers-color-scheme: light)" srcSet="${remote('i=x&theme=light&perline=1')}"/>` +
        `<img alt="x" width="48" height="48" src="${remote('i=x&theme=dark&perline=1')}"/></picture>`,
    );
  });
});

describe('Icons', () => {
  it('composes bundled icons into one image', async () => {
    await Promise.all(['javascript', 'typescript'].map(loadIcon));
    const html = render(<Icons names={['js', 'ts']} alt="Skills" />);
    expect(html).toContain('alt="Skills"');
    expect(html).toContain('width="104.25"');
  });

  it('loads from the deploy in latest mode', () => {
    expect(render(<Icons latest names={['js', 'brand-new']} perLine={1} baseUrl="/x" />)).toBe(
      '<img alt="js, brand-new" width="48" src="/x/icons?i=js,brand-new&amp;theme=dark&amp;perline=1"/>',
    );
  });

  it('composes both variants in auto mode', async () => {
    await Promise.all(['javascript', 'react-dark', 'react-light'].map(loadIcon));
    expect(render(<Icons names={['js', 'react']} theme="auto" />)).toMatch(
      /^<picture><source media="[^"]+" srcSet="data:[^"]+"\/><img alt="js, react" width="104.25" src="data:[^"]+"\/><\/picture>$/,
    );
  });

  it('rejects baseUrl outside latest mode', () => {
    // @ts-expect-error: baseUrl only applies to latest mode
    render(<Icons names={['js']} baseUrl="/x" />);
  });
});

describe('SkillIconsProvider', () => {
  it('sets the default theme', () => {
    expect(
      render(
        <SkillIconsProvider theme="light">
          <Icon latest name="x" />
        </SkillIconsProvider>,
      ),
    ).toContain('theme=light');
  });

  it('is overridden by the theme prop', () => {
    expect(
      render(
        <SkillIconsProvider theme="light">
          <Icon latest name="x" theme="dark" />
        </SkillIconsProvider>,
      ),
    ).toContain('theme=dark');
  });

  it('inherits from an outer provider when no theme is given', () => {
    expect(
      render(
        <SkillIconsProvider theme="auto">
          <SkillIconsProvider>
            <Icon latest name="x" />
          </SkillIconsProvider>
        </SkillIconsProvider>,
      ),
    ).toMatch(/^<picture>/);
  });
});

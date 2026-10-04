import { renderToString, renderToStringAsync } from 'solid-js/web';
import { describe, expect, it } from 'vitest';
import { loadIcon } from '../src/core/index.js';
import { Icon, Icons, SkillIconsProvider } from '../src/solid/index.js';

// Drop Solid's hydration keys, which don't matter here.
const strip = (html: string) => html.replace(/ data-hk="[^"]*"|<!--[^>]*-->/g, '');
const render = (fn: () => any) => strip(renderToString(fn));

const remote = (query: string) => `https://skill-icons.alanreisanjo.workers.dev/icons?${query}`;

describe('Icon', () => {
  it('renders a placeholder until the bundled SVG loads', async () => {
    const placeholder = render(() => (
      <Icon name="solidjs" size={32} class="x" style={{ opacity: 0.5 }} />
    ));
    expect(placeholder).toMatch(
      /^<span aria-hidden="true" class="x" style="[^"]*width:32px;height:32px[^"]*opacity:0\.5[^"]*"><\/span>$/,
    );
    await loadIcon('solidjs-dark');
    expect(render(() => <Icon name="solidjs" size={32} />)).toMatch(
      /^<img alt="solidjs" width="32" height="32" src="data:image\/svg\+xml;charset=utf-8,%3Csvg[^"]*"\/?>$/,
    );
  });

  it('works with renderToStringAsync', async () => {
    await loadIcon('react-dark');
    const html = strip(
      await renderToStringAsync(() => <Icon name="react" alt="React" class="c" />),
    );
    expect(html).toMatch(/^<img [^>]*class="c "[^>]*>$/);
    expect(html).toContain('alt="React"');
  });

  it('loads from the deploy in latest mode', () => {
    const html = render(() => <Icon latest name="brand-new" theme="light" />);
    expect(html).toContain('alt="brand-new"');
    expect(html).toContain(`src="${remote('i=brand-new&amp;theme=light&amp;perline=1')}"`);
  });

  it('honors baseUrl in latest mode', () => {
    expect(render(() => <Icon latest name="x" baseUrl="https://example.com/" />)).toContain(
      'src="https://example.com/icons?i=x&amp;theme=dark&amp;perline=1"',
    );
  });

  it('renders nothing for unknown names', () => {
    // @ts-expect-error: unknown names are rejected outside latest mode
    expect(render(() => <Icon name="nope" />)).toBe('');
    // @ts-expect-error: an empty name isn't a bundled icon either
    expect(render(() => <Icon name="" />)).toBe('');
  });

  it('rejects baseUrl outside latest mode', () => {
    // @ts-expect-error: baseUrl only exists in latest mode
    render(() => <Icon name="react" baseUrl="https://example.com" />);
  });

  it('switches to the light variant with the system in auto mode', async () => {
    await Promise.all([loadIcon('react-dark'), loadIcon('react-light')]);
    const html = render(() => <Icon name="react" theme="auto" />);
    expect(html).toMatch(
      /^<picture><source media="\(prefers-color-scheme: light\)" srcset="data:[^"]+"\/?><img /,
    );
    const [light, dark] = [...html.matchAll(/="(data:[^"]+)"/g)].map(m => m[1]);
    expect(light).not.toBe(dark);
  });

  it('skips the <picture> for icons without variants', async () => {
    await loadIcon('adonis');
    expect(render(() => <Icon name="adonis" theme="auto" />)).toMatch(/^<img /);
  });

  it('requests both variants from the deploy in auto mode', () => {
    const html = render(() => <Icon latest name="x" theme="auto" />);
    expect(html).toContain(`srcset="${remote('i=x&amp;theme=light&amp;perline=1')}"`);
    expect(html).toContain(`src="${remote('i=x&amp;theme=dark&amp;perline=1')}"`);
    expect(html).toMatch(/^<picture>/);
  });
});

describe('Icons', () => {
  it('composes bundled icons into one image', async () => {
    await Promise.all(['javascript', 'typescript'].map(loadIcon));
    const html = render(() => <Icons names={['js', 'ts']} alt="Skills" />);
    expect(html).toContain('alt="Skills"');
    expect(html).toContain('width="');
    expect(html).toContain('data:image/svg+xml');
  });

  it('renders a placeholder, then nothing for only unknown names', () => {
    expect(
      render(() => <Icons names={['svelte', 'vue']} perLine={1} size={10} theme="light" />),
    ).toMatch(/^<span aria-hidden="true" style="[^"]*width:10px;height:\d+(\.\d+)?px/);
    // @ts-expect-error: unknown names are rejected outside latest mode
    expect(render(() => <Icons names={['nope']} />)).toBe('');
  });

  it('loads from the deploy in latest mode', () => {
    const html = render(() => <Icons latest names={['a', 'B']} perLine={2} />);
    expect(html).toContain(`src="${remote('i=a,b&amp;theme=dark&amp;perline=2')}"`);
    expect(html).toContain('alt="a, B"');
  });
});

describe('SkillIconsProvider', () => {
  const src = (theme?: any, inner?: any) => (
    <SkillIconsProvider theme={theme}>
      <Icon latest name="x" />
      {inner}
    </SkillIconsProvider>
  );

  it('sets the default theme and nested providers inherit it', () => {
    expect(render(() => src('light'))).toContain('theme=light');
    const nested = render(() => (
      <SkillIconsProvider theme="light">
        <SkillIconsProvider>
          <Icon latest name="x" />
        </SkillIconsProvider>
      </SkillIconsProvider>
    ));
    expect(nested).toContain('theme=light');
  });

  it('lets the own theme prop win', () => {
    const html = render(() => (
      <SkillIconsProvider theme="light">
        <Icon latest name="x" theme="dark" />
      </SkillIconsProvider>
    ));
    expect(html).toContain('theme=dark');
    expect(html).not.toContain('theme=light');
  });
});

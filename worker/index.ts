import iconsJson from '../generated/icons.json';
import {
  DEFAULT_PER_LINE,
  DEFAULT_THEME,
  MAX_PER_LINE,
  MIN_PER_LINE,
  shortNames,
  type Theme,
} from '../shared/icons';

const icons: Record<string, string> = iconsJson;
const iconNameList = [...new Set(Object.keys(icons).map(i => i.split('-')[0]))];
const themedIcons = new Set(
  Object.keys(icons)
    .filter(i => i.endsWith('-light') || i.endsWith('-dark'))
    .map(i => i.split('-')[0]),
);

const ONE_ICON = 48;
const SCALE = ONE_ICON / (300 - 44);

const CACHE_HEADERS = { 'Cache-Control': 'public, max-age=86400' };

function generateSvg(iconNames: string[], perLine: number): string {
  const iconSvgList = iconNames.map(i => icons[i]);

  const length = Math.min(perLine * 300, iconNames.length * 300) - 44;
  const height = Math.ceil(iconSvgList.length / perLine) * 300 - 44;
  const scaledHeight = height * SCALE;
  const scaledWidth = length * SCALE;

  return `
  <svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${length} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
    ${iconSvgList
      .map(
        (i, index) =>
          `
        <g transform="translate(${(index % perLine) * 300}, ${Math.floor(index / perLine) * 300})">
          ${i}
        </g>
        `,
      )
      .join(' ')}
  </svg>
  `;
}

/** Resolves short names and themes to icon keys, dropping unknown names. */
function parseShortNames(names: string[], theme: Theme): string[] {
  return names.flatMap(rawName => {
    const lower = rawName.trim().toLowerCase();
    const name = iconNameList.includes(lower) ? lower : shortNames[lower];
    if (!name) return [];
    return [name + (themedIcons.has(name) ? `-${theme}` : '')];
  });
}

function badRequest(message: string): Response {
  return new Response(message, { status: 400 });
}

function json(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json;charset=UTF-8', ...CACHE_HEADERS },
  });
}

function handleIcons(searchParams: URLSearchParams): Response {
  const iconParam = searchParams.get('i') || searchParams.get('icons');
  if (!iconParam) return badRequest("You didn't specify any icons!");

  const themeParam = searchParams.get('t') || searchParams.get('theme') || DEFAULT_THEME;
  if (themeParam !== 'dark' && themeParam !== 'light')
    return badRequest('Theme must be either "light" or "dark"');
  const theme: Theme = themeParam;

  const perLineParam = searchParams.get('perline');
  const perLine = perLineParam ? Number(perLineParam) : DEFAULT_PER_LINE;
  if (!Number.isInteger(perLine) || perLine < MIN_PER_LINE || perLine > MAX_PER_LINE)
    return badRequest(
      `Icons per line must be a number between ${MIN_PER_LINE} and ${MAX_PER_LINE}`,
    );

  const iconShortNames = iconParam === 'all' ? iconNameList : iconParam.split(',');
  const iconNames = parseShortNames(iconShortNames, theme);
  if (iconNames.length === 0) return badRequest("You didn't format the icons param correctly!");

  return new Response(generateSvg(iconNames, perLine), {
    headers: { 'Content-Type': 'image/svg+xml', ...CACHE_HEADERS },
  });
}

export default {
  async fetch(request, env) {
    const { pathname, searchParams } = new URL(request.url);
    const path = pathname.replace(/^\/|\/$/g, '');

    try {
      if (path === 'icons') return handleIcons(searchParams);
      if (path === 'api/icons') return json(iconNameList);
      if (path === 'api/svgs') return json(icons);
      if (path.startsWith('api/')) return new Response('Not found', { status: 404 });
      return env.ASSETS.fetch(request);
    } catch (err) {
      return new Response(err instanceof Error ? err.stack : String(err), { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;

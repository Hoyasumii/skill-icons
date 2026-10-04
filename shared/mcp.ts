import iconList from '../generated/icon-list.json';
import { categories, type IconCategory } from './icon-categories';
import { aliasesOf, API_URL, buildIconsUrl, shortNames, type Theme } from './icons';

// What the MCP tools answer, without the SDK: the Worker serves it, the /mcp page shows it as examples.

export const MCP_SERVER_NAME = 'skill-icons';
export const MCP_SERVER_VERSION = '1.0.0';
export const SEARCH_TOOL = 'skill_icons_search';
export const BADGE_TOOL = 'skill_icons_badge';
export const SEARCH_DEFAULT_LIMIT = 50;
export const MAX_SUGGESTIONS = 5;

interface McpIcon {
  id: string;
  name: string;
  category: IconCategory;
  themed: boolean;
  aliases: string[];
}

const ICONS: McpIcon[] = iconList.map(icon => ({
  id: icon.name,
  name: icon.displayName,
  category: icon.category as IconCategory,
  themed: icon.themed,
  aliases: aliasesOf(icon.name),
}));

export const ICON_COUNT = ICONS.length;
export const CATEGORY_IDS = Object.keys(categories) as [IconCategory, ...IconCategory[]];

/** "Next.js", "next js" and "NEXTJS" all become "nextjs". */
const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

const byId = new Map(ICONS.map(icon => [icon.id, icon]));
const byDisplayName = new Map(ICONS.map(icon => [icon.name.toLowerCase(), icon]));
const byNormalized = new Map<string, McpIcon>();
for (const icon of ICONS) {
  for (const key of [icon.id, icon.name, ...icon.aliases].map(normalize)) {
    if (key && !byNormalized.has(key)) byNormalized.set(key, icon);
  }
}

/** The icon a name, alias or display name ("js", "Node.js", "C++") points at. */
function resolve(input: string): McpIcon | undefined {
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
function rank(icon: McpIcon, query: string): number | undefined {
  const keys = [icon.id, normalize(icon.name), ...icon.aliases];
  if (keys.includes(query)) return 0;
  if (keys.some(key => key.startsWith(query))) return 1;
  if (keys.some(key => key.includes(query))) return 2;
  return undefined;
}

/** Close spellings, for a name that resolves to nothing. */
function suggest(input: string, limit = MAX_SUGGESTIONS): string[] {
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

function search(query: string | undefined, category: IconCategory | undefined): McpIcon[] {
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

export interface McpAnswer {
  data: unknown;
  isError?: boolean;
}

export interface SearchInput {
  query?: string;
  category?: IconCategory;
  limit?: number;
}

/** What skill_icons_search answers. */
export function searchIcons({
  query,
  category,
  limit = SEARCH_DEFAULT_LIMIT,
}: SearchInput): McpAnswer {
  const found = search(query, category);
  if (found.length === 0) {
    const suggestions = query ? suggest(query) : [];
    return {
      data: {
        total: 0,
        message: `No icon matches "${query}".`,
        ...(suggestions.length > 0 && { didYouMean: suggestions }),
      },
    };
  }
  return { data: { total: found.length, icons: found.slice(0, limit) } };
}

export interface BadgeInput {
  icons: string[];
  theme?: Theme;
  perLine?: number;
}

/** What skill_icons_badge answers. */
export function buildBadge({ icons, theme, perLine }: BadgeInput): McpAnswer {
  const ids: string[] = [];
  const unknown: { input: string; suggestions: string[] }[] = [];
  for (const input of icons) {
    const icon = resolve(input);
    if (!icon) unknown.push({ input, suggestions: suggest(input) });
    else if (!ids.includes(icon.id)) ids.push(icon.id);
  }
  if (ids.length === 0) {
    return { data: { error: 'None of the icons exist.', unknown }, isError: true };
  }
  const url = buildIconsUrl(API_URL, { icons: ids, theme, perLine });
  return {
    data: {
      url,
      markdown: `[![My Skills](${url})](${API_URL})`,
      html: `<p align="center">\n  <a href="${API_URL}">\n    <img src="${url}" />\n  </a>\n</p>`,
      icons: ids,
      ...(unknown.length > 0 && { unknown }),
    },
  };
}

/** Inputs the /mcp page shows next to their real answers; test/mcp.test.ts checks them against the server. */
export const MCP_EXAMPLES = {
  search: { query: 'postgres' },
  searchNoMatch: { query: 'kuberntes' },
  badge: {
    icons: ['typescript', 'Node.js', 'C++', 'postgres', 'ts'],
    theme: 'light',
    perLine: 4,
  },
  badgeUnknown: { icons: ['react', 'reactt', 'zzzzzz'] },
  badgeNone: { icons: ['zzzzzz'] },
} satisfies Record<string, SearchInput | BadgeInput>;

/** One example per step of `resolve`, in the order it tries them: what people type → the icon id. */
export const RESOLUTION_EXAMPLES: [input: string, id: string][][] = [
  [['typescript', 'typescript']],
  [
    ['ts', 'typescript'],
    ['postgres', 'postgresql'],
    ['k8s', 'kubernetes'],
  ],
  [
    ['C++', 'cpp'],
    ['Google Cloud', 'gcp'],
  ],
  [['node.js', 'nodejs']],
  [['node', 'nodejs']],
];

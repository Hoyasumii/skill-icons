import iconList from '../../generated/icon-list.json';
import { categories, type IconCategory } from '../../shared/icon-categories';
import { aliasesOf, shortNames, type Theme } from '../../shared/icons';

export interface IconInfo {
  name: string;
  displayName: string;
  themed: boolean;
  category: IconCategory;
  aliases: string[];
}

export const ICONS: IconInfo[] = iconList.map(icon => ({
  ...icon,
  category: icon.category as IconCategory,
  aliases: aliasesOf(icon.name),
}));

export const CATEGORIES = Object.keys(categories) as IconCategory[];

const iconsByName = new Map(ICONS.map(icon => [icon.name, icon]));

/** Icons in `category` (all when null) whose name, display name or an alias contains `query`. */
export function filterIcons(query: string, category: IconCategory | null): IconInfo[] {
  const q = query.trim().toLowerCase();
  return ICONS.filter(
    icon =>
      (!category || icon.category === category) &&
      (!q ||
        icon.name.includes(q) ||
        icon.displayName.toLowerCase().includes(q) ||
        icon.aliases.some(alias => alias.includes(q))),
  );
}

/** Resolves a name or alias (e.g. "js") to its canonical icon name. */
export function resolveIconName(name: string): string | undefined {
  const lower = name.trim().toLowerCase();
  if (iconsByName.has(lower)) return lower;
  return shortNames[lower];
}

export function displayNameOf(name: string): string {
  return iconsByName.get(name)?.displayName ?? name;
}

/** Static thumbnail served from /public/svg, without going through the Worker. */
export function iconSrc(name: string, theme: Theme): string {
  const themed = iconsByName.get(name)?.themed;
  return `${import.meta.env.BASE_URL}svg/${name}${themed ? `-${theme}` : ''}.svg`;
}

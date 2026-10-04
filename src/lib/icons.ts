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

/** Resolves a name or alias (e.g. "js") to its canonical icon name. */
export function resolveIconName(name: string): string | undefined {
  const lower = name.trim().toLowerCase();
  if (iconsByName.has(lower)) return lower;
  return shortNames[lower];
}

/** Static thumbnail served from /public/svg, without going through the Worker. */
export function iconSrc(name: string, theme: Theme): string {
  const themed = iconsByName.get(name)?.themed;
  return `${import.meta.env.BASE_URL}svg/${name}${themed ? `-${theme}` : ''}.svg`;
}

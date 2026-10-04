// Shared between the Worker (API) and the site (builder).

import { cleanTitle } from './badge-title';

export type Theme = 'dark' | 'light';

export const DEFAULT_THEME: Theme = 'dark';
export const DEFAULT_PER_LINE = 15;
export const MIN_PER_LINE = 1;
export const MAX_PER_LINE = 50;

/** Worker deploy serving the menu, /icons and /api/*. */
export const API_URL = 'https://skill-icons.alanreisanjo.workers.dev';

/** GitHub Pages deploy of the builder; people opening an /icons link land here. */
export const PAGES_URL = 'https://hoyasumii.github.io/skill-icons/';

export const shortNames: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  tailwind: 'tailwindcss',
  vue: 'vuejs',
  nuxt: 'nuxtjs',
  go: 'golang',
  cf: 'cloudflare',
  wasm: 'webassembly',
  postgres: 'postgresql',
  k8s: 'kubernetes',
  next: 'nextjs',
  mongo: 'mongodb',
  md: 'markdown',
  ps: 'photoshop',
  ai: 'illustrator',
  pr: 'premiere',
  ae: 'aftereffects',
  scss: 'sass',
  sc: 'scala',
  net: 'dotnet',
  gatsbyjs: 'gatsby',
  gql: 'graphql',
  vlang: 'v',
  amazonwebservices: 'aws',
  bots: 'discordbots',
  express: 'expressjs',
  googlecloud: 'gcp',
  mui: 'materialui',
  windi: 'windicss',
  unreal: 'unrealengine',
  nest: 'nestjs',
  ktorio: 'ktor',
  pwsh: 'powershell',
  au: 'audition',
  rollup: 'rollupjs',
  rxjs: 'reactivex',
  rxjava: 'reactivex',
  ghactions: 'githubactions',
  sklearn: 'scikitlearn',
};

/** All aliases that resolve to the given icon name. */
export function aliasesOf(name: string): string[] {
  return Object.keys(shortNames).filter(alias => shortNames[alias] === name);
}

/** The shortest name that resolves to the icon, to keep generated URLs compact. */
export function shortestName(name: string): string {
  return [name, ...aliasesOf(name)].reduce((a, b) => (b.length < a.length ? b : a));
}

export interface IconsUrlOptions {
  icons: string[];
  theme?: Theme;
  perLine?: number;
  /** Badge title for the link preview card; the SVG itself ignores it. */
  title?: string;
}

/** Builds an /icons URL, omitting parameters that match the defaults. */
export function buildIconsUrl(
  base: string,
  { icons, theme, perLine, title }: IconsUrlOptions,
): string {
  const params = [`i=${icons.map(shortestName).join(',')}`];
  if (theme && theme !== DEFAULT_THEME) params.push(`theme=${theme}`);
  if (perLine && perLine !== DEFAULT_PER_LINE) params.push(`perline=${perLine}`);
  const cleanedTitle = cleanTitle(title);
  if (cleanedTitle) params.push(`title=${encodeURIComponent(cleanedTitle)}`);
  return `${base}/icons?${params.join('&')}`;
}

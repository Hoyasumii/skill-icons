import type { IconCategory } from '../../../shared/icon-categories';
import type { PresetId } from '../../lib/presets';

const categories: Record<IconCategory, string> = {
  language: 'Languages',
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Databases',
  cloud: 'Cloud',
  devops: 'DevOps',
  tooling: 'Tooling',
  testing: 'Testing',
  observability: 'Observability',
  auth: 'Auth',
  ide: 'IDEs',
  ai: 'AI',
  design: 'Design',
  game: 'Game dev',
  payments: 'Payments',
  os: 'OS & hardware',
  social: 'Social',
  productivity: 'Productivity',
};

const presetNames: Record<PresetId, string> = {
  web: 'Modern web',
  backend: 'Backend',
  tooling: 'Tooling',
  ai: 'AI',
};

export const en = {
  meta: {
    title: 'Skill Icons',
    description: 'Showcase your skills on your GitHub or resumé with ease!',
  },
  header: {
    title: 'Skill Icons',
    tagline: 'build your stack → paste in your README',
    language: 'Language',
    toDark: 'Switch to dark theme',
    toLight: 'Switch to light theme',
    github: 'github',
  },
  picker: {
    searchPlaceholder: 'Search icons, e.g. react, ts, postgres',
    searchLabel: 'Search icons',
    categoriesLabel: 'Categories',
    filterLabel: 'Filter by category',
    all: 'All',
    allIcons: 'All icons',
    gridTitle: (category: string, count: number) => `${category} · ${count}`,
    hint: 'tap to add',
    noResultsFor: (query: string) => `Nothing found for “${query}”.`,
    clearSearch: 'Clear search',
  },
  presets: {
    label: 'Ready-made stacks · one tap adds them all',
    names: presetNames,
    missing: (count: number) => `+${count}`,
    complete: 'in stack ✓',
  },
  categories,
  stack: {
    title: 'Your stack',
    export: 'Export',
    dockEmpty: 'Tap icons to build your stack.',
    empty: 'Empty for now. Pick icons or use a ready-made stack.',
    hint: 'tap an icon in your stack to move or remove it',
    clearAll: 'clear all',
    shuffle: 'Shuffle',
    close: 'Close',
    position: (name: string, position: number) => `${name}, position ${position}`,
    moveLeft: (name: string) => `Move ${name} left`,
    moveRight: (name: string) => `Move ${name} right`,
    remove: 'Remove',
  },
  options: {
    iconTheme: 'Icon theme',
    dark: 'Dark',
    light: 'Light',
    perLine: 'Icons per line',
    fewer: 'Fewer icons per line',
    more: 'More icons per line',
  },
  preview: {
    readme: 'README preview',
    component: 'Component preview',
    heading: 'My skills',
    empty: 'The preview shows up once your stack has icons.',
    alt: 'Preview of your stack',
  },
  output: {
    format: 'Format',
    badgeAlt: 'My Skills',
    copy: (format: string) => `Copy ${format}`,
    copied: 'Copied!',
    copyFailed: 'Could not copy. Select the text and copy it manually.',
    linkHint: "this page's link also keeps your stack",
  },
  package: {
    label: 'Package',
    framework: 'Framework',
    install: 'Copy install command',
    installed: 'Command copied',
    hint: 'ready-made components on npm:',
  },
};

export type Messages = typeof en;

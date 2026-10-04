import type { IconCategory } from '../../../shared/icon-categories';

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

export const en = {
  meta: {
    title: 'Skill Icons',
    description: 'Showcase your skills on your GitHub or resumé with ease!',
  },
  header: {
    title: 'Skill Icons',
    tagline: 'Pick your skills and get a ready-to-paste badge for your GitHub README or resumé.',
    language: 'Language',
    toggleTheme: 'Toggle site theme',
  },
  steps: {
    choose: '1. Choose icons',
    chooseDescription: 'Click to add or remove. Order is preserved.',
    customize: '2. Customize',
    copy: '3. Copy',
    copyDescription: "Paste it into your README. This page's link also keeps your selection.",
    emptyPreview: 'Select at least one icon to see the preview.',
  },
  picker: {
    searchPlaceholder: (count: number, category?: string) =>
      `Search ${count} ${category ? `${category} ` : ''}icons…`,
    searchLabel: 'Search icons',
    filterLabel: 'Filter by category',
    all: 'All',
    noResults: 'No icons found.',
    noResultsFor: (query: string) => `No icons found for “${query}”.`,
  },
  categories,
  selected: {
    empty: 'No icons selected yet. Pick some from the list.',
    count: (count: number) => `${count} selected · use the arrows to reorder`,
    clearAll: 'Clear all',
    moveLeft: (name: string) => `Move ${name} left`,
    moveRight: (name: string) => `Move ${name} right`,
    remove: (name: string) => `Remove ${name}`,
  },
  options: {
    iconTheme: 'Icon theme',
    dark: 'Dark',
    light: 'Light',
    perLine: 'Icons per line',
  },
  output: {
    previewAlt: 'Preview of the selected icons',
    badgeAlt: 'My Skills',
    htmlCentered: 'HTML (centered)',
    copy: 'Copy',
    copied: 'Copied to clipboard',
    copyFailed: 'Could not copy. Select the text and copy it manually.',
  },
};

export type Messages = typeof en;

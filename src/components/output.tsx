import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/i18n';
import type { Messages } from '@/i18n/messages/en';
import { API_URL, buildIconsUrl, type IconsUrlOptions } from '../../shared/icons';

const FORMATS = {
  url: { label: () => 'URL', render: (url: string) => url },
  markdown: {
    label: () => 'Markdown',
    render: (url: string, t: Messages) => `[![${t.output.badgeAlt}](${url})](${API_URL})`,
  },
  html: {
    label: (t: Messages) => t.output.htmlCentered,
    render: (url: string) =>
      `<p align="center">\n  <a href="${API_URL}">\n    <img src="${url}" />\n  </a>\n</p>`,
  },
} as const;

type Format = keyof typeof FORMATS;

const PACKAGE_NAME = '@hoyasumii/skill-icons';
const PACKAGE_URL = `https://www.npmjs.com/package/${PACKAGE_NAME}`;

const LIBRARIES = {
  react: {
    label: 'React',
    render: ({ names, props }: LibraryInput) =>
      `import { Icons } from '${PACKAGE_NAME}/react';\n\n<Icons names={${names}}${props.jsx} />`,
  },
  vue: {
    label: 'Vue',
    render: ({ names, props }: LibraryInput) =>
      `<script setup lang="ts">\nimport { Icons } from '${PACKAGE_NAME}/vue';\n</script>\n\n<template>\n  <Icons :names="${names}"${props.vue} />\n</template>`,
  },
  svelte: {
    label: 'Svelte',
    render: ({ names, props }: LibraryInput) =>
      `<script lang="ts">\n  import { Icons } from '${PACKAGE_NAME}/svelte';\n</script>\n\n<Icons names={${names}}${props.jsx} />`,
  },
  solid: {
    label: 'Solid',
    render: ({ names, props }: LibraryInput) =>
      `import { Icons } from '${PACKAGE_NAME}/solid';\n\n<Icons names={${names}}${props.jsx} />`,
  },
  angular: {
    label: 'Angular',
    render: ({ names, props }: LibraryInput) =>
      `import { Component } from '@angular/core';\nimport { Icons } from '${PACKAGE_NAME}/angular';\n\n@Component({\n  imports: [Icons],\n  template: \`<skill-icons [names]="${names}"${props.angular} />\`,\n})\nexport class Skills {}`,
  },
  astro: {
    label: 'Astro',
    render: ({ names, props }: LibraryInput) =>
      `---\nimport { Icons } from '${PACKAGE_NAME}/astro';\n---\n\n<Icons names={${names}}${props.jsx} />`,
  },
  element: {
    label: 'Web Component',
    render: ({ icons, theme, perLine }: LibraryInput) =>
      `<script type="module">\n  import '${PACKAGE_NAME}/element/define';\n</script>\n\n<skill-icons names="${icons.join(',')}" theme="${theme}" per-line="${perLine}"></skill-icons>`,
  },
} as const;

type Library = keyof typeof LIBRARIES;

interface LibraryInput extends IconsUrlOptions {
  names: string;
  props: { jsx: string; vue: string; angular: string };
}

function libraryInput({ icons, theme, perLine }: IconsUrlOptions): LibraryInput {
  const names = `[${icons.map(icon => `'${icon}'`).join(', ')}]`;
  return {
    icons,
    theme,
    perLine,
    names,
    props: {
      jsx: ` theme="${theme}" perLine={${perLine}}`,
      vue: ` theme="${theme}" :per-line="${perLine}"`,
      angular: ` theme="${theme}" [perLine]="${perLine}"`,
    },
  };
}

function CopyBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(t.output.copied);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t.output.copyFailed);
    }
  };

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg border bg-muted p-3 pr-12 font-mono text-sm whitespace-pre-wrap break-all">
        {value}
      </pre>
      <Button
        variant="outline"
        size="icon-sm"
        className="absolute top-2 right-2"
        onClick={copy}
        aria-label={t.output.copy}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  );
}

export function Output(options: IconsUrlOptions) {
  // Dev previews hit the local Worker; the built site (Pages is static) and snippets use the public API.
  const previewUrl = buildIconsUrl(import.meta.env.DEV ? '' : API_URL, options);
  const publicUrl = buildIconsUrl(API_URL, options);
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center overflow-x-auto rounded-lg border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-size-[16px_16px] p-6">
        <img src={previewUrl} alt={t.output.previewAlt} className="max-w-none" />
      </div>

      <Tabs defaultValue={'markdown' satisfies Format}>
        <TabsList>
          {(Object.keys(FORMATS) as Format[]).map(format => (
            <TabsTrigger key={format} value={format}>
              {FORMATS[format].label(t)}
            </TabsTrigger>
          ))}
        </TabsList>
        {(Object.keys(FORMATS) as Format[]).map(format => (
          <TabsContent key={format} value={format}>
            <CopyBlock value={FORMATS[format].render(publicUrl, t)} />
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex flex-col gap-2">
        <h3 className="font-heading text-sm font-medium">{t.output.libraryTitle}</h3>
        <p className="text-sm text-muted-foreground">
          {t.output.libraryDescription}{' '}
          <a
            href={PACKAGE_URL}
            className="font-mono underline underline-offset-4 hover:text-foreground"
          >
            {PACKAGE_NAME}
          </a>
        </p>
        <CopyBlock value={`npm install ${PACKAGE_NAME}`} />
        <Tabs defaultValue={'react' satisfies Library}>
          <TabsList className="flex-wrap h-auto">
            {(Object.keys(LIBRARIES) as Library[]).map(library => (
              <TabsTrigger key={library} value={library}>
                {LIBRARIES[library].label}
              </TabsTrigger>
            ))}
          </TabsList>
          {(Object.keys(LIBRARIES) as Library[]).map(library => (
            <TabsContent key={library} value={library}>
              <CopyBlock value={LIBRARIES[library].render(libraryInput(options))} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

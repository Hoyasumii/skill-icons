import { useState } from 'react';
import { BracesIcon, CodeXmlIcon, HashIcon, LinkIcon, XIcon, type LucideIcon } from 'lucide-react';
import { CodeBlock } from '@/components/code-block';
import { CopyButton } from '@/components/copy-button';
import { ExportOptions } from '@/components/export-options';
import { PackagePopover } from '@/components/package-popover';
import { SectionLabel } from '@/components/section-label';
import { ReadmePreview } from '@/components/readme-preview';
import { StackTray, type StackProps } from '@/components/stack-tray';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/i18n';
import {
  FORMATS,
  FRAMEWORKS,
  LINK_FORMATS,
  renderFramework,
  type Format,
  type FrameworkId,
} from '@/lib/snippets';
import { cleanTitle } from '../../shared/badge-title';
import { API_URL, buildIconsUrl, type Theme } from '../../shared/icons';

const FORMAT_ICONS: Record<Format, LucideIcon> = {
  markdown: HashIcon,
  html: CodeXmlIcon,
  url: LinkIcon,
};

interface ExportPanelProps {
  /** Rendered inside the bottom sheet instead of the wide column. */
  compact: boolean;
  stack: StackProps;
  perLine: number;
  format: Format;
  framework: FrameworkId;
  savedCount: number;
  onSave: (name: string) => void;
  onShuffle: () => void;
  onClear: () => void;
  onThemeChange: (theme: Theme) => void;
  onPerLineChange: (perLine: number) => void;
  onFormatChange: (format: Format) => void;
  onFrameworkChange: (framework: FrameworkId) => void;
  /** Badge title as typed (undefined until edited); it becomes the alt text of every snippet. */
  title: string | undefined;
  onTitleChange: (title: string | undefined) => void;
}

export function ExportPanel({
  compact,
  stack,
  perLine,
  format,
  framework,
  savedCount,
  onSave,
  onShuffle,
  onClear,
  onThemeChange,
  onPerLineChange,
  onFormatChange,
  onFrameworkChange,
  title,
  onTitleChange,
}: ExportPanelProps) {
  const { t } = useI18n();
  const [packageOpen, setPackageOpen] = useState(false);
  const options = { icons: stack.icons, theme: stack.theme, perLine };
  const empty = stack.icons.length === 0;
  // An emptied stack takes the panel away; the popover goes with it.
  if (empty && packageOpen) setPackageOpen(false);

  const alt = cleanTitle(title) ?? t.preview.heading;
  // Only an edited title goes in the link (like the page URL), for its preview card.
  const linkTitle = alt === t.preview.heading ? undefined : alt;

  const snippet = LINK_FORMATS[format].render(
    buildIconsUrl(API_URL, { ...options, title: linkTitle }),
    alt,
  );
  const component = renderFramework(framework, options, alt);

  // Only the active tab's content is mounted, so every tab can share it.
  const content = (
    <>
      <CodeBlock
        value={empty ? '—' : snippet}
        lang={empty ? 'text' : LINK_FORMATS[format].lang}
        size="fixed"
      />
      <CopyButton
        key={snippet}
        value={snippet}
        label={t.output.copy(LINK_FORMATS[format].label)}
        disabled={empty}
      />
      <p className="font-mono text-xs text-muted-foreground">
        <LinkIcon aria-hidden="true" className="mr-1 inline size-3.5 align-[-3px]" />
        {t.output.linkHint}
      </p>
    </>
  );

  return (
    <div className="flex flex-col gap-[22px]">
      <StackTray
        stack={stack}
        compact={compact}
        savedCount={savedCount}
        onSave={onSave}
        onShuffle={onShuffle}
        onClear={onClear}
        actions={
          <>
            <PackagePopover
              open={packageOpen}
              onOpenChange={setPackageOpen}
              framework={framework}
              onFrameworkChange={onFrameworkChange}
              theme={stack.theme}
              component={component}
              empty={empty}
            />
            {compact && (
              <SheetClose asChild>
                <Button variant="hairline" size="icon-sm" aria-label={t.stack.close}>
                  <XIcon />
                </Button>
              </SheetClose>
            )}
          </>
        }
      />
      <ExportOptions
        theme={stack.theme}
        perLine={perLine}
        onThemeChange={onThemeChange}
        onPerLineChange={onPerLineChange}
      />
      <ReadmePreview
        options={options}
        label={packageOpen ? t.preview.component : t.preview.readme}
        fileName={packageOpen ? FRAMEWORKS[framework].fileName : 'README.md'}
        title={title}
        onTitleChange={onTitleChange}
      />
      <Tabs value={format} onValueChange={value => onFormatChange(value as Format)}>
        <SectionLabel id="format-label" icon={BracesIcon}>
          {t.output.format}
        </SectionLabel>
        <TabsList aria-labelledby="format-label">
          {FORMATS.map(value => {
            const Icon = FORMAT_ICONS[value];
            return (
              <TabsTrigger key={value} value={value} className="gap-1.5">
                <Icon aria-hidden="true" className="size-[15px]" strokeWidth={2.2} />
                {LINK_FORMATS[value].label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {FORMATS.map(value => (
          <TabsContent key={value} value={value}>
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

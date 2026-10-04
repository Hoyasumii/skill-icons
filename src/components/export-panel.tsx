import { XIcon } from 'lucide-react';
import { CodeBlock } from '@/components/code-block';
import { CopyButton } from '@/components/copy-button';
import { ExportOptions } from '@/components/export-options';
import { FrameworkPicker, InstallRow } from '@/components/package-options';
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
  PACKAGE_NAME,
  PACKAGE_URL,
  renderFramework,
  type Format,
  type FrameworkId,
} from '@/lib/snippets';
import { API_URL, buildIconsUrl, type Theme } from '../../shared/icons';

interface ExportPanelProps {
  /** Rendered inside the bottom sheet instead of the wide column. */
  compact: boolean;
  stack: StackProps;
  perLine: number;
  format: Format;
  framework: FrameworkId;
  onShuffle: () => void;
  onClear: () => void;
  onThemeChange: (theme: Theme) => void;
  onPerLineChange: (perLine: number) => void;
  onFormatChange: (format: Format) => void;
  onFrameworkChange: (framework: FrameworkId) => void;
}

export function ExportPanel({
  compact,
  stack,
  perLine,
  format,
  framework,
  onShuffle,
  onClear,
  onThemeChange,
  onPerLineChange,
  onFormatChange,
  onFrameworkChange,
}: ExportPanelProps) {
  const { t } = useI18n();
  const options = { icons: stack.icons, theme: stack.theme, perLine };
  const empty = stack.icons.length === 0;

  const isPackage = format === 'package';
  const target = isPackage ? FRAMEWORKS[framework] : LINK_FORMATS[format];
  const snippet = isPackage
    ? renderFramework(framework, options)
    : LINK_FORMATS[format].render(buildIconsUrl(API_URL, options), t.output.badgeAlt);

  // Only the active tab's content is mounted, so every tab can share it.
  const content = (
    <>
      {isPackage && (
        <>
          <FrameworkPicker value={framework} onChange={onFrameworkChange} />
          <InstallRow />
        </>
      )}
      <CodeBlock
        value={empty ? '—' : snippet}
        lang={empty ? 'text' : target.lang}
        tall={isPackage}
      />
      <CopyButton
        key={snippet}
        value={snippet}
        label={t.output.copy(target.label)}
        disabled={empty}
      />
      <p className="font-mono text-xs text-muted-foreground">
        {isPackage ? (
          <>
            {t.package.hint}{' '}
            <a
              href={PACKAGE_URL}
              className="text-foreground underline underline-offset-3 hover:no-underline"
            >
              {PACKAGE_NAME} ↗
            </a>
          </>
        ) : (
          t.output.linkHint
        )}
      </p>
    </>
  );

  return (
    <div className="flex flex-col gap-[22px]">
      <StackTray
        stack={stack}
        compact={compact}
        onShuffle={onShuffle}
        onClear={onClear}
        actions={
          compact && (
            <SheetClose asChild>
              <Button variant="hairline" size="icon-sm" aria-label={t.stack.close}>
                <XIcon />
              </Button>
            </SheetClose>
          )
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
        label={isPackage ? t.preview.component : t.preview.readme}
        fileName={isPackage ? FRAMEWORKS[framework].fileName : 'README.md'}
      />
      <Tabs value={format} onValueChange={value => onFormatChange(value as Format)}>
        <TabsList aria-label={t.output.format}>
          {FORMATS.map(value => (
            <TabsTrigger key={value} value={value}>
              {value === 'package' ? t.package.label : LINK_FORMATS[value].label}
            </TabsTrigger>
          ))}
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

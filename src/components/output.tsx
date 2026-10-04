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
    </div>
  );
}

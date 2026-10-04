import { CheckIcon, CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/use-copy';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  value: string;
  /** Names what gets copied, e.g. "Copy Markdown". */
  label: string;
  disabled?: boolean;
}

/** The primary CTA. Remount it (key) when `value` changes so a stale "Copied!" never shows. */
export function CopyButton({ value, label, disabled }: CopyButtonProps) {
  const { copied, copy } = useCopy();
  const { t } = useI18n();
  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <Button
      variant="highlight"
      size="cta"
      disabled={disabled}
      onClick={() => copy(value)}
      className={cn(
        'disabled:opacity-50',
        copied &&
          'translate-x-[3px] translate-y-[3px] bg-foreground text-background shadow-none hover:bg-foreground',
      )}
    >
      <Icon strokeWidth={copied ? 2.6 : 2.2} />
      <span aria-live="polite">{copied ? t.output.copied : label}</span>
    </Button>
  );
}

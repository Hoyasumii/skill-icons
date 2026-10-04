import type { KeyboardEvent } from 'react';
import { CheckIcon, ChevronDownIcon, CopyIcon } from 'lucide-react';
import { Select } from 'radix-ui';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/use-copy';
import { useI18n } from '@/i18n';
import { iconSrc } from '@/lib/icons';
import { FRAMEWORKS, INSTALL_COMMAND, type FrameworkId } from '@/lib/snippets';
import { cn } from '@/lib/utils';
import type { Theme } from '../../shared/icons';

const FRAMEWORK_IDS = Object.keys(FRAMEWORKS) as FrameworkId[];

interface FrameworkSelectProps {
  value: FrameworkId;
  theme: Theme;
  onChange: (framework: FrameworkId) => void;
  /** The step title that names the combobox. */
  labelledBy: string;
}

/**
 * A combobox styled like the language menu. On the closed trigger, ↑/↓ step through the
 * frameworks without opening the list; Escape closes the list before the popover around it.
 */
export function FrameworkSelect({ value, theme, onChange, labelledBy }: FrameworkSelectProps) {
  const { fileName, icon, label } = FRAMEWORKS[value];

  const step = (event: KeyboardEvent<HTMLButtonElement>) => {
    const offset = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (!offset) return;
    // Stops Radix from opening the list on the same key.
    event.preventDefault();
    const index = FRAMEWORK_IDS.indexOf(value) + offset;
    if (index >= 0 && index < FRAMEWORK_IDS.length) onChange(FRAMEWORK_IDS[index]);
  };

  return (
    <Select.Root value={value} onValueChange={id => onChange(id as FrameworkId)}>
      <Select.Trigger
        aria-labelledby={labelledBy}
        onKeyDown={step}
        className="group flex h-13 w-full min-w-0 items-center gap-3 rounded-lg border-2 border-border bg-card px-3 text-left transition-colors hover:border-foreground/40 data-[state=open]:border-foreground"
      >
        <img src={iconSrc(icon, theme)} alt="" className="size-7 shrink-0" />
        <span className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="truncate text-base font-semibold">
            <Select.Value>{label}</Select.Value>
          </span>
          <span className="truncate font-mono text-xs text-muted-foreground">{fileName}</span>
        </span>
        <Select.Icon asChild>
          <ChevronDownIcon
            strokeWidth={2.4}
            className="size-4 shrink-0 transition-transform duration-[260ms] ease-spring group-data-[state=open]:rotate-180"
          />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          collisionPadding={12}
          className="z-50 max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-hidden rounded-[14px] border-2 border-foreground bg-card text-foreground shadow-[4px_4px_0_var(--foreground)] data-[state=closed]:animate-out data-[state=closed]:duration-[140ms] data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:duration-[280ms] data-[state=open]:ease-spring data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90"
        >
          <Select.Viewport className="p-1.5">
            {FRAMEWORK_IDS.map(id => (
              <Select.Item
                key={id}
                value={id}
                className="relative flex h-11 cursor-pointer items-center gap-3 rounded-md pr-9 pl-2.5 outline-hidden select-none data-highlighted:bg-muted data-[state=checked]:bg-highlight data-[state=checked]:text-highlight-foreground"
              >
                <img src={iconSrc(FRAMEWORKS[id].icon, theme)} alt="" className="size-6 shrink-0" />
                <Select.ItemText asChild>
                  <span className="text-[15px] font-semibold">{FRAMEWORKS[id].label}</span>
                </Select.ItemText>
                <span className="truncate font-mono text-[11px] opacity-70">
                  {FRAMEWORKS[id].fileName}
                </span>
                <Select.ItemIndicator className="absolute right-2.5">
                  <CheckIcon className="size-[18px]" strokeWidth={2.6} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

/** A secondary copy: it never takes the yellow. */
export function InstallRow() {
  const { copied, copy } = useCopy();
  const { t } = useI18n();
  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <div className="flex items-start gap-2">
      <code className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-lg border bg-muted px-3 py-2.5 font-mono text-[13px] leading-[19px] [overflow-wrap:anywhere]">
        <span aria-hidden="true" className="text-muted-foreground">
          $
        </span>
        {INSTALL_COMMAND}
      </code>
      <Button
        variant="hairline"
        size="icon"
        aria-label={copied ? t.package.installed : t.package.install}
        onClick={() => copy(INSTALL_COMMAND)}
        className={cn('size-12', copied && 'bg-foreground text-background hover:bg-foreground')}
      >
        <Icon strokeWidth={copied ? 2.6 : 2.2} />
      </Button>
    </div>
  );
}

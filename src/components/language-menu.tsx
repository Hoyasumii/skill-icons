import { ChevronDownIcon, LanguagesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LOCALE_CODES, LOCALE_NAMES, LOCALES, useI18n, type Locale } from '@/i18n';

export function LanguageMenu() {
  const { locale, t, setLocale } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label={`${t.header.language}: ${LOCALE_NAMES[locale]}`}
          className="gap-1.5 px-2.5"
        >
          <LanguagesIcon />
          <span className="font-mono text-[13px] font-semibold">{LOCALE_CODES[locale]}</span>
          <ChevronDownIcon
            strokeWidth={2.4}
            className="size-3.5 transition-transform duration-[260ms] ease-spring group-aria-expanded/button:rotate-180"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-62">
        <DropdownMenuLabel>{t.header.language}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale} onValueChange={value => setLocale(value as Locale)}>
          {LOCALES.map(value => (
            <DropdownMenuRadioItem key={value} value={value} lang={value}>
              <span className="inline-flex h-[26px] w-10 shrink-0 items-center justify-center rounded-[7px] border-2 border-current font-mono text-[11px] font-semibold">
                {LOCALE_CODES[value]}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-px">
                <span className="font-semibold">{LOCALE_NAMES[value]}</span>
                <span className="font-mono text-[11px] opacity-70">{value}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

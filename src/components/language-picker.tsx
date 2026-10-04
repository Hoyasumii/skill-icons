import { ChevronDownIcon, LanguagesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LOCALE_NAMES, LOCALES, useI18n, type Locale } from '@/i18n';

export function LanguagePicker() {
  const { locale, t, setLocale } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label={`${t.header.language}: ${LOCALE_NAMES[locale]}`}
          className="gap-1.5 px-2.5 text-muted-foreground"
        >
          <LanguagesIcon />
          <span className="text-xs font-medium tracking-wide">{locale}</span>
          <ChevronDownIcon className="size-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-48">
        <DropdownMenuLabel>{t.header.language}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={locale} onValueChange={value => setLocale(value as Locale)}>
          {LOCALES.map(value => (
            <DropdownMenuRadioItem key={value} value={value} lang={value}>
              {LOCALE_NAMES[value]}
              <span className="ml-auto pl-4 text-xs text-muted-foreground">{value}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

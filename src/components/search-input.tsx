import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  const { t } = useI18n();

  return (
    <div className="relative">
      <SearchIcon
        strokeWidth={2.2}
        className="pointer-events-none absolute top-3.5 left-3.5 size-5"
        aria-hidden="true"
      />
      <Input
        type="search"
        autoComplete="off"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t.picker.searchPlaceholder}
        aria-label={t.picker.searchLabel}
        className="pl-11"
      />
    </div>
  );
}

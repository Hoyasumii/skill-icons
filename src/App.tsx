import { useMemo, useState } from 'react';
import { CategoryRail, CategorySidebar } from '@/components/category-nav';
import { IconGrid } from '@/components/icon-grid';
import { Options } from '@/components/options';
import { Output } from '@/components/output';
import { SearchInput } from '@/components/search-input';
import { SelectedIcons } from '@/components/selected-icons';
import { SiteHeader } from '@/components/site-header';
import { useBuilderState } from '@/hooks/use-builder-state';
import { usePop } from '@/hooks/use-pop';
import { useI18n } from '@/i18n';
import { filterIcons } from '@/lib/icons';
import { REPO_URL } from '@/lib/links';
import type { IconCategory } from '../shared/icon-categories';

export function App() {
  const { state, toggleIcon, moveIcon, clearIcons, setTheme, setPerLine } = useBuilderState();
  const { t } = useI18n();
  const { pop, isPopping } = usePop();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<IconCategory | null>(null);

  const filtered = useMemo(() => filterIcons(query, category), [query, category]);

  const toggle = (name: string) => {
    if (!state.icons.includes(name)) pop(name);
    toggleIcon(name);
  };

  // Temporary: rendered in both columns until the export panel and sheet land.
  const exportPanel = (
    <>
      <SelectedIcons
        icons={state.icons}
        theme={state.theme}
        onRemove={toggleIcon}
        onMove={moveIcon}
        onClear={clearIcons}
      />
      <Options
        theme={state.theme}
        perLine={state.perLine}
        onThemeChange={setTheme}
        onPerLineChange={setPerLine}
      />
      {state.icons.length > 0 ? (
        <Output icons={state.icons} theme={state.theme} perLine={state.perLine} />
      ) : (
        <p className="text-sm text-muted-foreground">{t.steps.emptyPreview}</p>
      )}
    </>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[232px_minmax(0,1fr)_400px]">
        <CategorySidebar value={category} onChange={setCategory} />

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex flex-[1_0_auto] flex-col gap-5 px-4 pt-4 pb-6 lg:px-7 lg:pt-6 lg:pb-10">
            <SearchInput value={query} onChange={setQuery} />
            <CategoryRail value={category} onChange={setCategory} />
            <IconGrid
              icons={filtered}
              title={t.picker.gridTitle(
                category ? t.categories[category] : t.picker.allIcons,
                filtered.length,
              )}
              query={query}
              selected={state.icons}
              theme={state.theme}
              isPopping={isPopping}
              onToggle={toggle}
              onClearSearch={() => setQuery('')}
            />
            <footer className="mt-auto lg:hidden">
              <a
                href={REPO_URL}
                className="inline-flex h-11 items-center font-mono text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {t.header.github}
              </a>
            </footer>
          </div>

          <aside className="flex flex-col gap-6 border-t bg-card p-4 lg:hidden">
            {exportPanel}
          </aside>
        </main>

        <aside className="hidden flex-col gap-6 border-l bg-card p-6 lg:flex lg:min-h-0 lg:overflow-y-auto">
          {exportPanel}
        </aside>
      </div>
    </div>
  );
}

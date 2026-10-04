import { useMemo, useState } from 'react';
import { CategoryRail, CategorySidebar } from '@/components/category-nav';
import { Dock } from '@/components/dock';
import { ExportPanel } from '@/components/export-panel';
import { IconGrid } from '@/components/icon-grid';
import { PresetList } from '@/components/preset-list';
import { SearchInput } from '@/components/search-input';
import { SiteHeader } from '@/components/site-header';
import type { StackProps } from '@/components/stack-tray';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useBuilderState } from '@/hooks/use-builder-state';
import { useIsWide } from '@/hooks/use-is-wide';
import { usePop } from '@/hooks/use-pop';
import { useI18n } from '@/i18n';
import { filterIcons } from '@/lib/icons';
import { REPO_URL } from '@/lib/links';
import { POP_ALL } from '@/lib/motion';
import type { IconCategory } from '../shared/icon-categories';

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function App() {
  const builder = useBuilderState();
  const { state } = builder;
  const { t } = useI18n();
  const wide = useIsWide();
  const { pop, isPopping } = usePop();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<IconCategory | null>(null);
  const [liftedId, setLiftedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => filterIcons(query, category), [query, category]);
  // Removing the lifted icon some other way (grid, clear all) drops the lift with it.
  const lifted = liftedId && state.icons.includes(liftedId) ? liftedId : null;

  const toggle = (name: string) => {
    if (!state.icons.includes(name)) pop(name);
    builder.toggleIcon(name);
  };

  const addPreset = (names: string[]) => {
    if (!names.length) return;
    builder.addIcons(names);
    pop(POP_ALL);
  };

  const stack: StackProps = {
    icons: state.icons,
    theme: state.theme,
    lifted,
    isPopping,
    onLift: name => setLiftedId(lifted === name ? null : name),
    onMove: offset => {
      if (!lifted) return;
      const from = state.icons.indexOf(lifted);
      builder.moveIcon(from, from + offset);
      pop(lifted);
    },
    onRemove: () => {
      if (lifted) builder.toggleIcon(lifted);
      setLiftedId(null);
    },
  };

  const exportPanel = (
    <ExportPanel
      compact={!wide}
      stack={stack}
      perLine={state.perLine}
      onShuffle={() => {
        builder.setIcons(shuffled(state.icons));
        pop(POP_ALL);
      }}
      onClear={builder.clearIcons}
      onThemeChange={builder.setTheme}
      onPerLineChange={builder.setPerLine}
    />
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
            <PresetList selected={state.icons} theme={state.theme} onAdd={addPreset} />
            <IconGrid
              icons={filtered}
              title={t.picker.gridTitle(
                category ? t.categories[category] : t.picker.allIcons,
                filtered.length,
              )}
              query={query}
              selected={state.icons}
              theme={state.theme}
              isPopping={name => isPopping(name, false)}
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

          <Dock stack={stack} onExport={() => setSheetOpen(true)} />
        </main>

        {wide ? (
          <aside
            aria-label={t.stack.export}
            className="min-h-0 overflow-y-auto border-l bg-card p-6"
          >
            {exportPanel}
          </aside>
        ) : (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent>{exportPanel}</SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
}
